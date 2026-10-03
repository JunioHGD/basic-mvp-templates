// CONFIGURAÇÃO: preencha somente com destinos aprovados pelo cliente.
// Vazio mantém o modo demonstrativo. Exemplo: "https://plataforma.com/sua-loja".
const ORDER_URL = "";
const INSTAGRAM_URL = "";
const MAPS_URL = "";
const PHONE_NUMBER = ""; // Apenas dígitos: código do país + DDD + número.

// Aceita apenas URLs HTTPS completas, sem credenciais embutidas.
function validExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function configureExternalLinks(selector, url) {
  if (!validExternalUrl(url)) return;
  document.querySelectorAll(selector).forEach((link) => {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const label = link.getAttribute("aria-label") || link.textContent.replace(/[↗↓]/g, "").trim();
    link.setAttribute("aria-label", `${label} (abre em nova aba)`);
  });
}

configureExternalLinks("[data-order-link]", ORDER_URL);
configureExternalLinks('[data-contact="instagram"]', INSTAGRAM_URL);
configureExternalLinks('[data-contact="maps"]', MAPS_URL);

if (/^\d{10,15}$/.test(PHONE_NUMBER)) {
  const phoneLink = document.querySelector('[data-contact="phone"]');
  phoneLink.href = `tel:+${PHONE_NUMBER}`;
  phoneLink.textContent = `Ligar: +${PHONE_NUMBER}`;
}

if (validExternalUrl(ORDER_URL)) {
  document.querySelector("#pedido-demo").hidden = true;
} else {
  // Sem destino real, os links levam ao aviso e lhe dão foco de teclado.
  document.querySelectorAll("[data-order-link]").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelector("#pedido-demo").focus({ preventScroll: true });
    });
  });
}

// MENU: a navegação continua visível caso o JavaScript não carregue.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navegacao");
const desktopViewport = window.matchMedia("(min-width: 64rem)");

function closeMenu(restoreFocus = false) {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  if (restoreFocus) menuButton.focus();
}

menuButton.hidden = false;
document.documentElement.classList.add("js");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || desktopViewport.matches) return;
  closeMenu();
  if (link.getAttribute("href").startsWith("#")) {
    const destination = document.querySelector(link.getAttribute("href"));
    if (destination) {
      destination.setAttribute("tabindex", "-1");
      destination.focus({ preventScroll: true });
    }
  } else {
    menuButton.focus();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu(true);
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".header-inner") && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu(navigation.contains(document.activeElement));
  }
});

desktopViewport.addEventListener("change", () => {
  const focusWasInside = navigation.contains(document.activeElement);
  closeMenu(!desktopViewport.matches && focusWasInside);
});

document.querySelector("#year").textContent = new Date().getFullYear();
