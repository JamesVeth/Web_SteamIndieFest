// JavaScript for Schedule Section

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




// JavaScript for Games Section


const gamesContainer = document.querySelector('.games-container');
const gamesCards = document.querySelectorAll('.games-card');
const dots = document.querySelectorAll('.games-nav .dot');
const prevButton = document.querySelector('.button-general.left');
const nextButton = document.querySelector('.button-general.right');


const navbar = document.querySelector('.navbar');

navbar.addEventListener('click', () => {
    navbar.classList.toggle('active');
});



let currentIndex = 0;
const cardsToShow = 3; // Number of cards to display at a time

function updateActiveDot() {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex / cardsToShow].classList.add('active');
  }



function showCards(index) {
  // Hide all cards
  gamesCards.forEach(card => card.style.display = 'none');

  // Show the desired number of cards
  for (let i = index; i < index + cardsToShow; i++) {
    if (gamesCards[i]) { // Check if the card exists
      gamesCards[i].style.display = 'flex';
    }
  }
  // Update active dot
  updateActiveDot();
}

function scrollCarousel(direction) {
  currentIndex += direction * cardsToShow;
  // Ensure currentIndex stays within bounds
  if (currentIndex < 0) {
    currentIndex = 0;
  } else if (currentIndex > gamesCards.length - cardsToShow) {
    currentIndex = gamesCards.length - cardsToShow;
  }
  showCards(currentIndex);
}



// Initial display
showCards(currentIndex);

// Event listeners for buttons
prevButton.addEventListener('click', () => scrollCarousel(-1));
nextButton.addEventListener('click', () => scrollCarousel(1));

// Event listeners for dots
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index * cardsToShow;
    showCards(currentIndex);
  });
});




