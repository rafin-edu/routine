document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const darkModeBtn = document.getElementById('darkModeBtn');
  const printBtn = document.getElementById('printBtn');
  const reminderBtn = document.getElementById('reminderBtn');
  const searchInput = document.getElementById('searchInput');
  const notification = document.getElementById('notification');
  const routineTable = document.getElementById('routineTable');

  // Custom daily reminder messages (Bangla)
  const dailyMessages = [
    "পরীক্ষার প্রস্তুতি নিন! {subject} পরীক্ষা আসন্ন।",
    "{subject} পরীক্ষার জন্য রিভিশন শুরু করুন।",
    "আজই {subject} পরীক্ষার শেষ প্রস্তুতি নিন।",
    "{subject} পরীক্ষায় ভালো করতে আজই চূড়ান্ত রিভিশন করুন।",
    "মনে রাখবেন, {subject} পরীক্ষা আসন্ন! প্রস্তুত থাকুন।"
  ];

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
        <h2>পরীক্ষা শুরু হয়েছে!</h2>
        <p>আপনার পরীক্ষার জন্য শুভকামনা!</p>
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
        daysLeftCell.textContent = 'সম্পন্ন';
        daysLeftCell.classList.add('completed');
        row.classList.add('completed');
      } else if (daysLeft === 0) {
        daysLeftCell.textContent = 'আজ!';
        daysLeftCell.classList.add('today');
        row.classList.add('today');
      } else {
        daysLeftCell.textContent = `${daysLeft} দিন`;
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

  // Get random daily message
  function getDailyMessage(subject) {
    const randomIndex = Math.floor(Math.random() * dailyMessages.length);
    return dailyMessages[randomIndex].replace("{subject}", subject);
  }

  // Exam reminders with daily notifications
  reminderBtn.addEventListener('click', function() {
    if (!('Notification' in window)) {
      showNotification("এই ব্রাউজার নোটিফিকেশন সাপোর্ট করে না");
      return;
    }

    if (Notification.permission === 'granted') {
      scheduleDailyReminders();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          scheduleDailyReminders();
        }
      });
    }

    showNotification("দৈনিক রিমাইন্ডার সেট করা হয়েছে!");
  });

  // Schedule daily reminders for each exam
  function scheduleDailyReminders() {
    const now = new Date();
    const rows = routineTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const subject = row.cells[0].textContent;
      const examDate = new Date(row.cells[2].textContent);
      const timeDiff = examDate - now;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      if (daysLeft > 0) {
        // Daily reminders starting from 7 days before exam
        if (daysLeft <= 7) {
          for (let i = daysLeft; i > 0; i--) {
            setTimeout(() => {
              new Notification(`পরীক্ষার রিমাইন্ডার`, {
                body: getDailyMessage(subject),
                icon: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png'
              });
            }, timeDiff - (i * 86400000));
          }
        }
        
        // Special reminder 1 day before
        setTimeout(() => {
          new Notification(`পরীক্ষা আগামীকাল!`, {
            body: `${subject} পরীক্ষা আগামীকাল! চূড়ান্ত প্রস্তুতি নিন।`,
            icon: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png'
          });
        }, timeDiff - 86400000);
        
        // Reminder on exam day
        setTimeout(() => {c
          new Notification(`আজ পরীক্ষা!`, {
            body: `আজ আপনার ${subject} পরীক্ষা! সফল হোন।`,
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