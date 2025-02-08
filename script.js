// #region Navbar

    const navbar = document.querySelector('.navbar');

    navbar.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });


// #endregion


// #region Schedule

    const scheduleTables = document.querySelectorAll('.schedule-table');
    const scheduleDots = document.querySelectorAll('.schedule-nav .dot');
    const prevScheduleButton = document.getElementById('prev-schedule-button');
    const nextScheduleButton = document.getElementById('next-schedule-button');

    let currentScheduleIndex = 0;

    function showScheduleTable(index) {
    scheduleTables.forEach(table => table.style.display = 'none');
    scheduleTables[index].style.display = 'block';

    // Update active dot
    updateActiveScheduleDot();
    }

    function updateActiveScheduleDot() {
    scheduleDots.forEach(dot => dot.classList.remove('active'));
    scheduleDots[currentScheduleIndex].classList.add('active');
    }

    // Initial display
    showScheduleTable(currentScheduleIndex);

    // Event listeners for buttons
    prevScheduleButton.addEventListener('click', () => {
    currentScheduleIndex = (currentScheduleIndex - 1 + scheduleTables.length) % scheduleTables.length;
    showScheduleTable(currentScheduleIndex);
    });

    nextScheduleButton.addEventListener('click', () => {
    currentScheduleIndex = (currentScheduleIndex + 1) % scheduleTables.length;
    showScheduleTable(currentScheduleIndex);
    });

    // Event listeners for dots
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

    let games = [...document.querySelectorAll(".games-card")];
    let gameWidth = games[0].offsetWidth + 16; // Include the gap
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