const mobileView = window.matchMedia('(max-width: 740px)');
const menuToggle = document.querySelector('.menu-toggle');
const headerMenu = document.getElementById('header-menu');
const contacts = document.querySelector('.mobile-contact');
const quizBlock = document.getElementById('quiz');

function setMobileMenu(open) {
  headerMenu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  menuToggle.firstElementChild.textContent = open ? '×' : '☰';
}

menuToggle.addEventListener('click', () => setMobileMenu(!headerMenu.classList.contains('is-open')));
headerMenu.addEventListener('click', event => {
  if (mobileView.matches && event.target.closest('a')) setMobileMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && headerMenu.classList.contains('is-open')) {
    setMobileMenu(false);
    menuToggle.focus();
  }
});

function updateMobileContacts() {
  contacts.hidden = !mobileView.matches || quizBlock.hidden || quizBlock.getBoundingClientRect().bottom > 0;
}

mobileView.addEventListener('change', () => setMobileMenu(false));
if (contacts && quizBlock) {
  window.addEventListener('scroll', updateMobileContacts, { passive: true });
  window.addEventListener('resize', updateMobileContacts);
  new ResizeObserver(updateMobileContacts).observe(quizBlock);
  updateMobileContacts();
}

const servicesMenu = document.querySelector('.services-menu');
const servicesTrigger = servicesMenu.querySelector('.services-trigger');
const servicesDropdown = document.getElementById('services-dropdown');

function setServicesMenu(open) {
  servicesDropdown.hidden = !open;
  servicesTrigger.setAttribute('aria-expanded', String(open));
}

servicesTrigger.addEventListener('click', event => {
  const desktopMouse = !mobileView.matches && event.pointerType === 'mouse';
  setServicesMenu(desktopMouse || servicesDropdown.hidden);
});
servicesMenu.addEventListener('pointerenter', event => {
  if (!mobileView.matches && event.pointerType === 'mouse') setServicesMenu(true);
});
servicesMenu.addEventListener('pointerleave', event => {
  if (!mobileView.matches && event.pointerType === 'mouse' && !servicesDropdown.contains(document.activeElement)) {
    setServicesMenu(false);
  }
});
servicesMenu.addEventListener('focusout', event => {
  if (!servicesMenu.contains(event.relatedTarget) && !servicesMenu.matches(':hover')) setServicesMenu(false);
});
servicesMenu.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !servicesDropdown.hidden) {
    event.stopPropagation();
    setServicesMenu(false);
    servicesTrigger.focus();
  }
});
document.addEventListener('click', event => {
  if (!servicesMenu.contains(event.target)) setServicesMenu(false);
});
mobileView.addEventListener('change', () => setServicesMenu(false));
