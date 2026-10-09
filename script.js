(function () {
  'use strict';

  var WHATSAPP_NUMBER = '918653984069';
  var root = document.documentElement;

  function waLink(text) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function openWhatsApp(text) {
    window.open(waLink(text), '_blank', 'noopener');
  }

  // --- Colour mode: light / dark / system ---
  var THEME_KEY = 'vv-theme';
  var themeBtns = document.querySelectorAll('#theme-switch button');
  function savedMode() {
    try {
      var v = localStorage.getItem(THEME_KEY);
      return v === 'light' || v === 'dark' ? v : 'system';
    } catch (e) { return 'system'; }
  }
  function applyMode(mode) {
    if (mode === 'system') delete root.dataset.theme; else root.dataset.theme = mode;
    themeBtns.forEach(function (b) {
      b.setAttribute('aria-checked', b.getAttribute('data-mode') === mode ? 'true' : 'false');
    });
  }
  applyMode(savedMode());
  themeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var m = b.getAttribute('data-mode');
      try { localStorage.setItem(THEME_KEY, m); } catch (e) {}
      applyMode(m);
    });
  });

  // --- Mobile nav ---
  var menuBtn = document.getElementById('menu-toggle');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Reveal on scroll ---
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // --- Footer year ---
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Portfolio filter + lightbox ---
  var chips = document.querySelectorAll('.chip[data-filter]');
  var pcards = document.querySelectorAll('.pcard');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      pcards.forEach(function (card) { card.hidden = !(f === 'all' || card.getAttribute('data-cat') === f); });
    });
  });
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbClose = document.getElementById('lb-close');
  var lastCard = null;
  function closeLightbox() {
    if (lb.hidden) return;
    lb.hidden = true;
    if (lastCard) lastCard.focus();
  }
  if (lb) {
    pcards.forEach(function (card) {
      card.addEventListener('click', function () {
        lastCard = card;
        lbImg.src = card.getAttribute('data-src');
        lbImg.alt = card.getAttribute('data-title');
        lbCap.textContent = card.getAttribute('data-title');
        lb.hidden = false;
        lbClose.focus();
      });
    });
    lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  }

  // --- Shop filter ---
  // The shop starts with the products already in index.html (so the page
  // works even if Supabase is unreachable), then tries to replace them with
  // the live list from Supabase so admin changes show up without a redeploy.
  var sChips = document.querySelectorAll('[data-sfilter]');
  var productsEl = document.getElementById('products');

  function applyShopFilter() {
    var active = document.querySelector('[data-sfilter][aria-pressed="true"]');
    var f = active ? active.getAttribute('data-sfilter') : 'all';
    productsEl.querySelectorAll('.product').forEach(function (p) {
      p.hidden = !(f === 'all' || p.getAttribute('data-scat') === f);
    });
  }
  sChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      sChips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      applyShopFilter();
    });
  });

  function productCard(p) {
    var art = document.createElement('article');
    art.className = 'product';
    art.setAttribute('data-scat', p.category);
    art.setAttribute('data-name', p.name);
    if (!p.in_stock) art.setAttribute('data-out', 'true');
    var priceText = '₹' + Number(p.price).toLocaleString('en-IN');
    art.innerHTML =
      '<svg class="picon" viewBox="0 0 64 64" aria-hidden="true"><use href="#' + p.icon + '"/></svg>' +
      '<h4></h4>' +
      '<p class="p">' + priceText + ' <span class="pu"></span></p>' +
      '<p class="pnote">' + (p.in_stock ? 'Price not fixed, can be reduced' : 'Currently out of stock') + '</p>' +
      '<button class="btn btn-ghost btn-sm" type="button"' + (p.in_stock ? '' : ' disabled') + '>' +
      (p.in_stock ? 'Add to cart' : 'Out of stock') + '</button>';
    art.querySelector('h4').textContent = p.name;
    art.querySelector('.pu').textContent = p.unit || '';
    var btn = art.querySelector('button');
    if (p.in_stock) btn.setAttribute('data-add', p.name);
    return art;
  }

  function renderProducts(list) {
    productsEl.innerHTML = '';
    list.forEach(function (p) { productsEl.appendChild(productCard(p)); });
    applyShopFilter();
  }

  if (window.supabase && window.VV_SUPABASE_URL && window.VV_SUPABASE_ANON_KEY) {
    var vvClient = window.supabase.createClient(window.VV_SUPABASE_URL, window.VV_SUPABASE_ANON_KEY);
    vvClient
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(function (res) {
        if (res.error || !res.data || !res.data.length) return; // keep the page's own fallback list
        renderProducts(res.data);
      })
      .catch(function () { /* offline or blocked — the fallback list already shows */ });
  }

  // --- Cart drawer ---
  var CART_KEY = 'vv-cart';
  var cartEl = document.getElementById('cart');
  var backdrop = document.getElementById('cart-backdrop');
  var listEl = document.getElementById('cart-items');
  var emptyEl = document.getElementById('cart-empty');
  var countEl = document.getElementById('cart-count');
  var cart = {};
  try {
    var stored = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
    if (stored && typeof stored === 'object') cart = stored;
  } catch (e) { cart = {}; }

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function openCart() {
    cartEl.dataset.open = 'true';
    cartEl.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
  }
  function closeCart() {
    cartEl.dataset.open = 'false';
    cartEl.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
  }
  function renderCart() {
    var names = Object.keys(cart), total = 0;
    listEl.innerHTML = '';
    names.forEach(function (n) {
      total += cart[n];
      var li = document.createElement('li');
      var s = document.createElement('span');
      s.textContent = n + ' × ' + cart[n];
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = '✕';
      b.setAttribute('aria-label', 'Remove ' + n);
      b.addEventListener('click', function () { delete cart[n]; saveCart(); renderCart(); });
      li.appendChild(s);
      li.appendChild(b);
      listEl.appendChild(li);
    });
    countEl.textContent = String(total);
    emptyEl.style.display = names.length ? 'none' : 'block';
  }
  document.getElementById('cart-open').addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  backdrop.addEventListener('click', closeCart);
  productsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-add]');
    if (!btn) return;
    var n = btn.getAttribute('data-add');
    cart[n] = (cart[n] || 0) + 1;
    saveCart();
    renderCart();
    openCart();
  });
  document.getElementById('cart-clear').addEventListener('click', function () {
    cart = {};
    saveCart();
    renderCart();
  });
  document.getElementById('cart-send').addEventListener('click', function () {
    var names = Object.keys(cart);
    if (!names.length) { openCart(); return; }
    var lines = names.map(function (n) { return '- ' + n + ' × ' + cart[n]; });
    openWhatsApp('Hi Volt & Victor, I would like to order:\n' + lines.join('\n') + '\nPlease confirm the final price.');
  });
  renderCart();

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeLightbox();
    if (cartEl.dataset.open === 'true') closeCart();
  });

  // --- Plain WhatsApp links (Join, Subscribe) ---
  document.querySelectorAll('[data-wa-text]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openWhatsApp(el.getAttribute('data-wa-text'));
    });
  });

  // --- Forms -> WhatsApp ---
  document.querySelectorAll('form[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (el.name) data[el.name] = el.value;
      });
      var text;
      if (form.getAttribute('data-wa-form') === 'appointment') {
        text = 'Hi Volt & Victor, I would like to book a consultation.\n' +
          'Name: ' + data.name + '\n' +
          'Phone: ' + data.phone + '\n' +
          'Preferred time: ' + data.when + '\n' +
          (data.details ? 'Project: ' + data.details : '');
      } else {
        text = 'Hi Volt & Victor, I would like to start a project.\n' +
          'Name: ' + data.name + '\n' +
          'Phone: ' + data.phone + '\n' +
          'Type: ' + (data.type || '') + '\n' +
          'Requirements: ' + (data.details || '');
      }
      openWhatsApp(text);
    });
  });
})();
