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
    it to an actual array called games
 */   
    let games = [...document.querySelectorAll(".games-card")];
    let gameWidth = games[0].offsetWidth + 16; // Include the gap; this information is taken from the dom object
    let index = 0;
    let isTransitioning = false;

    let startX = 0;
    let moveX = 0;
    let threshold = 50; // Minimum swipe distance

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

    // Move function
    function move(direction) {
        if (isTransitioning) return;
        isTransitioning = true;

        if (direction === "next") {
            index = (index + 1) % games.length;
        } else {
            index = (index - 1 + games.length) % games.length;
        }

        gameContainer.style.transition = "transform 0.4s ease-in-out";
        centreScroll();

        setTimeout(() => {
            updateDots();
            isTransitioning = false;
        }, 400);
    }


    // Mouse wheel scroll (smooth horizontal movement)
    let scrollTimeout;
    scrollContainer.addEventListener("wheel", (e) => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            move(e.deltaY > 0 ? "next" : "prev");
        }, 100);
    });

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