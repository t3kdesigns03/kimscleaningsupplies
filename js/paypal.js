/* ------------------------------------------------------------------
   Checkout. Loaded on cart.html only.

   PayPal Smart Buttons are the main way to pay, with Venmo turned on
   as a funding source. Underneath there is a plain Venmo hand-off for
   people who would rather just open the app — that one is honest about
   what it is: it records the order and tells Kim to look for the money.
   There is no server and no Venmo API. That is on purpose.
   ------------------------------------------------------------------ */
(function () {
  "use strict";

  var CFG = window.KIMS_CONFIG || {};
  var CUR = CFG.paypalCurrency || "USD";
  var configured = CFG.paypalClientId && CFG.paypalClientId !== "REPLACE_ME";
  var venmoReady = CFG.venmoHandle && CFG.venmoHandle !== "REPLACE_ME";

  var Payments = window.Payments = {
    paypalConfigured: configured,
    venmoConfigured: venmoReady,
    onSuccess: null,
    _buttons: null,
    _loading: null
  };

  function money(n) { return (Math.round(n * 100) / 100).toFixed(2); }

  function loadSdk() {
    if (Payments._loading) return Payments._loading;
    Payments._loading = new Promise(function (resolve, reject) {
      if (window.paypal) return resolve(window.paypal);
      var params = [
        "client-id=" + encodeURIComponent(CFG.paypalClientId),
        "currency=" + encodeURIComponent(CUR),
        "components=buttons",
        "intent=capture"
      ];
      if (CFG.enableVenmo) params.push("enable-funding=venmo");
      var s = document.createElement("script");
      s.src = "https://www.paypal.com/sdk/js?" + params.join("&");
      s.onload = function () { resolve(window.paypal); };
      s.onerror = function () { reject(new Error("PayPal SDK failed to load")); };
      document.head.appendChild(s);
    });
    return Payments._loading;
  }

  function customerRef() {
    var c = Cart.checkout();
    var bits = [c.fulfillment === "pickup" ? "PICKUP" : "SHIP", c.name, c.phone].filter(Boolean);
    return bits.join(" / ").slice(0, 120);
  }

  function buildOrder(actions) {
    var sub = Cart.subtotal();
    var ship = Cart.shipping();
    var c = Cart.checkout();

    var unit = {
      description: Cart.describe(120),
      custom_id: customerRef(),
      amount: {
        currency_code: CUR,
        value: money(sub + ship),
        breakdown: {
          item_total: { currency_code: CUR, value: money(sub) },
          shipping:   { currency_code: CUR, value: money(ship) }
        }
      }
    };

    var ctx = { shipping_preference: "NO_SHIPPING" };

    if (c.fulfillment === "ship" && c.address && c.city && c.state && c.zip) {
      unit.shipping = {
        name: { full_name: c.name || "" },
        address: {
          address_line_1: c.address,
          admin_area_2: c.city,
          admin_area_1: c.state,
          postal_code: c.zip,
          country_code: "US"
        }
      };
      ctx.shipping_preference = "SET_PROVIDED_ADDRESS";
    }

    return actions.order.create({
      purchase_units: [unit],
      application_context: ctx
    });
  }

  /* --------------------------------------------------------------
     Render the PayPal area into `host`. Call again whenever the
     cart total or the ship/pickup choice changes.
     -------------------------------------------------------------- */
  Payments.renderPayPal = function (host, opts) {
    opts = opts || {};
    if (!host) return;

    if (!configured) {
      host.innerHTML =
        '<div class="notice info">' +
          '<strong>Online checkout turns on when PayPal is connected.</strong>' +
          'Everything else on this page works — Kim just needs to paste her live ' +
          'PayPal client ID into <code>js/config.js</code> and card and PayPal ' +
          'buttons appear right here.' +
        '</div>';
      return;
    }

    if (!Cart.items().length) { host.innerHTML = ""; return; }

    if (typeof opts.blocked === "string" && opts.blocked) {
      host.innerHTML = '<div class="notice">' + KIMS.esc(opts.blocked) + '</div>';
      return;
    }

    host.innerHTML = '<p class="small muted" style="margin:0">Loading secure checkout&hellip;</p>';

    loadSdk().then(function (paypal) {
      host.innerHTML = "";
      if (Payments._buttons && Payments._buttons.close) {
        try { Payments._buttons.close(); } catch (e) {}
      }
      Payments._buttons = paypal.Buttons({
        style: { layout: "vertical", shape: "pill", color: "gold", label: "paypal", height: 48 },
        createOrder: function (data, actions) { return buildOrder(actions); },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function (details) {
            var payer = (details && details.payer && details.payer.name && details.payer.name.given_name) || "";
            if (typeof Payments.onSuccess === "function") Payments.onSuccess("paypal", payer, details);
          });
        },
        onError: function (err) {
          console.error(err);
          var box = document.createElement("div");
          box.className = "notice";
          box.innerHTML = "<strong>That didn't go through.</strong>Nothing was charged. " +
            "Try again, or email <a href=\"mailto:" + KIMS.esc(CFG.contactEmail) + "\">" +
            KIMS.esc(CFG.contactEmail) + "</a> and Kim will sort it out.";
          host.appendChild(box);
        }
      });
      Payments._buttons.render(host).catch(function (e) { console.error(e); });
    }).catch(function () {
      host.innerHTML = '<div class="notice">Checkout could not load just now. ' +
        'Please try again, or email <a href="mailto:' + KIMS.esc(CFG.contactEmail) + '">' +
        KIMS.esc(CFG.contactEmail) + '</a>.</div>';
    });
  };

  /* --------------------------------------------------------------
     The plain Venmo hand-off.
     -------------------------------------------------------------- */
  Payments.renderVenmo = function (host) {
    if (!host) return;

    if (!venmoReady) {
      host.innerHTML =
        '<div class="pay-box">' +
          '<div class="pay-head"><span class="venmo-badge">V</span><h3>Pay with the Venmo app</h3></div>' +
          '<div class="notice info" style="margin:0"><strong>Venmo turns on when the username is set.</strong>' +
          'Add it to <code>js/config.js</code> as <code>venmoHandle</code> and this box fills in ' +
          'with the amount, the note, and a button that opens Venmo.</div>' +
        '</div>';
      return;
    }

    var lines = Cart.lines();
    if (!lines.length) { host.innerHTML = ""; return; }

    var first = lines[0];
    var extra = lines.length > 1 ? " +" + (lines.length - 1) + " more" : "";
    var note = "Kim's order — " + first.name + " x" + first.qty + extra;
    var amount = money(Cart.total());
    var handle = String(CFG.venmoHandle).replace(/^@/, "");
    var webUrl = "https://venmo.com/u/" + encodeURIComponent(handle);
    var appUrl = "venmo://paycharge?txn=pay&recipients=" + encodeURIComponent(handle) +
                 "&amount=" + encodeURIComponent(amount) + "&note=" + encodeURIComponent(note);
    var isPhone = /android|iphone|ipad|ipod/i.test(navigator.userAgent);

    host.innerHTML =
      '<div class="pay-box">' +
        '<div class="pay-head"><span class="venmo-badge">V</span><h3>Or pay with the Venmo app</h3></div>' +
        '<div class="kv"><span>Send to</span><b>@' + KIMS.esc(handle) + '</b></div>' +
        '<div class="kv"><span>Amount due</span><b id="venmo-amount">$' + amount + '</b></div>' +
        '<p class="small muted" style="margin:12px 0 4px">Put this in the note so Kim knows what to pack:</p>' +
        '<div class="copybox"><span id="venmo-note">' + KIMS.esc(note) + '</span>' +
          '<button class="btn btn-quiet btn-sm" type="button" id="venmo-copy">Copy</button></div>' +
        '<div class="btn-row" style="margin-top:16px">' +
          '<a class="btn btn-primary" id="venmo-open" href="' + (isPhone ? appUrl : webUrl) + '">Open Venmo</a>' +
          '<button class="btn btn-ghost" type="button" id="venmo-paid">I&rsquo;ve paid with Venmo</button>' +
        '</div>' +
        '<p class="tiny muted" style="margin:14px 0 0">' +
          'Venmo has no way to tell this website that a payment landed, so this step is on the honor ' +
          'system. Kim checks Venmo every evening.' +
        '</p>' +
        '<div id="venmo-done" class="hide"></div>' +
      '</div>';

    var copyBtn = host.querySelector("#venmo-copy");
    copyBtn.addEventListener("click", function () {
      var text = host.querySelector("#venmo-note").textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.textContent = "Copied";
          setTimeout(function () { copyBtn.textContent = "Copy"; }, 1800);
        });
      } else {
        KIMS.toast("Note: " + text);
      }
    });

    host.querySelector("#venmo-paid").addEventListener("click", function () {
      Cart.recordPending("venmo", note);
      var done = host.querySelector("#venmo-done");
      done.className = "notice";
      done.innerHTML =
        '<strong>Thank you &mdash; we&rsquo;ll watch for it.</strong>' +
        'We&rsquo;ll confirm and ship when the payment lands. Email ' +
        '<a href="mailto:' + KIMS.esc(CFG.contactEmail) + '">' + KIMS.esc(CFG.contactEmail) + '</a> ' +
        'if you need a receipt.';
      done.scrollIntoView({ block: "center" });
      if (typeof Payments.onVenmoPending === "function") Payments.onVenmoPending(note);
    });
  };

  Payments.paypalMeLink = function () {
    if (!CFG.paypalMe) return "";
    var slug = String(CFG.paypalMe).replace(/^https?:\/\/(www\.)?paypal\.me\//i, "").replace(/^\/+/, "");
    return "https://paypal.me/" + slug + "/" + money(Cart.total());
  };
})();
