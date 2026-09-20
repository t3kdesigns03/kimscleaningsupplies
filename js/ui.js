/* ------------------------------------------------------------------
   Shared chrome + helpers. Every page calls KIMS.mount().
   Header and footer are written once, here, not in each HTML file.
   All links are relative so the site works in a GitHub Pages subfolder.
   ------------------------------------------------------------------ */
(function () {
  "use strict";

  var CFG = window.KIMS_CONFIG || {};

  var NAV = [
    { href: "shop.html",    label: "Shop" },
    { href: "about.html",   label: "About" },
    { href: "events.html",  label: "Events" },
    { href: "contact.html", label: "Contact" }
  ];

  var ICON = {
    cart:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2.2l2.3 11.4a1.8 1.8 0 0 0 1.8 1.4h8.4a1.8 1.8 0 0 0 1.8-1.4L21 7H6"/></svg>',
    menu:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5.5 5.5L20 6.5"/></svg>',
    left:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    drop:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.7 6 11a6 6 0 0 1-12 0c0-4.3 6-11 6-11z"/></svg>',
    wring: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5c3 2 5 2 7 0M5 12c3 2 5 2 7 0M5 19c3 2 5 2 7 0"/><path d="M16 4c3 3 3 13 0 16"/></svg>',
    wipe:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M7 20h10"/></svg>',
    walk:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="M11 21l2-6-3-3 1-5 3 3 3 1"/><path d="M8 13l2-2"/></svg>',
    leaf:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3C10 3 4 8 4 15c0 2 .6 3.7 1.7 5L4 21.7 5.4 23l1.8-1.8A8.3 8.3 0 0 0 12 23c7 0 8-9 8-20zM9 16c2-4 5-6 8-7-2 2-4 5-8 7z"/></svg>',
    flag:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22V3"/><path d="M5 4h13l-2.5 4L18 12H5z"/></svg>',
    loop:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 4v4h-4"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 20v-4h4"/></svg>'
  };

  var KIMS = window.KIMS = {
    cfg: CFG,
    icon: ICON,

    money: function (n) {
      return "$" + (Math.round(n * 100) / 100).toFixed(2);
    },

    esc: function (s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },

    param: function (k) {
      return new URLSearchParams(location.search).get(k);
    },

    products: function () { return window.KIMS_PRODUCTS || []; },

    bySlug: function (slug) {
      return KIMS.products().filter(function (p) { return p.slug === slug; })[0] || null;
    },

    /* An <img> that walks a list of candidate sources and keeps the first
       one that actually exists. Means a product photo you have not
       downloaded yet never leaves a broken thumbnail on the page. */
    smartImg: function (list, alt, cls) {
      var img = document.createElement("img");
      var i = 0;
      var srcs = (list || []).slice();
      img.alt = alt || "";
      img.loading = "lazy";
      img.decoding = "async";
      if (cls) img.className = cls;
      img.addEventListener("error", function () {
        i++;
        if (i < srcs.length) img.src = srcs[i];
        else img.style.visibility = "hidden";
      });
      img.src = srcs[0] || "";
      return img;
    },

    /* Resolve which of a product's candidate images actually exist.
       Used by the PDP so the dots match the real number of slides. */
    resolveImages: function (list, done) {
      var srcs = (list || []).slice();
      var results = new Array(srcs.length);
      var left = srcs.length;
      if (!left) return done([]);
      srcs.forEach(function (src, idx) {
        var probe = new Image();
        probe.onload = function () { results[idx] = src; if (!--left) finish(); };
        probe.onerror = function () { results[idx] = null; if (!--left) finish(); };
        probe.src = src;
      });
      function finish() {
        done(results.filter(Boolean));
      }
    },

    /* ---------------- header ---------------- */
    renderHeader: function (current) {
      var host = document.getElementById("site-header");
      if (!host) return;

      var navLinks = NAV.map(function (n) {
        var cur = n.href === current ? ' aria-current="page"' : "";
        return '<a href="' + n.href + '"' + cur + ">" + n.label + "</a>";
      }).join("");

      var drawerLinks = NAV.map(function (n) {
        var cur = n.href === current ? ' aria-current="page"' : "";
        return '<a class="dlink" href="' + n.href + '"' + cur + ">" + n.label + "</a>";
      }).join("");

      host.className = "site-header";
      host.innerHTML =
        '<div class="header-in">' +
          '<a class="brand" href="index.html">' +
            '<img src="images/brand/logo-mark.svg" alt="" width="44" height="44">' +
            '<span class="brand-name">' +
              '<span class="b1">Kim&rsquo;s</span>' +
              '<span class="b2">Cleaning Supplies</span>' +
            '</span>' +
          '</a>' +
          '<nav class="nav-desktop" aria-label="Main">' + navLinks + '</nav>' +
          '<div class="header-actions">' +
            '<a class="icon-btn" href="cart.html" aria-label="Cart">' + ICON.cart +
              '<span class="cart-badge" data-count="0" id="cart-badge">0</span></a>' +
            '<button class="icon-btn menu-btn" type="button" id="menu-open" aria-label="Menu" aria-expanded="false">' + ICON.menu + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="drawer" id="drawer" data-open="false">' +
          '<div class="drawer-panel" role="dialog" aria-label="Menu" aria-modal="true">' +
            '<div class="drawer-top">' +
              '<button class="icon-btn" type="button" id="menu-close" aria-label="Close menu">' + ICON.close + '</button>' +
            '</div>' +
            '<a class="dlink" href="index.html"' + (current === "index.html" ? ' aria-current="page"' : "") + '>Home</a>' +
            drawerLinks +
            '<a class="dlink" href="cart.html">Cart</a>' +
            '<div class="drawer-foot">' +
              (CFG.tagline || "") + '<br>' +
              '<a href="mailto:' + KIMS.esc(CFG.contactEmail) + '">' + KIMS.esc(CFG.contactEmail) + '</a>' +
            '</div>' +
          '</div>' +
        '</div>';

      var drawer = document.getElementById("drawer");
      var openBtn = document.getElementById("menu-open");
      function setOpen(v) {
        drawer.setAttribute("data-open", v ? "true" : "false");
        openBtn.setAttribute("aria-expanded", v ? "true" : "false");
        document.body.style.overflow = v ? "hidden" : "";
      }
      openBtn.addEventListener("click", function () { setOpen(true); });
      document.getElementById("menu-close").addEventListener("click", function () { setOpen(false); });
      drawer.addEventListener("click", function (e) { if (e.target === drawer) setOpen(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    },

    /* ---------------- footer ---------------- */
    renderFooter: function () {
      var host = document.getElementById("site-footer");
      if (!host) return;
      var year = new Date().getFullYear();
      host.className = "site-footer";
      host.innerHTML =
        '<div class="wrap"><div class="footer-grid">' +
          '<div>' +
            '<div class="footer-brand">' +
              '<img src="images/brand/logo-mark.svg" alt="" width="40" height="40">' +
              '<span><span class="fb1">Kim&rsquo;s Cleaning Supplies</span><br>' +
              '<span class="fb2">' + KIMS.esc(CFG.tagline || "") + '</span></span>' +
            '</div>' +
            '<p class="small" style="max-width:38ch">Kim Schoch and Alice sell Eco Easy microfiber at fairs and home shows across Iowa and Illinois — and here, all year.</p>' +
            '<p class="small"><a href="mailto:' + KIMS.esc(CFG.contactEmail) + '">' + KIMS.esc(CFG.contactEmail) + '</a><br>' +
            KIMS.esc(CFG.pickupAddress || "") + '</p>' +
          '</div>' +
          '<div>' +
            '<p class="footer-h">Shop</p>' +
            '<ul class="footer-nav">' +
              '<li><a href="shop.html?filter=cloths">Cleaning cloths</a></li>' +
              '<li><a href="shop.html?filter=mops">Mops</a></li>' +
              '<li><a href="shop.html?filter=dusters">Dusters</a></li>' +
              '<li><a href="shop.html?filter=hair">Hair towel</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<p class="footer-h">Kim&rsquo;s</p>' +
            '<ul class="footer-nav">' +
              '<li><a href="about.html">About Kim &amp; Alice</a></li>' +
              '<li><a href="events.html">Where to find us</a></li>' +
              '<li><a href="contact.html">Fundraisers &amp; parties</a></li>' +
              '<li><a href="contact.html">Contact</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>&copy; ' + year + ' Kim&rsquo;s Cleaning Supplies</span>' +
          '<span>' + KIMS.esc(CFG.town || "") + '</span>' +
          '<span>PayPal and Venmo accepted</span>' +
        '</div></div>';
    },

    updateBadge: function () {
      var b = document.getElementById("cart-badge");
      if (!b) return;
      var n = window.Cart ? Cart.count() : 0;
      b.textContent = n;
      b.setAttribute("data-count", String(n));
    },

    toast: function (msg) {
      var t = document.getElementById("kims-toast");
      if (!t) {
        t = document.createElement("div");
        t.id = "kims-toast";
        t.style.cssText =
          "position:fixed;left:50%;bottom:86px;transform:translateX(-50%);z-index:90;" +
          "background:#1E4A22;color:#FFFDF7;padding:13px 20px;border-radius:999px;" +
          "font:600 15px/1.2 var(--sans);box-shadow:0 10px 30px rgba(30,74,34,.34);" +
          "max-width:calc(100vw - 32px);text-align:center;opacity:0;transition:opacity .18s ease";
        document.body.appendChild(t);
      }
      t.textContent = msg;
      requestAnimationFrame(function () { t.style.opacity = "1"; });
      clearTimeout(t._h);
      t._h = setTimeout(function () { t.style.opacity = "0"; }, 2200);
    },

    mount: function (current) {
      KIMS.renderHeader(current);
      KIMS.renderFooter();
      KIMS.updateBadge();
      window.addEventListener("kims:cart", KIMS.updateBadge);
    }
  };
})();
