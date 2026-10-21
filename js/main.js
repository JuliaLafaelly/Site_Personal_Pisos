(() => {
  'use strict';

  const overlay = document.querySelector('[data-intro]');
  if (!overlay) return;

  const skipButton = overlay.querySelector('[data-intro-skip]');
  const slogan = overlay.querySelector('[data-intro-slogan]');
  const sessionKey = 'personalPisosIntroSeen';
  const fullSlogan = 'Realizando sonhos, construímos histórias';
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let isOpen = false;
  let closeTimer;
  let removeTimer;

  function prepareSlogan() {
    if (!slogan || slogan.dataset.ready === 'true') return;
    slogan.dataset.ready = 'true';
    let letterIndex = 0;
    fullSlogan.split(' ').forEach((word) => {
      const wordElement = document.createElement('span');
      wordElement.className = 'intro-word';
      wordElement.setAttribute('aria-hidden', 'true');
      [...word].forEach((character) => {
        const letter = document.createElement('span');
        letter.className = 'intro-letter';
        letter.textContent = character;
        letter.style.setProperty('--letter-delay', `${letterIndex * 31}ms`);
        wordElement.appendChild(letter);
        letterIndex += 1;
      });
      slogan.appendChild(wordElement);
    });
  }

  function finishIntro() {
    if (!isOpen) return;
    isOpen = false;
    window.clearTimeout(closeTimer);
    overlay.classList.add('is-closing');
    overlay.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleKeydown);
    removeTimer = window.setTimeout(() => {
      overlay.hidden = true;
      overlay.classList.remove('is-closing', 'is-active');
      document.body.classList.remove('intro-open');
      document.documentElement.classList.remove('intro-pending');
      document.getElementById('conteudo')?.focus({ preventScroll: true });
    }, 540);
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      finishIntro();
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      skipButton?.focus({ preventScroll: true });
    }
  }

  let alreadySeen = false;
  try {
    alreadySeen = window.sessionStorage.getItem(sessionKey) === '1';
  } catch (_) {

  }

  if (alreadySeen || reducedMotion || !skipButton) return;

  try {
    window.sessionStorage.setItem(sessionKey, '1');
  } catch (_) {

  }

  prepareSlogan();
  overlay.hidden = false;
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('is-active');
  document.body.classList.add('intro-open');
  isOpen = true;
  skipButton.focus({ preventScroll: true });
  document.addEventListener('keydown', handleKeydown);
  skipButton.addEventListener('click', finishIntro, { once: true });

 
  closeTimer = window.setTimeout(finishIntro, 3300);

  window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change', (event) => {
    if (event.matches) {
      window.clearTimeout(removeTimer);
      overlay.style.transition = 'none';
      finishIntro();
    }
  });
})();



const slides = document.querySelectorAll('.slide');
let indiceSlide = 0;
let intervaloSlides = null;

function mostrarSlide(indice) {
  if (!slides.length) return;

  slides.forEach((slide, i) => {
    slide.classList.toggle('ativo', i === indice);
  });
  indiceSlide = indice;
}

function trocarSlide() {
  if (slides.length < 2) return;
  mostrarSlide((indiceSlide + 1) % slides.length);
}

if (slides.length) {
  const slideAtivoInicial = Array.from(slides).findIndex((slide) =>
    slide.classList.contains('ativo')
  );
  mostrarSlide(slideAtivoInicial >= 0 ? slideAtivoInicial : 0);

  if (slides.length > 1) {
    intervaloSlides = window.setInterval(trocarSlide, 5000);
  }
}

const slidesLogo = document.querySelectorAll('.slideLogo');
let slideAtualLogo = 0;
let trocandoLogo = false;

function trocarSlideLogo() {
  if (slidesLogo.length < 2 || trocandoLogo) return;

  const slideAnterior = slidesLogo[slideAtualLogo];
  trocandoLogo = true;
  slideAnterior.classList.add('saindo');

  window.setTimeout(() => {
    slideAnterior.classList.remove('ativo', 'saindo');
    slideAtualLogo = (slideAtualLogo + 1) % slidesLogo.length;
    slidesLogo[slideAtualLogo].classList.add('ativo');
    trocandoLogo = false;
  }, 1200);
}

if (slidesLogo.length) {
  const logoAtivoInicial = Array.from(slidesLogo).findIndex((slide) =>
    slide.classList.contains('ativo')
  );
  slideAtualLogo = logoAtivoInicial >= 0 ? logoAtivoInicial : 0;
  slidesLogo[slideAtualLogo].classList.add('ativo');

  if (slidesLogo.length > 1) {
    window.setInterval(trocarSlideLogo, 5000);
  }
}

function normalizarCaminho(caminho) {
  const semQueryOuHash = caminho.split(/[?#]/)[0];
  let caminhoLimpo = semQueryOuHash.replace(/\\/g, '/').replace(/\/+$/, '');

  caminhoLimpo = caminhoLimpo.replace(/\/index\.html$/i, '');
  return caminhoLimpo || '/';
}

function marcarPaginaAtual() {
  const linksDeMenu = document.querySelectorAll('.menu-link[href]');
  if (!linksDeMenu.length) return;

  const paginaAtual = normalizarCaminho(window.location.pathname);

  linksDeMenu.forEach((link) => {
    let caminhoDoLink;
    try {
      caminhoDoLink = normalizarCaminho(
        new URL(link.href, window.location.href).pathname
      );
    } catch (erro) {
      link.removeAttribute('aria-current');
      return;
    }

    if (caminhoDoLink === paginaAtual) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

marcarPaginaAtual();
// Máscaras de telefone e CPF

function aplicarMascaraTelefone(campo) {
  campo.addEventListener('input', () => {
    const numeros = campo.value.replace(/\D/g, '').slice(0, 11);

    if (!numeros) {
      campo.value = '';
    } else if (numeros.length <= 2) {
      campo.value = `(${numeros}`;
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
    let cpfFormatado = numeros;

    if (numeros.length > 3) {
      cpfFormatado = `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    }
    if (numeros.length > 6) {
      cpfFormatado = `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    }
    if (numeros.length > 9) {
      cpfFormatado = `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
    }

    campo.value = cpfFormatado;
  });
}

document.querySelectorAll('input[type="tel"]').forEach(aplicarMascaraTelefone);
document.querySelectorAll('input[name="cpf"]').forEach(aplicarMascaraCpf);

function configurarComparador(comparador) {
  const controle = comparador.querySelector('.controle, .comparador__controle');
  const imagemRevelada = comparador.querySelector('.imagem-revelada');
  const imagemReveladaImg = imagemRevelada?.querySelector('img');
  const divisor = comparador.querySelector('.divisor');

  if (!controle || !imagemRevelada) return;

  if (!controle.hasAttribute('aria-label')) {
    controle.setAttribute('aria-label', 'Comparar imagens de antes e depois');
  }

  const atualizarComparador = () => {
    const minimo = Number(controle.min || 0);
    const maximo = Number(controle.max || 100);
    const valor = Number(controle.value);
    const percentual = maximo > minimo
      ? Math.min(100, Math.max(0, ((valor - minimo) / (maximo - minimo)) * 100))
      : 50;

    imagemRevelada.style.width = `${percentual}%`;
    if (divisor) divisor.style.left = `${percentual}%`;

    if (imagemReveladaImg) {
      imagemReveladaImg.style.width = `${comparador.clientWidth}px`;
    }
  };

  controle.addEventListener('input', atualizarComparador);
  controle.addEventListener('change', atualizarComparador);
  atualizarComparador();
}

document.querySelectorAll('.comparador, [data-comparador]').forEach(configurarComparador);

let temporizadorRedimensionamento = null;
window.addEventListener('resize', () => {
  window.clearTimeout(temporizadorRedimensionamento);
  temporizadorRedimensionamento = window.setTimeout(() => {
    document.querySelectorAll('.comparador, [data-comparador]').forEach((comparador) => {
      const controle = comparador.querySelector('.controle, .comparador__controle');
      if (controle) controle.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }, 100);
});

const elementosAnimados = document.querySelectorAll(
  '.escondido1, .escondido2, .escondido3, .escondido4, .escondido5'
);

if ('IntersectionObserver' in window) {
  const observadorAnimacoes = new IntersectionObserver((entradas, observador) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      const classeFinal = entrada.target.classList.contains('escondido5')
        ? 'aparecer2'
        : 'aparecer1';
      entrada.target.classList.add(classeFinal);
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.15 });

  elementosAnimados.forEach((elemento) => observadorAnimacoes.observe(elemento));
} else {
  // Fallback: conteúdo continua visível em navegadores sem IntersectionObserver.
  elementosAnimados.forEach((elemento) => {
    elemento.classList.add(
      elemento.classList.contains('escondido5') ? 'aparecer2' : 'aparecer1'
    );
  });
}

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
    burger.setAttribute('aria-expanded', String(aberto));
    burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  menuPrincipal.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fecharMenu);
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1050) fecharMenu();
  });
}


document.querySelectorAll('[data-whatsapp-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const dados = new FormData(form);
    const linhas = ['Olá! Recebi um contato pelo site Personal Pisos.'];
    for (const [nome, valor] of dados.entries()) {
      if (nome === 'consentimento' || !String(valor).trim()) continue;
      const campo = form.querySelector(`[name="${CSS.escape(nome)}"]`);
      const rotulo = campo?.labels?.[0]?.textContent?.replace(/\s+/g, ' ').trim() || nome;
      linhas.push(`${rotulo}: ${String(valor).trim()}`);
    }
    const destino = `https://wa.me/5511976970440?text=${encodeURIComponent(linhas.join('\n'))}`;
    const feedback = form.querySelector('[data-whatsapp-feedback]');
    let janelaWhatsApp = null;
    try {
      janelaWhatsApp = window.open(destino, '_blank');
      if (janelaWhatsApp) janelaWhatsApp.opener = null;
    } catch (erro) {
      janelaWhatsApp = null;
    }
    if (!feedback) return;
    feedback.replaceChildren();
    const mensagem = document.createElement('span');
    mensagem.textContent = janelaWhatsApp
      ? 'A mensagem foi preparada no WhatsApp. Para concluir o contato, toque em “Enviar” no aplicativo ou na página aberta.'
      : 'O navegador pode ter bloqueado a abertura do WhatsApp. A mensagem não foi enviada; use o link abaixo e toque em “Enviar”.';
    const link = document.createElement('a');
    link.href = destino;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Abrir mensagem no WhatsApp';
    feedback.append(mensagem, document.createElement('br'), link);
    feedback.hidden = false;
  });
});
