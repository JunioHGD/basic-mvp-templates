/* Edite apenas os valores confirmados pela profissional. Número: DDI + DDD + número. */
const SITE_CONFIG = {
  whatsapp: '', // Exemplo de formato: 55 + DDD + número, somente dígitos.
  whatsappMessage: 'Olá Sigrid, encontrei seu site e gostaria de solicitar uma avaliação/orçamento.',
  address: '',
  city: '',
  hours: '',
  mapsUrl: '' // Link completo e confirmado do Google Maps.
};

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const contactDialog = document.querySelector('#contact-dialog');
const phone = SITE_CONFIG.whatsapp.replace(/\D/g, '');
const hasPhone = /^55\d{10,11}$/.test(phone);
document.querySelectorAll('[data-contact]').forEach(link => {
  if (hasPhone) {
    link.href = `https://wa.me/${phone}?text=${encodeURIComponent(SITE_CONFIG.whatsappMessage)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.addEventListener('click', event => {
      event.preventDefault();
      contactDialog.showModal();
    });
  }
});
if (hasPhone) document.querySelector('#phone-label').textContent = `+${phone}`;
if (SITE_CONFIG.address || SITE_CONFIG.city) document.querySelector('#address').textContent = [SITE_CONFIG.address, SITE_CONFIG.city].filter(Boolean).join(' — ');
if (SITE_CONFIG.hours) document.querySelector('#hours').textContent = SITE_CONFIG.hours;
if (SITE_CONFIG.mapsUrl.startsWith('https://')) {
  const mapsLink = document.querySelector('#maps-link');
  mapsLink.href = SITE_CONFIG.mapsUrl;
  mapsLink.hidden = false;
}

const comparison = document.querySelector('.comparison');
const comparisonRange = document.querySelector('#comparison-range');
comparisonRange.addEventListener('input', () => {
  comparison.style.setProperty('--split', `${comparisonRange.value}%`);
});

const lightbox = document.querySelector('#lightbox');
document.querySelectorAll('.gallery-item').forEach(button => {
  button.addEventListener('click', () => {
    lightbox.querySelector('img').src = button.dataset.image;
    lightbox.querySelector('img').alt = button.dataset.caption;
    document.querySelector('#lightbox-caption').textContent = button.dataset.caption;
    lightbox.showModal();
  });
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
});
document.querySelector('#year').textContent = new Date().getFullYear();
