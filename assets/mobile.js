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
const servicesTrigger = servicesMenu.querySelector('summary');

servicesMenu.addEventListener('pointerenter', event => {
  if (!mobileView.matches && event.pointerType === 'mouse') servicesMenu.open = true;
});
servicesMenu.addEventListener('pointerleave', event => {
  if (!mobileView.matches && event.pointerType === 'mouse' && !servicesMenu.contains(document.activeElement)) {
    servicesMenu.open = false;
  }
});
servicesMenu.addEventListener('focusout', event => {
  if (!mobileView.matches && !servicesMenu.contains(event.relatedTarget) && !servicesMenu.matches(':hover')) {
    servicesMenu.open = false;
  }
});
servicesMenu.addEventListener('keydown', event => {
  if (event.key === 'Escape' && servicesMenu.open) {
    event.stopPropagation();
    servicesMenu.open = false;
    servicesTrigger.focus();
  }
});
mobileView.addEventListener('change', () => { servicesMenu.open = false; });
