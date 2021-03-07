const root = document.documentElement;

function makeThemeLight() {
    root.style.setProperty('--bg-light-color', 'var(--color-pink-light)');
    root.style.setProperty('--bg-dark-color', 'var(--color-gray)');
    root.style.setProperty('--text-color', 'var(--color-black-dark)');
    root.style.setProperty('--gradient-color', 'var(--color-pink-dark)');
    root.style.setProperty('--technologies-title-color', 'var(--color-blue-dark)');
}

function makeThemeDark() {
    root.style.setProperty('--bg-light-color', 'var(--color-black-light)');
    root.style.setProperty('--bg-dark-color', 'var(--color-black-dark)');
    root.style.setProperty('--text-color', 'var(--color-white)');
    root.style.setProperty('--gradient-color', 'var(--color-blue-light)');
    root.style.setProperty('--technologies-title-color', 'var(--color-red-light)');
}