const languageToggle = document.querySelector('#languageToggle');
const translatedElements = [...document.querySelectorAll('[data-i18n]')];
const translations = window.RUKEN_TRANSLATIONS;
const badiniContent = new Map(translatedElements.map((element) => [element, [...element.childNodes].map((node) => node.cloneNode(true))]));
const altElements = [...document.querySelectorAll('[data-i18n-alt]')];
const badiniAlt = new Map(altElements.map((element) => [element, element.alt]));
const ariaElements = [...document.querySelectorAll('[data-i18n-aria], .image-button')];
const badiniAria = new Map(ariaElements.map((element) => [element, element.getAttribute('aria-label')]));
const badiniTitle = document.title;
const description = document.querySelector('meta[name="description"]');
const badiniDescription = description.content;

function setLanguage(language) {
  const isBadini = language === 'kmr-Arab';
  const english = translations.en;
  translatedElements.forEach((element) => {
    if (isBadini) element.replaceChildren(...badiniContent.get(element).map((node) => node.cloneNode(true)));
    else element.textContent = english[element.dataset.i18n];
  });
  altElements.forEach((element) => { element.alt = isBadini ? badiniAlt.get(element) : english[element.dataset.i18nAlt]; });
  ariaElements.forEach((element) => {
    const label = isBadini ? badiniAria.get(element) :
      element.classList.contains('image-button') ? english.viewImage + ': ' + english[element.dataset.category] : english[element.dataset.i18nAria];
    element.setAttribute('aria-label', label);
  });
  document.documentElement.lang = isBadini ? 'kmr-Arab' : 'en';
  document.documentElement.dir = isBadini ? 'rtl' : 'ltr';
  document.title = isBadini ? badiniTitle : 'Ruken Staff | ' + english.weddingPhotography;
  description.content = isBadini ? badiniDescription : 'Ruken Staff — ' + english.contactDescription;
  languageToggle.querySelector('img').src = isBadini ? 'images/uk-flag.svg' : 'images/kurdistan-flag.svg';
  languageToggle.querySelector('span').textContent = isBadini ? 'EN' : 'KU';
  languageToggle.lang = isBadini ? 'en' : 'kmr-Arab';
  languageToggle.setAttribute('aria-label', isBadini ? 'Switch to English' : 'Switch to Kurdish Bahdini');
}

languageToggle.addEventListener('click', () => setLanguage(document.documentElement.lang === 'en' ? 'kmr-Arab' : 'en'));
languageToggle.hidden = false;

const dialog = document.querySelector('#imageDialog');
const dialogImage = dialog.querySelector('img');
const closeButton = dialog.querySelector('.dialog-close');
let previousFocus;

document.querySelectorAll('.image-button').forEach((button) => {
  button.addEventListener('click', () => {
    previousFocus = button;
    dialogImage.src = button.dataset.image;
    dialogImage.alt = button.querySelector('img').alt;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    closeButton.focus();
  });
});

closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  previousFocus?.focus();
});

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: .1, rootMargin: '0px 0px 40px 0px' });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('visible'));
}
