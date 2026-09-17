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

    link.toggleAttribute('aria-current', estaAtivo);
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
