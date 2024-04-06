"use strict";
var hamburgerMenu = document.querySelector('.hamburger');
var menuPrimary = document.querySelector('.nav-menu.primary');
var showMenu = function (_evt) {
    if (hamburgerMenu) {
        hamburgerMenu.classList.toggle('show');
        if (hamburgerMenu.classList.contains('show')) {
            hamburgerMenu.setAttribute('aria-labelledby', "Hurra");
            if (menuPrimary) {
                menuPrimary.setAttribute('aria-expanded', 'true');
                menuPrimary.focus();
            }
        }
        else {
            hamburgerMenu.setAttribute('aria-labelledby', "murks");
            if (menuPrimary) {
                menuPrimary.setAttribute('aria-expanded', 'false');
            }
            hamburgerMenu.focus();
        }
    }
};
if (hamburgerMenu && menuPrimary) {
    hamburgerMenu.addEventListener('click', showMenu);
}
