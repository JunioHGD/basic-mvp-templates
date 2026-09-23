/* Configure os dados confirmados aqui. Não use números fictícios. */
const siteConfig = {
  whatsappNumber: '', // DDI + DDD + número, somente dígitos. Ex.: formato 55 + DDD + número real.
  mapsEmbedUrl: '', // URL de incorporação copiada do Google Maps para o endereço real.
};
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
const bookingDialog = document.querySelector('#booking-dialog');
const photoDialog = document.querySelector('#photo-dialog');
function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add('modal-open');
}
document.querySelectorAll('[data-book]').forEach((link) => {
  const service = link.dataset.service;
  const message =
    'Olá Kelvin, encontrei seu site e gostaria de agendar um horário.' +
    (service ? ` Tenho interesse em ${service}.` : '');
  if (/^\d{12,13}$/.test(siteConfig.whatsappNumber)) {
    link.href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelector('#booking-message').textContent =
        (service
          ? `Para consultar ${service.toLowerCase()}, fale com Kelvin pelo Instagram. `
          : 'Você pode falar com Kelvin pelo Instagram. ') +
        'O número de WhatsApp ainda não foi confirmado nesta prévia.';
      openDialog(bookingDialog);
    });
  }
});
document.querySelectorAll('[data-photo]').forEach((button) => {
  button.addEventListener('click', () => {
    const image = document.querySelector('#enlarged-image');
    image.src = button.dataset.photo;
    image.alt = button.querySelector('img').alt;
    document.querySelector('#photo-caption').textContent =
      button.dataset.caption;
    openDialog(photoDialog);
  });
});
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog
    .querySelector('[data-close]')
    .addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () =>
    document.body.classList.remove('modal-open'),
  );
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      dialog.close();
  });
});
if (siteConfig.mapsEmbedUrl) {
  try {
    const url = new URL(siteConfig.mapsEmbedUrl);
    if (
      url.protocol === 'https:' &&
      ['www.google.com', 'maps.google.com'].includes(url.hostname) &&
      url.pathname.startsWith('/maps/embed')
    ) {
      const map = document.createElement('iframe');
      map.src = url.href;
      map.title = 'Localização de Kelvin Lopes';
      map.loading = 'lazy';
      map.referrerPolicy = 'no-referrer-when-downgrade';
      map.allowFullscreen = true;
      document.querySelector('#map-container').replaceChildren(map);
    }
  } catch {
    /* Mantém o estado honesto de localização não configurada. */
  }
}
document.querySelector('#year').textContent = new Date().getFullYear();
