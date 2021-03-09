const toggler = document.querySelector('#checkbox1');

toggler.checked = false;

toggler.addEventListener('change', () => {
    toggler.checked ? makeThemeLight() : makeThemeDark();
})