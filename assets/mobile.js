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

// Start when the first screen is visible, including tabs opened in the background.
function animateFirstScreen() {
  const screen = document.querySelector('.office-banner, main > .intro:first-child');
  const heading = screen?.querySelector('h1');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!heading || motion.matches) return;
  if (document.hidden) {
    document.addEventListener('visibilitychange', animateFirstScreen, { once: true });
    return;
  }

  const original = [...heading.childNodes];
  const display = document.createElement('span');
  display.setAttribute('aria-hidden', 'true');
  heading.setAttribute('aria-label', heading.textContent.trim().replace(/\s+/g, ' '));
  for (const node of original) display.append(node.cloneNode(true));
  const walker = document.createTreeWalker(display, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const letters = [];
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    for (const char of node.data) {
      if (!char.trim()) {
        fragment.append(char);
        continue;
      }
      const letter = document.createElement('span');
      letter.style.visibility = 'hidden';
      letter.textContent = char;
      fragment.append(letter);
      letters.push(letter);
    }
    node.replaceWith(fragment);
  }
  heading.replaceChildren(display);
  screen.classList.add('first-screen-enter');
  let shown = 0;
  let elapsed = 0;
  let previous;
  const duration = Math.min(5100, Math.max(2900, letters.length * 105));
  function frame(now) {
    if (!document.hidden && previous !== undefined) elapsed += Math.min(now - previous, 80);
    previous = now;
    const count = Math.min(letters.length, Math.ceil(Math.max(0, elapsed - 320) / duration * letters.length));
    while (shown < count) {
      if (shown) letters[shown - 1].classList.remove('typing-caret');
      letters[shown].style.visibility = 'visible';
      letters[shown++].classList.add('typing-caret');
    }
    if (motion.matches || shown === letters.length) {
      heading.replaceChildren(...original);
      heading.removeAttribute('aria-label');
      screen.classList.remove('first-screen-enter');
      return;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
animateFirstScreen();
