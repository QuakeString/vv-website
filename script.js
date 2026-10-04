(function () {
  'use strict';

  var WHATSAPP_NUMBER = '918653984069';

  function waLink(text) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  }

  // --- Theme toggle (auto -> light -> dark -> auto) ---
  var themeBtn = document.getElementById('theme-toggle');
  var root = document.documentElement;
  var THEME_KEY = 'vv-theme';

  function currentTheme() {
    try { return localStorage.getItem(THEME_KEY) || 'auto'; } catch (e) { return 'auto'; }
  }
  function applyTheme(mode) {
    if (mode === 'auto') {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = mode;
    }
    if (themeBtn) {
      themeBtn.title = 'Theme: ' + mode;
      themeBtn.setAttribute('aria-label', 'Theme: ' + mode);
      themeBtn.querySelector('.theme-icon').textContent = mode === 'dark' ? '🌙' : mode === 'light' ? '☀️' : '◐';
    }
  }
  applyTheme(currentTheme());
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var order = ['auto', 'light', 'dark'];
      var next = order[(order.indexOf(currentTheme()) + 1) % order.length];
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });
  }

  // --- Mobile nav ---
  var menuBtn = document.getElementById('menu-toggle');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Reveal on scroll ---
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // --- Footer year ---
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Products / cart ---
  var PRODUCTS = [
    { id: 'led', name: 'LEDs', icon: '💡', price: '₹2 each' },
    { id: 'resistor', name: 'Resistors', icon: '⏚', price: '₹1 each' },
    { id: 'capacitor', name: 'Capacitors', icon: '🔵', price: '₹3 each' },
    { id: 'transistor', name: 'Transistors', icon: '🔺', price: '₹5 each' },
    { id: 'breadboard', name: 'Breadboard', icon: '🧩', price: '₹60' },
    { id: 'jumper', name: 'Jumper wires', icon: '🔌', price: '₹30 / pack' },
    { id: 'motor', name: 'Motors', icon: '⚙️', price: '₹25 each' },
    { id: 'buzzer', name: 'Buzzers', icon: '🔔', price: '₹15 each' }
  ];

  var cart = {}; // id -> qty
  var CART_KEY = 'vv-cart';
  try {
    var saved = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
    if (saved && typeof saved === 'object') cart = saved;
  } catch (e) {}

  var productsEl = document.getElementById('products');
  if (productsEl) {
    productsEl.innerHTML = PRODUCTS.map(function (p) {
      return (
        '<article class="product reveal">' +
        '<div class="icon">' + p.icon + '</div>' +
        '<h4>' + p.name + '</h4>' +
        '<p class="p">' + p.price + '</p>' +
        '<button class="btn btn-ghost btn-sm" type="button" data-add="' + p.id + '">Add to cart</button>' +
        '</article>'
      );
    }).join('');
    // newly injected .reveal cards: observe them too
    productsEl.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('in');
    });
    productsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add]');
      if (!btn) return;
      var id = btn.getAttribute('data-add');
      cart[id] = (cart[id] || 0) + 1;
      persistCart();
      renderCart();
      openCart();
    });
  }

  function persistCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function cartCount() {
    return Object.keys(cart).reduce(function (sum, id) { return sum + cart[id]; }, 0);
  }

  var cartCountEl = document.getElementById('cart-count');
  var cartItemsEl = document.getElementById('cart-items');
  var cartEmptyEl = document.getElementById('cart-empty');

  function renderCart() {
    if (cartCountEl) cartCountEl.textContent = String(cartCount());
    if (!cartItemsEl) return;
    var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0; });
    if (!ids.length) {
      cartItemsEl.innerHTML = '';
      if (cartEmptyEl) cartEmptyEl.style.display = 'block';
      return;
    }
    if (cartEmptyEl) cartEmptyEl.style.display = 'none';
    cartItemsEl.innerHTML = ids.map(function (id) {
      var p = PRODUCTS.find(function (x) { return x.id === id; });
      if (!p) return '';
      return (
        '<li>' +
        '<span>' + p.icon + ' ' + p.name + ' × ' + cart[id] + '</span>' +
        '<button type="button" data-remove="' + id + '" aria-label="Remove ' + p.name + '">✕</button>' +
        '</li>'
      );
    }).join('');
  }
  renderCart();

  if (cartItemsEl) {
    cartItemsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-remove]');
      if (!btn) return;
      delete cart[btn.getAttribute('data-remove')];
      persistCart();
      renderCart();
    });
  }

  var cartClearBtn = document.getElementById('cart-clear');
  if (cartClearBtn) {
    cartClearBtn.addEventListener('click', function () {
      cart = {};
      persistCart();
      renderCart();
    });
  }

  var cartSendBtn = document.getElementById('cart-send');
  if (cartSendBtn) {
    cartSendBtn.addEventListener('click', function () {
      var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0; });
      var lines = ids.map(function (id) {
        var p = PRODUCTS.find(function (x) { return x.id === id; });
        return p ? ('- ' + p.name + ' × ' + cart[id]) : null;
      }).filter(Boolean);
      var text = lines.length
        ? 'Hi Volt & Victor, I would like to order:\n' + lines.join('\n')
        : 'Hi Volt & Victor, I would like to order some components.';
      window.open(waLink(text), '_blank', 'noopener');
    });
  }

  // --- Cart drawer open/close ---
  var cartDrawer = document.getElementById('cart');
  var cartBackdrop = document.getElementById('cart-backdrop');
  var cartOpenBtn = document.getElementById('cart-open');
  var cartCloseBtn = document.getElementById('cart-close');

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.dataset.open = 'true';
    cartDrawer.setAttribute('aria-hidden', 'false');
    if (cartBackdrop) cartBackdrop.hidden = false;
  }
  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.dataset.open = 'false';
    cartDrawer.setAttribute('aria-hidden', 'true');
    if (cartBackdrop) cartBackdrop.hidden = true;
  }
  if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  // --- Generic WhatsApp-bound links ([data-wa-text]) ---
  document.querySelectorAll('[data-wa-text]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(waLink(el.getAttribute('data-wa-text')), '_blank', 'noopener');
    });
  });

  // --- Forms -> WhatsApp ---
  document.querySelectorAll('form[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var kind = form.getAttribute('data-wa-form');
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (el.name) data[el.name] = el.value;
      });
      var text;
      if (kind === 'appointment') {
        text =
          'Hi Volt & Victor, I would like to book a consultation.\n' +
          'Name: ' + data.name + '\n' +
          'Phone: ' + data.phone + '\n' +
          'Preferred time: ' + data.when + '\n' +
          (data.details ? 'Project: ' + data.details : '');
      } else {
        text =
          'Hi Volt & Victor, I would like to start a project.\n' +
          'Name: ' + data.name + '\n' +
          'Phone: ' + data.phone + '\n' +
          'Type: ' + (data.type || '') + '\n' +
          'Requirements: ' + (data.details || '');
      }
      window.open(waLink(text), '_blank', 'noopener');
    });
  });
})();
