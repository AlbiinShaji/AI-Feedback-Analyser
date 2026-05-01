// theme.js
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️'; // Sun icon for light mode
    } else {
        themeToggleBtn.textContent = '🌙'; // Moon icon for dark mode
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        let theme = 'light';
        if (body.classList.contains('dark-mode')) {
            theme = 'dark';
            themeToggleBtn.textContent = '☀️';
        } else {
            themeToggleBtn.textContent = '🌙';
        }
        
        // Save user preference
        localStorage.setItem('theme', theme);

        // Dispatch a custom event so other scripts (like Chart.js in dashboard) know the theme changed
        window.dispatchEvent(new Event('themeChanged'));
    });
});
