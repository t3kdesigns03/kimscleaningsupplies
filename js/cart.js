/* ------------------------------------------------------------------
   Cart — browser localStorage only. No accounts, no server, no
   inventory database. Clearing the browser clears the cart.
   ------------------------------------------------------------------ */
(function () {
  "use strict";

  var KEY = "kims_cart_v1";
  var CHECKOUT_KEY = "kims_checkout_v1";
  var PENDING_KEY = "kims_pending_orders_v1";

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function announce() {
    window.dispatchEvent(new CustomEvent("kims:cart"));
  }

  function keyOf(slug, variant) { return slug + "::" + (variant || ""); }

  var Cart = window.Cart = {

    items: function () {
      var raw = read(KEY, []);
      if (!Array.isArray(raw)) return [];
      // drop anything whose product no longer exists
      return raw.filter(function (it) { return !!KIMS.bySlug(it.slug); });
    },

    /* Each line joined with its product record, priced. */
    lines: function () {
      return Cart.items().map(function (it) {
        var p = KIMS.bySlug(it.slug);
        var qty = Math.max(1, parseInt(it.qty, 10) || 1);
        return {
          slug: it.slug,
          variant: it.variant || "",
          qty: qty,
          product: p,
          name: p.name,
          unit: p.price,
          total: p.price * qty
        };
      });
    },

    count: function () {
      return Cart.items().reduce(function (n, it) { return n + (parseInt(it.qty, 10) || 0); }, 0);
    },

    subtotal: function () {
      return Cart.lines().reduce(function (s, l) { return s + l.total; }, 0);
    },

    add: function (slug, qty, variant) {
      qty = Math.max(1, parseInt(qty, 10) || 1);
      var items = Cart.items();
      var k = keyOf(slug, variant);
      var hit = items.filter(function (it) { return keyOf(it.slug, it.variant) === k; })[0];
      if (hit) hit.qty = Math.min(99, (parseInt(hit.qty, 10) || 0) + qty);
      else items.push({ slug: slug, variant: variant || "", qty: qty });
      write(KEY, items);
      announce();
      return Cart.count();
    },

    setQty: function (slug, variant, qty) {
      qty = parseInt(qty, 10) || 0;
      var items = Cart.items();
      var k = keyOf(slug, variant);
      if (qty <= 0) {
        items = items.filter(function (it) { return keyOf(it.slug, it.variant) !== k; });
      } else {
        items.forEach(function (it) {
          if (keyOf(it.slug, it.variant) === k) it.qty = Math.min(99, qty);
        });
      }
      write(KEY, items);
      announce();
    },

    remove: function (slug, variant) { Cart.setQty(slug, variant, 0); },

    clear: function () { write(KEY, []); announce(); },

    /* ---------------- checkout details ---------------- */
    checkout: function () {
      return read(CHECKOUT_KEY, {
        fulfillment: "ship",
        name: "", email: "", phone: "",
        address: "", city: "", state: "", zip: ""
      });
    },

    saveCheckout: function (obj) {
      var cur = Cart.checkout();
      Object.keys(obj || {}).forEach(function (k) { cur[k] = obj[k]; });
      write(CHECKOUT_KEY, cur);
      return cur;
    },

    shipping: function () {
      var flat = Number((window.KIMS_CONFIG || {}).flatShipping || 0);
      if (!flat) return 0;
      if (Cart.checkout().fulfillment === "pickup") return 0;
      if (!Cart.items().length) return 0;
      return flat;
    },

    total: function () { return Cart.subtotal() + Cart.shipping(); },

    /* A short line PayPal can carry in the order description. */
    describe: function (max) {
      max = max || 120;
      var s = Cart.lines().map(function (l) {
        return l.qty + "x " + l.name.replace(/Kim's Cleaning Cloths — /, "Cloths ") + (l.variant ? " (" + l.variant + ")" : "");
      }).join(", ");
      var c = Cart.checkout();
      s = "Kim's order: " + s + (c.fulfillment === "pickup" ? " [PICKUP]" : "");
      return s.length > max ? s.slice(0, max - 1) + "…" : s;
    },

    /* Snapshot stored when someone says they paid by Venmo, so the
       order details survive the page reload and Kim can be shown them. */
    recordPending: function (method, reference) {
      var list = read(PENDING_KEY, []);
      if (!Array.isArray(list)) list = [];
      list.push({
        at: new Date().toISOString(),
        method: method,
        reference: reference || "",
        total: Cart.total(),
        shipping: Cart.shipping(),
        subtotal: Cart.subtotal(),
        customer: Cart.checkout(),
        lines: Cart.lines().map(function (l) {
          return { slug: l.slug, name: l.name, variant: l.variant, qty: l.qty, unit: l.unit };
        })
      });
      write(PENDING_KEY, list);
      return list[list.length - 1];
    },

    pending: function () { return read(PENDING_KEY, []); }
  };
})();
