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
    

    // Centre the first game
    function centreScroll() {
        let viewportWidth = window.innerWidth;
        let activeCard = games[index]; // Get the current active card
        let activeCardWidth = activeCard.offsetWidth + (window.innerWidth * 0.2);
        let offset = (viewportWidth / 2) - (activeCardWidth / 2); // Perfect centre
        let translateX = offset - (index * gameWidth);
        gameContainer.style.transform = `translateX(${translateX}px)`;
    }

    // Create dots dynamically
    function createDots() {
        dotsContainer.innerHTML = "";
        for (let i = 0; i < games.length; i++) {
            let dot = document.createElement("div");
            dot.classList.add("dot");
            dotsContainer.appendChild(dot);
        }
        updateDots();
    }

    // Update dots and active card
    function updateDots() {
        // let dots = document.querySelectorAll(".dot"); // This interferes with schedule dots

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
            // divide 
            index = (index + 1) % games.length;
        } else { // instead of checking for "prev" just use an else, as it's a binary argument anyway
            index = (index - 1 + games.length) % games.length;
        }

        gameContainer.style.transition = "transform 0.4s ease-in-out";
        
        centreScroll();

        setTimeout(() => {
            updateDots();
            isTransitioning = false;
        }, 400);
    }



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