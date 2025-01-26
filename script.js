const navbar = document.querySelector('.navbar');
const scheduleNavDots = document.querySelectorAll('.schedule-nav .dot');
const scheduleTables = document.querySelectorAll('.schedule-table');

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

// Swipe functionality for schedule
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    if (touchEndX < touchStartX) {
        // Swipe left - go to next day
        currentDay = (currentDay + 1) % scheduleTables.length;
    } else if (touchEndX > touchStartX) {
        // Swipe right - go to previous day
        currentDay = (currentDay - 1 + scheduleTables.length) % scheduleTables.length;
    }
    updateSchedule(currentDay);
}

scheduleTables.forEach((table) => {
    table.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    table.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
});