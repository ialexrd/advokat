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

window.addEventListener('scroll', updateMobileContacts, { passive: true });
window.addEventListener('resize', updateMobileContacts);
mobileView.addEventListener('change', () => setMobileMenu(false));
new ResizeObserver(updateMobileContacts).observe(quizBlock);
updateMobileContacts();
