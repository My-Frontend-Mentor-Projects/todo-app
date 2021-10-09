const body = document.querySelector('body');
const themeSwitch = document.getElementById('theme-switch');
let isDark = false;

function loadTheme() {
    let currentTheme = localStorage.getItem('theme');
    currentTheme == 'dark' ? isDark = true : isDark = false;
    document.documentElement.setAttribute('data-theme', currentTheme);
}

function toggleDarkTheme() {
    if(!isDark) {
        localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        isDark = true;
    } else {
        localStorage.setItem('theme','light');
        document.documentElement.setAttribute('data-theme', 'light');
        isDark = false;
    }
}

themeSwitch.addEventListener('click', toggleDarkTheme);

loadTheme();