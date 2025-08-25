const themeToggle = document.getElementById('theme-toggle');
const autoToggle = document.getElementById('auto-toggle');

const body = document.body;

const applyTheme = (theme) => {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeToggle.checked = true;
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        themeToggle.checked = false;
    }
};

const applyAuto = (auto) => {
    if (auto === 'on') {
        autoToggle.checked = true;
    } else {
        autoToggle.checked = false;
    }
}

themeToggle.addEventListener('change', () => {
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
});

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    const savedAuto = localStorage.getItem('auto') || 'on';
    applyAuto(savedAuto)
});

autoToggle.addEventListener('change', () => {
    const newAuto = autoToggle.checked ? 'on' : 'off';
    localStorage.setItem('auto', newAuto);
    applyAuto(newAuto);
});