const navbar = document.querySelector('.navbar');
const scheduleNavDots = document.querySelectorAll('.schedule-nav .dot');
const gameNavDots = document.querySelectorAll('.schedule-nav .dot');
const scheduleTables = document.querySelectorAll('.schedule-table');
const gamesTables = document.querySelectorAll('.games-table');

let currentDay = 0; // Tracks the current active schedule day

// Navbar toggle functionality
navbar.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// Function to update schedule table display
function updateSchedule(dayIndex) {
    scheduleTables.forEach((table, index) => {
        table.style.display = index === dayIndex ? 'block' : 'none';
    });

    scheduleNavDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === dayIndex);
    });
}

// Initialise first day as active
updateSchedule(currentDay);

// Add click events to navigation dots
scheduleNavDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentDay = index;
        updateSchedule(currentDay);
    });
});




let currentGame = 0; // Start Game table at 0

function updateGamesTable(gameIndex) {
    gamesTables.forEach((table, index) => {
        table.style.display = index === gameIndex ? 'block' : 'none';
    });

    gameNavDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === gameIndex);
    });
}

// Initialise first day as active
updateGamesTable(currentGame);

// Add click events to navigation dots
gameNavDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentGame = index;
        updateGamesTable(currentGame);
    });
});