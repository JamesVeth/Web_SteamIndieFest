// #region Navbar

/* 
    Topic: const navbar = document.querySelector('.navbar');

    This looks for a class in the CSS file called '.navbar' and applies that style,
    in this case is: .navbar.active ul { left: 0; } in CSS

    Remember: if you want to change this, set left to 40px, 100px, etc, don't forget the px, else it won't work
*/

    const navbar = document.querySelector('.navbar');
    navbar.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

// #endregion


// #region Schedule

/* 
    Topic: querySelectorAll vs querySelector

    querySelectorAll is to select all classes, for example
    querySelector is to only select the very first class the interpreter sees, not the rest
    Generally you should use all for classes and selector, or getElementByID's for individual id's
*/

    const scheduleTables = document.querySelectorAll('.schedule-table');
    const scheduleDots = document.querySelectorAll('.schedule-nav .dot');
    const prevScheduleButton = document.getElementById('prev-schedule-button');
    const nextScheduleButton = document.getElementById('next-schedule-button');

/* 
    Topic: querySelectorAll creates an array/NodeList

    querySelectorAll() in JavaScript does not return an array, but it returns a 
    NodeList of DOM elements that match the specified selector(s). It is similar
    to an array in functionality, but is technically not an array (it's actually a Class).

*/

    function updateActiveScheduleDot() {
    // Remove the CSS class styling from it, so it reverts back to a grey dot
        scheduleDots.forEach(dot => dot.classList.remove('active')); 
    // Apply this CSS class styling to the active dot to make it green colour
        scheduleDots[currentScheduleIndex].classList.add('active'); 
    }

    function showScheduleTable(index) { // Hide or show the current selected table

        scheduleTables.forEach(table => table.style.display = 'none'); // start by hiding each table

        scheduleTables[index].style.display = 'block'; // show the current table (set array index to block)

        updateActiveScheduleDot(); // update the dot to reflect active table
    }

    // Starting Table / Dot
    let currentScheduleIndex = 0;
    showScheduleTable(currentScheduleIndex);


    // Event click listeners for buttons and dots

/* 
    Topic: currentScheduleIndex = (currentScheduleIndex - 1 + scheduleTables.length) % scheduleTables.length;

    currentScheduleIndex - 1 ... Move back one step in the array
    + scheduleTables.length  ...  Even if the result is negative, adding .length makes it positive and wrap round, e.g: (0 - 1 + 3) = 3
    % scheduleTables.length  ... The modulus operator (%) ensures the index stays within bounds, 
    e.g. (1 - 1 + 3) % 3 = 1 
    0 o o (0 going to 2)
    0 - 1 = -1 
    -1 + 3 = 2
    2 % 3 = 1
*/

    prevScheduleButton.addEventListener('click', () => {
        currentScheduleIndex = (currentScheduleIndex - 1 + scheduleTables.length) % scheduleTables.length;
        showScheduleTable(currentScheduleIndex);
    });

    nextScheduleButton.addEventListener('click', () => {
        currentScheduleIndex = (currentScheduleIndex + 1) % scheduleTables.length;
        showScheduleTable(currentScheduleIndex);
    });

    scheduleDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentScheduleIndex = index;
            showScheduleTable(currentScheduleIndex);
        });
    });

    /* 
    Pseudo Code for Schedule Section:

    Set variables
    Set current table index to 0 starting

    ** run show schedule table function:
        show current table baed on index 0
        set each table to 'none'/ invisible
        set the table at current table index to 'block' / visible
            run update schedule dots function:
                pass current index to this function
                remove each dot from a CSS class called 'active' and make them default style
                add a CSS class (glowing green) to the dot that is at the passed in current index value

    assign 2 event listeners: prev and next button clicks:
        when either button is clicked:
            increment/decrement the current table index 
            ensure that the current table index stays within 0 to 2 
            without using if statement, mathematically use modulo operator to loop back to the start / end
            show current table based on current table index
            run show schedule table function **
        
    */


// #endregion


// #region Games

    const gameContainer = document.getElementById("games-container");
    const dotsContainer = document.getElementById("dotsContainer");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

 /* 
    Topic: ... spread operator

    The spread syntax (...) is used to convert the NodeList 
    returned by querySelectorAll into a proper array.

    Here it's taking a NodeList, which is a class, and then assigning 
    it to an actual array called games.

    The reason we turn this into an array is because we want it to be dynamic.
 */   

    let games = [...document.querySelectorAll(".games-card")];
    // Get the starting card's width, including offset
    let gameWidth = games[0].offsetWidth + 16; // Include the gap; this information is taken from the dom object
    let index = 0;
    let isTransitioning = false; // Prevent multiple transitions at once

    // Touch Functionality
    let startX = 0;
    let moveX = 0;
    let threshold = 50; // Minimum swipe distance

    // Mouse wheel scroll (smooth horizontal movement)
    let scrollTimeout; // create an id for timeout, this allows the timer to be stopped

    // Centre the cards and the container to as close to center as possible
    function centreScroll() {
        let viewportWidth = window.innerWidth;
        let activeCard = games[index]; // Get the current active card
        let activeCardWidth = activeCard.offsetWidth + (window.innerWidth * 0.2);
        let offset = (viewportWidth / 2) - (activeCardWidth / 2); // Perfect centre
        let translateX = offset - (index * gameWidth);
        gameContainer.style.transform = `translateX(${translateX}px)`;
    }

    // Create dots dynamically
    // Basically get the size of our games array, which is a NodeList of our games-card html divs converted to an array
    // create a dot thats an empty div
    // inside that div add a class type to and stylise it in the CSS; they are just border-radius: 50% circles
    // 
    function createDots() {
        dotsContainer.innerHTML = "";
        for (let i = 0; i < games.length; i++) {
            let dot = document.createElement("div");
            dot.classList.add("dot");
            dotsContainer.appendChild(dot); // Add our dots to that empty html div container
        }
        updateDots(); // update dots
    }

    // Update dots and active card
    function updateDots() {
        // let dots = document.querySelectorAll(".dot"); // This interferes with schedule dots
        // this .dot was created in the createDots function; there is no .dot in the actual html file
        let dots = document.querySelectorAll("#dotsContainer .dot"); 
        dots.forEach(dot => dot.classList.remove("active"));
        dots[index]?.classList.add("active");
        // Highlight the active game card
        games.forEach(game => game.classList.remove("active-card"));
        games[index]?.classList.add("active-card");
    }

    // Move function: it takes a string as an argument to determine scroll behaviour
    function move(direction) {
        
        // if we are in transitioning animation state, ignore the rest of this function and return/break
        if (isTransitioning) return;
        
        // if we are not transitioning, carry on and set transitioning to true
        isTransitioning = true;

        // handle our string passed in arguments
        if (direction === "next") {
            // add 1 to index to move to the next card in the array
            // divide by length, return the remainder (if any) to place either at end or beginning 
            index = (index + 1) % games.length; 
        } else { // instead of checking for "prev" just use an else, as it's a binary argument anyway
            index = (index - 1 + games.length) % games.length;
        }

        // set the CSS transition style to ease in with 0.4s delay
        gameContainer.style.transition = "transform 0.4s ease-in-out";
        
        // call our centrescroll function again
        centreScroll();

        setTimeout(() => {
            updateDots(); // update the dynamic dots to repesent the current active game card
            isTransitioning = false; // set isTransitioning back to false so it can be scrolled again
        }, 400); // delay it by 400ms, so there is a slight delay between transitions
    }


    // Apple an event listener when mouse is scrolling over the scrollContainer
    scrollContainer.addEventListener("wheel", (e) => { // event is wheel type
        clearTimeout(scrollTimeout); // start by clearing the previous timeout, ensuring only the most recent scroll is processed
        scrollTimeout = setTimeout(() => { // for every 100ms, 
            // store the scroll wheel's event properties in e
            // event.deltaY stores the wheel's vertical amount
            // if deltaY > 0 or if user scrolled downwards
            // call the move function below and pass in a string of either "next" or "prev"
            // This is known as "inline conditional argument passing", where the outcome of the parameter passed is dynamic
            move(e.deltaY > 0 ? "next" : "prev"); 
        }, 100);
    });

    // I can combine these 2 scrollContainer event listeners; don't need 2

    scrollContainer.addEventListener("wheel", (e) => {
        e.preventDefault();  // Stop the page from scrolling
    });

    // Touch support (for mobile devices)
    gameContainer.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    gameContainer.addEventListener("touchmove", (e) => {
        moveX = e.touches[0].clientX - startX;
    });

    gameContainer.addEventListener("touchend", () => {
        if (Math.abs(moveX) > threshold) {
            move(moveX < 0 ? "next" : "prev");
        }
    });

    // Button event listeners
    nextBtn.addEventListener("click", () => move("next"));
    prevBtn.addEventListener("click", () => move("prev"));

    // Initialise
    createDots();
    centreScroll();

// #endregion

/* 

Pseudo Code for Games Section:

Pseudo Code for Games Section:

Set variables:

start: create array to store the .games-card html class Nodelist
start: assign variable to the width of the first card + offset
start: set index to 0
start: set istransitioning animation checker Boolean to false
start: set touch controls: startX, moveX to 0 and threshold to 50
start: assign a variable name to the timeout, so we can clear it by id

start: call: creatDots Function
start: call: centreScroll Function

Event Listeners:

scrollContainer => mouse wheel
	e.preventDefault = stop page from scrolling when scrolling over
	clear the timeout based on variable name we assigned at start
	start a new timeout:
		check the vertical delta, if scroll wheel vertical > 0
			send "next" string to our move function
			else send "prev" string to move function
		pause for 100ms

gameContainer => touchStart
gameContainer => touchMove
gameContainer => touchEnd

	Note:
	e.touches[0] = on touch screens, you can have multiple touches; 
	e.touches[0] means the first touch registered

	Why Do We Need All 3 touch Listeners?
	touchstart → Saves the starting X position of the touch.
	touchmove → Calculates how far the finger moves left or right.
	touchend → Checks if the movement is big enough to trigger a swipe and moves the carousel.

nextBtn => click: send "next" string to move function
prevBtn => click: send "prev" string to move function

Functions: In order of call

CreateDots:
	we have an empty html div called dotsContainer
	do for loop, using games.length:
		create games.length number of divs for each dot
		add the CSS class styling to each dot
		use dotsContainer.appendChild(dot); to actually append the dots to the html file
	call the update dot function

UpdateDots: 
	This function requires the CreateDots to trigger first, 
	CreateDots actually appends the dots to the html file
	
	create a NodeList called dots to store the dots using queryselectorAll
	use a foreach on the NodeList to remove the CSS style class called 'active' making them all default styled
		 
	"dots[index]?.classList.add("active");"
	^ This selects the dot at the current index
	^ ?. is syntax for 'Optional Chaining' it Prevents errors if dots[index] is undefined
	
	Do the same thing for each element in our games array
	Use a foreach on the array to remove a CSS styling called "active-card" so all cards are default styled
	Again, use games[index]?.classList.add("active-card"); syntax to style the active game-card


CentreScroll:
	set viewportwidth to the actual viewport width dynamically
	set activeCard to what is at games[current index]
	set activecardwitdh = activeCard.offsetWidth + (window.innerWidth * 0.2);
	let offset = (viewportWidth / 2) - (activeCardWidth / 2); = perfect center
	^ Calculate the horizontal position for the centre game card
	let translateX = offset - (index * gameWidth);
	^ This sets the x offset starting location for the gamecontainer itself
	^ This makes it so both the active card and the container itself are perfectly centred
	gameContainer.style.transform = `translateX(${translateX}px)`;
	^ send an inline CSS styling to our gameContainer class
	^ `translateX(${translateX}px)`because we are sending an inline styling, we pass a template literal
		

Move:

	




*/




/* 
    Topic: Game Section Code breakdown:

    Variable Definitions (Declared at the Start)

    const gameContainer = document.getElementById("games-container"); → Retrieves the container holding all the game cards.
    const dotsContainer = document.getElementById("dotsContainer"); → Retrieves the container where navigation dots will be placed.
    const prevBtn = document.getElementById("prev"); → Retrieves the "Previous" button.
    const nextBtn = document.getElementById("next"); → Retrieves the "Next" button.
    let games = [...document.querySelectorAll(".games-card")]; → Converts the NodeList of .games-card elements into an array for easier manipulation.
    let gameWidth = games[0].offsetWidth + 16; → Calculates the width of a game card, including the gap between them.
    let index = 0; → Stores the current position in the carousel.
    let isTransitioning = false; → Prevents multiple transitions from happening simultaneously.
    let startX = 0; → Stores the starting X position for touch interactions.
    let moveX = 0; → Stores the amount of movement during a touch interaction.
    let threshold = 50; → Defines the minimum swipe distance required for a valid swipe action.
    let scrollTimeout; → Used to debounce the scroll wheel event, ensuring smoother transitions.


    Order of Operations (Calls & Event Listeners First)
    
    createDots(); → Initializes the dot indicators based on the number of game cards.
    centreScroll(); → Centers the first game card to align properly in the viewport.
    nextBtn.addEventListener("click", () => move("next")); → Adds an event listener to the "Next" button, calling move("next") when clicked.
    prevBtn.addEventListener("click", () => move("prev")); → Adds an event listener to the "Previous" button, calling move("prev") when clicked.
    scrollContainer.addEventListener("wheel", (e) => { ... }); → Detects scroll wheel movement and calls move("next") or move("prev") based on scroll direction.
    scrollContainer.addEventListener("wheel", (e) => { e.preventDefault(); }); → Prevents the default vertical page scrolling behavior.
    gameContainer.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }); → Stores the initial X position when the user touches the screen.
    gameContainer.addEventListener("touchmove", (e) => { moveX = e.touches[0].clientX - startX; }); → Tracks the movement of the touch and calculates the distance moved.
    gameContainer.addEventListener("touchend", () => { if (Math.abs(moveX) > threshold) move(moveX < 0 ? "next" : "prev"); }); → If the touch movement exceeds the threshold, triggers a slide transition.
    
    Function Definitions (Executed When Called)
    
    function centreScroll() → Calculates the precise translation needed to center the active game card in the viewport. Uses the card’s width and viewport width to determine the correct offset and applies a transform to gameContainer.
    function createDots() → Clears existing dots and dynamically generates new dots corresponding to the number of game cards. Calls updateDots() to ensure correct highlighting.
    function updateDots() → Updates the active state of dots and game cards by adding/removing the active class based on the current index.
    function move(direction) → Handles movement logic when transitioning between game cards:
    Prevents multiple transitions at once using isTransitioning.
    Updates the index using modulo arithmetic to wrap around the carousel.
    Applies a smooth transition effect.
    Calls centreScroll() to position the game container correctly.
    Calls updateDots() after the transition completes.
    scrollContainer.addEventListener("wheel", (e) => { ... }); → Uses a timeout to prevent rapid scrolling from triggering multiple transitions too quickly. Calls move("next") or move("prev") accordingly.
*/