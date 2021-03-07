const toggler = document.querySelector('#checkbox1');

toggler.addEventListener('change', () => {
    toggler.checked ? makeThemeLight() : makeThemeDark();
})