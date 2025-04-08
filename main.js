document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const darkModeBtn = document.getElementById('darkModeBtn');
  const printBtn = document.getElementById('printBtn');
  const reminderBtn = document.getElementById('reminderBtn');
  const searchInput = document.getElementById('searchInput');
  const notification = document.getElementById('notification');
  const routineTable = document.getElementById('routineTable');

  // Initialize dark mode
  function initDarkMode() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDark);
    darkModeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }

  // Toggle dark mode
  darkModeBtn.addEventListener('click', function() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  });

  // Print functionality
  printBtn.addEventListener('click', function() {
    window.print();
  });

  // Search functionality
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = routineTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const subject = row.cells[0].textContent.toLowerCase();
      const code = row.cells[1].textContent.toLowerCase();
      row.style.display = (subject.includes(searchTerm) || code.includes(searchTerm)) ? '' : 'none';
    });
  });

  // Countdown timer
  function updateCountdown() {
    const firstExamDate = new Date('April 10, 2025 00:00:00').getTime();
    const now = new Date().getTime();
    const distance = firstExamDate - now;
    
    if (distance < 0) {
      document.querySelector('.countdown-container').innerHTML = `
        <h2>Exams Have Started!</h2>
        <p>Good luck with your exams!</p>
      `;
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }

  // Update days left for each subject
  function updateDaysLeft() {
    const now = new Date();
    const rows = routineTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const dateCell = row.cells[2];
      const daysLeftCell = row.cells[3];
      const examDate = new Date(dateCell.textContent);
      const timeDiff = examDate - now;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      // Clear previous classes
      daysLeftCell.className = 'days-left';
      row.classList.remove('completed', 'today', 'upcoming');
      
      if (daysLeft < 0) {
        daysLeftCell.textContent = 'Completed';
        daysLeftCell.classList.add('completed');
        row.classList.add('completed');
      } else if (daysLeft === 0) {
        daysLeftCell.textContent = 'Today!';
        daysLeftCell.classList.add('today');
        row.classList.add('today');
      } else {
        daysLeftCell.textContent = `${daysLeft} days`;
        if (daysLeft <= 7) {
          daysLeftCell.classList.add('upcoming');
          row.classList.add('upcoming');
        }
      }
    });
  }

  // Notification system
  function showNotification(message, duration = 3000) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, duration);
  }

  // Exam reminders
  reminderBtn.addEventListener('click', function() {
    if (!('Notification' in window)) {
      showNotification("This browser doesn't support notifications");
      return;
    }

    if (Notification.permission === 'granted') {
      scheduleReminders();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          scheduleReminders();
        }
      });
    }

    showNotification("Reminders set for all exams!");
  });

  function scheduleReminders() {
    const now = new Date();
    const rows = routineTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const subject = row.cells[0].textContent;
      const examDate = new Date(row.cells[2].textContent);
      const timeDiff = examDate - now;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      if (daysLeft > 0) {
        // Reminder 1 day before
        if (daysLeft === 1) {
          setTimeout(() => {
            new Notification(`SSC Exam Tomorrow!`, {
              body: `${subject} exam is tomorrow. Prepare well!`,
              icon: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png'
            });
          }, timeDiff - 86400000);
        }
        
        // Reminder on exam day
        setTimeout(() => {
          new Notification(`SSC Exam Today!`, {
            body: `Your ${subject} exam is today. All the best!`,
            icon: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png'
          });
        }, timeDiff);
      }
    });
  }

  // Initialize everything
  initDarkMode();
  updateCountdown();
  updateDaysLeft();
  setInterval(updateCountdown, 1000);
  setInterval(updateDaysLeft, 3600000); // Update every hour

  // Handle mobile touch events
  document.addEventListener('touchstart', function() {}, {passive: true});
});