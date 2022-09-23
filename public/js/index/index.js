const mobileHambugerButton = document.querySelector('.c-nav-hamburger');
const mobileNavList = document.querySelector('.c-nav-list');
const mobileHeader = document.querySelector('.l-header');
let menuOpen = false;
mobileHambugerButton.addEventListener('click', () =>
{
    if(menuOpen == false)
    {
        mobileHambugerButton.classList.add('c-nav-hamburger--open');
        mobileNavList.classList.add('c-nav-list--open');
        mobileHeader.classList.add('l-header--open');
        menuOpen = true;
    }
    else
    {
        mobileHambugerButton.classList.remove('c-nav-hamburger--open');
        mobileNavList.classList.remove('c-nav-list--open');
        mobileHeader.classList.remove('l-header--open');
        menuOpen = false;
    };
});