/* =========================================================
   Escola Estadual Professor Abel Freire Coelho
   Comportamentos da página + registro do Service Worker
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'abel-coelho:theme';

  /* ---------------- Tema claro/escuro ---------------- */
  function prefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-label',
        theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b1220' : '#123a75');
  }

  applyTheme(storedTheme() || (prefersDark() ? 'dark' : 'light'));

  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* modo privado */ }
    });
  }

  // Acompanha a mudança de preferência do sistema quando não há escolha manual
  if (window.matchMedia) {
    var media = window.matchMedia('(prefers-color-scheme: dark)');
    var onSystemChange = function (e) {
      if (!storedTheme()) applyTheme(e.matches ? 'dark' : 'light');
    };
    if (media.addEventListener) media.addEventListener('change', onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange);
  }

  /* ---------------- Menu mobile ---------------- */
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- Indicador online/offline ---------------- */
  var statusBar = document.getElementById('statusbar');
  var statusText = document.getElementById('statusbar-text');

  function updateOnlineStatus() {
    if (!statusBar) return;
    if (navigator.onLine) {
      statusBar.hidden = true;
    } else {
      statusBar.hidden = false;
      if (statusText) {
        statusText.textContent = 'Você está offline — exibindo a versão em cache.';
      }
    }
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  /* ---------------- Voltar ao topo ---------------- */
  var toTop = document.getElementById('to-top');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.hidden = window.scrollY < 500;
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- Marca da seção ativa no menu ---------------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active',
            link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------------- Instalação do PWA ---------------- */
  var installBtn = document.getElementById('install-btn');
  var deferredPrompt = null;
  var toast = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.innerHTML = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 6000);
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.hidden = false;
  });

  if (installBtn) {
    installBtn.addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () {
          deferredPrompt = null;
          installBtn.hidden = true;
        });
        return;
      }
      // Sem beforeinstallprompt (iOS/Safari): orienta o usuário
      showToast('No Safari, toque em <strong>Compartilhar</strong> &#8594; ' +
        '<strong>Adicionar à Tela de Início</strong>.');
    });
  }

  // iOS não dispara beforeinstallprompt: exibe o botão com a instrução correta
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true;
  if (isIOS && !isStandalone && installBtn) {
    installBtn.hidden = false;
    var label = installBtn.querySelector('span');
    if (label) label.textContent = 'Adicionar';
  }

  window.addEventListener('appinstalled', function () {
    if (installBtn) installBtn.hidden = true;
    deferredPrompt = null;
    showToast('App instalado com sucesso!');
  });

  /* ---------------- Registro do Service Worker ---------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js', { scope: './' })
        .catch(function (err) { console.warn('SW não registrado:', err); });
    });
  }
})();
