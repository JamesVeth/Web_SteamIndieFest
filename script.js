const navbar = document.querySelector('.navbar');

// Toggle the pop-out menu for the navbar
navbar.addEventListener('click', () => {
  navbar.classList.toggle('active');
});

// Schedule navigation dots functionality
const dots = document.querySelectorAll('.schedule-nav .dot'); // Select all day navigation dots
const scheduleTables = document.querySelectorAll('.schedule-table'); // Select all schedule tables

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const day = dot.getAttribute('data-day'); // Get the day (day-1, day-2, day-3)
    
    // Remove the 'active' class from all dots and tables
    dots.forEach(d => d.classList.remove('active'));
    scheduleTables.forEach(table => table.style.display = 'none');
    
    // Add the 'active' class to the clicked dot and display the corresponding table
    dot.classList.add('active');
    document.getElementById(day).style.display = 'block';
  });
});

// Initially display Day 1
document.getElementById('day-1').style.display = 'block';
