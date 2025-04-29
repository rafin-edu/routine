document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const darkModeBtn = document.getElementById('darkModeBtn');
    const printBtn = document.getElementById('printBtn');
    const searchInput = document.getElementById('searchInput');
    const routineTable = document.getElementById('routineTable');
    const countdownContainer = document.querySelector('.countdown-container');

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

    // Function to find the next upcoming exam
    function getNextExam() {
        const now = new Date();
        const rows = routineTable.querySelectorAll('tbody tr');
        let nextExam = null;
        
        rows.forEach(row => {
            const examDate = new Date(row.cells[2].textContent + ' 10:00:00');
            if (examDate > now && (!nextExam || examDate < nextExam.date)) {
                nextExam = {
                    date: examDate,
                    subject: row.cells[0].textContent,
                    row: row
                };
            }
        });
        
        return nextExam;
    }

    // Update countdown for the next exam
    function updateCountdown() {
        const now = new Date();
        const nextExam = getNextExam();
        
        if (!nextExam) {
            countdownContainer.innerHTML = `
                <h2>সমস্ত পরীক্ষা সম্পন্ন হয়েছে!</h2>
                <p>আপনার পরীক্ষার ফলাফলের জন্য শুভকামনা!</p>
            `;
            return;
        }
        
        const distance = nextExam.date - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // Update countdown title
        countdownContainer.querySelector('h2').textContent = `পরবর্তী পরীক্ষা: ${nextExam.subject}`;
    }

    // Update days left for each subject
    function updateDaysLeft() {
        const now = new Date();
        const rows = routineTable.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const dateCell = row.cells[2];
            const daysLeftCell = row.cells[3];
            const examDate = new Date(dateCell.textContent + ' 10:00:00');
            const timeDiff = examDate - now;
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            
            // Clear previous classes
            daysLeftCell.className = 'days-left';
            row.classList.remove('completed', 'today', 'upcoming');
            
            if (daysLeft < 0) {
                daysLeftCell.textContent = 'সম্পন্ন';
                row.classList.add('completed');
            } else if (daysLeft === 0) {
                daysLeftCell.textContent = 'আজ!';
                row.classList.add('today');
            } else {
                daysLeftCell.textContent = `${daysLeft} দিন`;
                if (daysLeft <= 7) {
                    row.classList.add('upcoming');
                }
            }
        });
    }

    // Initialize everything
    initDarkMode();
    updateDaysLeft();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    setInterval(updateDaysLeft, 3600000); // Update every hour
});