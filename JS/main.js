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
  const linksDeMenu = document.querySelectorAll('.menu-link');
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

if (burger && menuPrincipal) {
  const fecharMenu = () => {
    menuPrincipal.classList.remove('aberto');
    burger.classList.remove('ativo');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
  };

  burger.addEventListener('click', () => {
    const aberto = menuPrincipal.classList.toggle('aberto');
    burger.classList.toggle('ativo', aberto);
    burger.setAttribute('aria-expanded', aberto);
    burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  menuPrincipal.querySelectorAll('a').forEach((a) => a.addEventListener('click', fecharMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 1050) fecharMenu(); });
}


// Todo elemento na classificação, que tiver escrito "escondido" via HTML, tem a transição(codigo abaixo para efeito de fade in) - codigos de transição no CSS ao fim

const elements = document.querySelectorAll('escondido1, escondido2, escondido3, escondido4');

function checkFade() {
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
                                                                                //Para escondidos que combinam
        if (rect.top < window.innerHeight - 100) {
            el.classList.add('aparecer1');
        }
    });
}

const elements1 = document.querySelectorAll('escondido5');

function checkFade() {
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
                                                                                //Para escondidos que combinam
        if (rect.top < window.innerHeight - 100) {
            el.classList.add('aparecer2');
        }
    });
}

// codigo de imagem: antes e depois


const controle = document.querySelector(".controle");
const imagemRevelada = document.querySelector(".imagem-revelada");
const divisor = document.querySelector(".divisor");

controle.addEventListener("input", function () {

    const valor = this.value;

    imagemRevelada.style.width = valor + "%";
    divisor.style.left = valor + "%";

});