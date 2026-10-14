js 


const slides = document.querySelectorAll('.slide');
let indiceSlide = 0;

function trocarSlide() {
  if (slides.length < 2) return;
  slides[indiceSlide].classList.remove('ativo');
  indiceSlide = (indiceSlide + 1) % slides.length;
  slides[indiceSlide].classList.add('ativo');
}

if (slides.length > 1) {
  window.setInterval(trocarSlide, 5000);
}

const slidesLogo = document.querySelectorAll('.slideLogo');
let slideAtual = 0;

function trocarSlideLogo() {
  if (slidesLogo.length < 2) return;

  slidesLogo[slideAtual].classList.add('saindo');
  setTimeout(() => {
    slidesLogo[slideAtual].classList.remove('ativo', 'saindo');
    slideAtual = (slideAtual + 1) % slidesLogo.length;
    slidesLogo[slideAtual].classList.add('ativo');
  }, 1200);
}

if (slidesLogo.length > 1) {
  setInterval(trocarSlideLogo, 5000);
}

function normalizarCaminho(caminho) {
  const semQueryOuHash = caminho.split(/[?#]/)[0];
  const semBarrasFinais = semQueryOuHash.replace(/\/+$/, '');
  return semBarrasFinais || '/';
}

function marcarPaginaAtual() {
  const linksDeMenu = document.querySelectorAll('#menu-principal a[href]');
  if (!linksDeMenu.length) return;

  const paginaAtual = normalizarCaminho(window.location.pathname);
  const nomeArquivoAtual = paginaAtual.split('/').pop() || 'index.html';

  linksDeMenu.forEach((link) => {
    const urlDoLink = new URL(link.href, window.location.href);
    const caminhoDoLink = normalizarCaminho(urlDoLink.pathname);
    const nomeArquivoDoLink = caminhoDoLink.split('/').pop() || 'index.html';
    const estaAtivo = caminhoDoLink === paginaAtual
      || (nomeArquivoAtual === 'index.html' && nomeArquivoDoLink === 'index.html');

    if (estaAtivo) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  document.querySelectorAll('#menu-principal .menu-details').forEach((grupo) => {
    grupo.classList.toggle(
      'tem-pagina-atual',
      Boolean(grupo.querySelector('a[aria-current="page"]'))
    );
  });
}

marcarPaginaAtual();

function aplicarMascaraTelefone(campo) {
  campo.addEventListener('input', () => {
    const numeros = campo.value.replace(/\D/g, '').slice(0, 11);
    if (numeros.length <= 2) {
      campo.value = numeros ? `(${numeros}` : '';
    } else if (numeros.length <= 6) {
      campo.value = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else if (numeros.length <= 10) {
      campo.value = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    } else {
      campo.value = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
  });
}

function aplicarMascaraCpf(campo) {
  campo.addEventListener('input', () => {
    const numeros = campo.value.replace(/\D/g, '').slice(0, 11);
    campo.value = numeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  });
}

document.querySelectorAll('input[type="tel"]').forEach(aplicarMascaraTelefone);
document.querySelectorAll('input[name="cpf"]').forEach(aplicarMascaraCpf);


  document.querySelectorAll("[data-comparador]").forEach((comparador) => {
    const controle = comparador.querySelector(".comparador__controle");

    const atualizar = () => {
      comparador.style.setProperty("--posicao", `${controle.value}%`);
    };

    controle.addEventListener("input", atualizar);
    atualizar();
  });

  const burger = document.getElementById('burger');
const menuPrincipal = document.getElementById('menu-principal');
const navegacaoPrincipal = document.querySelector('.navegacao');

if (burger && menuPrincipal) {
  const submenus = [...menuPrincipal.querySelectorAll('.menu-details')];

  const fecharSubmenus = () => {
    submenus.forEach((submenu) => {
      const estavaComFoco = submenu.matches(':focus-within');
      submenu.open = false;

      if (estavaComFoco) {
        submenu.setAttribute('data-escape-closed', 'true');
      } else {
        submenu.removeAttribute('data-escape-closed');
      }
    });
  };

  const fecharMenu = (devolverFoco = false) => {
    fecharSubmenus();
    menuPrincipal.classList.remove('aberto');
    burger.classList.remove('ativo');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');

    if (devolverFoco) burger.focus();
  };

  submenus.forEach((submenu) => {
    submenu.addEventListener('toggle', () => {
      if (submenu.open) {
        submenu.removeAttribute('data-escape-closed');
      } else if (submenu.matches(':focus-within') || submenu.matches(':hover')) {
        submenu.setAttribute('data-escape-closed', 'true');
      }
    });

    submenu.addEventListener('focusout', (event) => {
      if (!submenu.contains(event.relatedTarget)) {
        submenu.removeAttribute('data-escape-closed');
      }
    });

    submenu.addEventListener('pointerenter', () => {
      submenu.removeAttribute('data-escape-closed');
    });
  });

  burger.addEventListener('click', () => {
    const aberto = menuPrincipal.classList.toggle('aberto');
    burger.classList.toggle('ativo', aberto);
    burger.setAttribute('aria-expanded', String(aberto));
    burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');

    if (!aberto) fecharSubmenus();
  });

  menuPrincipal.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => fecharMenu());
  });

  document.addEventListener('click', (event) => {
    if (navegacaoPrincipal && !navegacaoPrincipal.contains(event.target)) {
      if (window.innerWidth <= 1050 && menuPrincipal.classList.contains('aberto')) {
        fecharMenu();
      } else {
        fecharSubmenus();
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    const grupoDoFoco = event.target.closest?.('.menu-details');
    const submenuAtivo = (grupoDoFoco && !grupoDoFoco.hasAttribute('data-escape-closed')
      && (grupoDoFoco.open || grupoDoFoco.matches(':focus-within')))
      ? grupoDoFoco
      : submenus.find((submenu) => !submenu.hasAttribute('data-escape-closed')
        && (submenu.open || submenu.matches(':focus-within')
          || (window.innerWidth > 1050 && submenu.matches(':hover'))));

    if (submenuAtivo) {
      event.preventDefault();
      submenuAtivo.open = false;
      submenuAtivo.setAttribute('data-escape-closed', 'true');
      submenuAtivo.querySelector('summary').focus();
      return;
    }

    if (menuPrincipal.classList.contains('aberto')) {
      event.preventDefault();
      fecharMenu(true);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1050) fecharMenu();
  });
}