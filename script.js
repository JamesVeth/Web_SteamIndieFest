const navbar = document.querySelector('.navbar');
const scheduleNavDots = document.querySelectorAll('.schedule-nav .dot');
const gameNavDots = document.querySelectorAll('.games-nav .dot');
const scheduleTables = document.querySelectorAll('.schedule-table');
const gamesCards = document.querySelectorAll('.games-card');

let currentDay = 0; // Tracks the current active schedule day
let currentGame = 0; // Tracks the current active game card

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

// Initialise the first schedule day as active
updateSchedule(currentDay);

// Add click events to navigation dots for schedule
scheduleNavDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentDay = index;
        updateSchedule(currentDay);
    });
});

// Function to update games card display
function updateGamesCard(gameIndex) {
    gamesCards.forEach((card, index) => {
        card.classList.toggle('active', index === gameIndex); // Show only the selected game card
    });

    gameNavDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === gameIndex); // Update active dot
    });
}

// Initialise the first game card as active
updateGamesCard(currentGame);

// Add click events to navigation dots for games
gameNavDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentGame = index;
        updateGamesCard(currentGame);
    });
});
