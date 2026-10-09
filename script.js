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

  // --- Festival themes (set from the admin, "none" by default) ---
  // Each one is just an accent pair, a greeting and a small line-art motif —
  // the rest of the site's own colours and layout stay the same.
  var FESTIVALS = {
    durga_puja: { label: 'Durga Puja', greeting: 'Shubho Durga Puja!', accent: '#e2574c', accent2: '#f4b942',
      motif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M7 9c0-3 2-5 5-5s5 2 5 5"/><path d="M4 9h16l-1.5 11a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2z"/><path d="M9 14h6"/></svg>' },
    kali_puja: { label: 'Kali Puja', greeting: 'Shubho Kali Puja!', accent: '#8a4fd1', accent2: '#e2574c',
      motif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-5-6-10a6 6 0 0 1 12 0c0 5-6 10-6 10z"/><path d="M12 7v5"/></svg>' },
    saraswati_puja: { label: 'Saraswati Puja', greeting: 'Shubho Saraswati Puja!', accent: '#f4b942', accent2: '#4f9fff',
      motif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18c4-10 12-10 16-14"/><circle cx="7" cy="15" r="2"/><path d="M14 8l2 2"/></svg>' },
    poila_boishakh: { label: 'Poila Boishakh', greeting: 'Shubho Noboborsho!', accent: '#e2574c', accent2: '#19b38a',
      motif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>' },
    diwali: { label: 'Diwali', greeting: 'Happy Diwali!', accent: '#f4b942', accent2: '#e2574c',
      motif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c1.5 2 1.5 4 0 5.5C10.5 7 10.5 5 12 3z"/><path d="M3 15c3-2 6-2 9 0s6 2 9 0"/><path d="M4 15v2a8 8 0 0 0 16 0v-2"/></svg>' },
    holi: { label: 'Holi', greeting: 'Happy Holi!', accent: '#d6478c', accent2: '#4f9fff',
      motif: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="7" cy="8" r="2.4"/><circle cx="16" cy="6" r="1.8"/><circle cx="17" cy="15" r="2.6"/><circle cx="8" cy="17" r="1.6"/></svg>' },
    eid: { label: 'Eid', greeting: 'Eid Mubarak!', accent: '#19b38a', accent2: '#f4b942',
      motif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4a8 8 0 1 0 0 16 7 7 0 1 1 0-16z"/><path d="M19 8l.6 1.6L21 10l-1.4.6L19 12l-.6-1.4L17 10l1.4-.4z"/></svg>' },
    christmas: { label: 'Christmas', greeting: 'Merry Christmas!', accent: '#1f8a53', accent2: '#d1443a',
      motif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l3 5h-2l3 5h-2.5l3 5H7.5l3-5H8l3-5H9z"/><path d="M12 18v3"/></svg>' },
    new_year: { label: 'New Year', greeting: 'Happy New Year!', accent: '#4f9fff', accent2: '#f4b942',
      motif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>' },
    independence_day: { label: 'Independence Day', greeting: 'Happy Independence Day!', accent: '#ff9933', accent2: '#138808',
      motif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v18"/><path d="M6 4h12l-2.5 3L18 10H6"/></svg>' },
    republic_day: { label: 'Republic Day', greeting: 'Happy Republic Day!', accent: '#ff9933', accent2: '#138808',
      motif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><path d="M12 5v2M12 17v2M5 12h2M17 12h2M7 7l1.4 1.4M15.6 15.6L17 17M7 17l1.4-1.4M15.6 8.4L17 7"/></svg>' }
  };

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
    var wasText = (p.original_price && Number(p.original_price) > Number(p.price))
      ? '<span class="price-was">₹' + Number(p.original_price).toLocaleString('en-IN') + '</span>' : '';
    art.innerHTML =
      '<svg class="picon" viewBox="0 0 64 64" aria-hidden="true"><use href="#' + p.icon + '"/></svg>' +
      (p.sale_tag ? '<span class="sale-tag"></span>' : '') +
      '<h4></h4>' +
      '<p class="p">' + wasText + priceText + ' <span class="pu"></span></p>' +
      '<p class="pnote">' + (p.in_stock ? 'Price not fixed, can be reduced' : 'Currently out of stock') + '</p>' +
      '<button class="btn btn-ghost btn-sm" type="button"' + (p.in_stock ? '' : ' disabled') + '>' +
      (p.in_stock ? 'Add to cart' : 'Out of stock') + '</button>';
    art.querySelector('h4').textContent = p.name;
    art.querySelector('.pu').textContent = p.unit || '';
    if (p.sale_tag) art.querySelector('.sale-tag').textContent = p.sale_tag;
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

    // --- Sales/offer banner + festival theme (one row, one query) ---
    var bannerEl = document.getElementById('banner');
    var festEl = document.getElementById('fest-strip');
    if (bannerEl || festEl) {
      var BANNER_DISMISS_KEY = 'vv-banner-dismissed';
      var FEST_DISMISS_KEY = 'vv-fest-dismissed';
      vvClient.from('site_banner').select('*').eq('id', 1).maybeSingle().then(function (res) {
        if (res.error || !res.data) return;

        if (bannerEl && res.data.enabled && res.data.message) {
          var bDismissed = false;
          try { bDismissed = sessionStorage.getItem(BANNER_DISMISS_KEY) === res.data.message; } catch (e) {}
          if (!bDismissed) {
            document.getElementById('banner-text').textContent = res.data.message;
            bannerEl.hidden = false;
          }
        }

        var fest = FESTIVALS[res.data.festival];
        if (festEl && fest) {
          var fDismissed = false;
          try { fDismissed = sessionStorage.getItem(FEST_DISMISS_KEY) === res.data.festival; } catch (e) {}
          if (!fDismissed) {
            root.style.setProperty('--fest-accent', fest.accent);
            root.style.setProperty('--fest-accent2', fest.accent2);
            document.getElementById('fest-motif').innerHTML = fest.motif;
            document.getElementById('fest-text').textContent = fest.greeting;
            festEl.hidden = false;
          }
        }
      }).catch(function () { /* offline or blocked — banner and strip just stay hidden */ });

      var bannerClose = document.getElementById('banner-close');
      if (bannerClose) {
        bannerClose.addEventListener('click', function () {
          var msg = document.getElementById('banner-text').textContent;
          try { sessionStorage.setItem(BANNER_DISMISS_KEY, msg); } catch (e) {}
          bannerEl.hidden = true;
        });
      }
      var festClose = document.getElementById('fest-close');
      if (festClose) {
        festClose.addEventListener('click', function () {
          var key = Object.keys(FESTIVALS).filter(function (k) { return FESTIVALS[k].greeting === document.getElementById('fest-text').textContent; })[0];
          try { sessionStorage.setItem(FEST_DISMISS_KEY, key || ''); } catch (e) {}
          festEl.hidden = true;
        });
      }
    }
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
