/* ============================================================
   SETTINGS
   FORM_ENDPOINT: where order + custom-request forms are sent (FormSubmit → your email).
     After you confirm the activation email, FormSubmit gives you a random string.
     Replace the email below with it (e.g. "https://formsubmit.co/abc123...")
     so your address isn't visible in the page code either.
   PAY_LINK: optional Razorpay Payment Page link (leave "" to hide any Pay button)
   ============================================================ */
var CONFIG = {
  FORM_ENDPOINT: "https://formsubmit.co/thesubtleside@gmail.com",
  PAY_LINK: ""
};

var MAX_UPLOAD_MB = 10;

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function catName(id) {
  for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i].name;
  return "";
}

function cardHTML(p, i) {
  return '<article class="pcard">' +
    '<div class="pimg' + (p.fit === "contain" ? " contain" : "") + '"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
    '<div class="pbody"><span class="pcat">' + esc(catName(p.cat)) + '</span>' +
    '<h3>' + esc(p.name) + '</h3>' +
    '<span class="pprice">' + (p.price ? esc(p.price) : "Ask for price") + '</span>' +
    (p.note ? '<span class="pnote">' + esc(p.note) + '</span>' : '') +
    '<button type="button" class="btn small" data-order="' + i + '">Order</button></div>' +
    '</article>';
}

/* Point every form at the endpoint, set the thank-you page, and check photo size */
function setupForms() {
  var thanks = new URL("thanks.html", location.href).href;
  document.querySelectorAll("form[data-endpoint]").forEach(function (form) {
    form.setAttribute("action", CONFIG.FORM_ENDPOINT);
    var next = form.querySelector("[data-next]");
    if (next) next.value = thanks;
    form.addEventListener("submit", function (e) {
      var files = form.querySelector("[data-files]");
      if (files && files.files) {
        var total = 0;
        for (var i = 0; i < files.files.length; i++) total += files.files[i].size;
        if (total > MAX_UPLOAD_MB * 1024 * 1024) {
          e.preventDefault();
          alert("Your photos add up to more than " + MAX_UPLOAD_MB + " MB. Please choose fewer or smaller photos.");
          return;
        }
      }
      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    });
  });
}

/* ---------- Order dialog (shared by home + shop) ---------- */
function setupOrderDialog() {
  var dlg = document.getElementById("order-dialog");
  if (!dlg) return;
  var form = dlg.querySelector("form");

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-order]");
    if (!b) return;
    var p = PRODUCTS[+b.getAttribute("data-order")];
    dlg.querySelector("#od-img").src = p.img;
    dlg.querySelector("#od-img").alt = p.name;
    dlg.querySelector("#od-name").textContent = p.name;
    dlg.querySelector("#od-cat").textContent = catName(p.cat) + " · " + (p.price || "Price confirmed with you") + (p.note ? " (" + p.note + ")" : "");
    form.reset();
    dlg.querySelector("#od-product").value = p.name + " (" + catName(p.cat) + ")";
    var subj = form.querySelector("[name=_subject]");
    if (subj) subj.value = "New order: " + p.name;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  });

  dlg.querySelector("[data-close]").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
}

/* ---------- Back-to-top arrow ---------- */
function setupToTop() {
  var b = document.querySelector(".to-top");
  if (!b) return;
  var onScroll = function () { b.classList.toggle("show", window.scrollY > 600); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  b.addEventListener("click", function (e) {
    e.preventDefault();
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
}

/* ---------- "How it works" tabs (home page) ---------- */
function setupHowTabs() {
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".how-tab"));
  if (!tabs.length) return;
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { select(t); });
    t.addEventListener("keydown", function (e) {
      var n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (n) { e.preventDefault(); select(tabs[(i + n + tabs.length) % tabs.length], true); }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupToTop();
  setupHowTabs();
  document.querySelectorAll("[data-pay]").forEach(function (el) {
    if (!CONFIG.PAY_LINK) { el.style.display = "none"; return; }
    el.setAttribute("href", CONFIG.PAY_LINK);
  });

  // Home: featured products
  var feat = document.getElementById("featured");
  if (feat && typeof PRODUCTS !== "undefined") {
    feat.innerHTML = FEATURED.map(function (n) {
      for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].name === n) return cardHTML(PRODUCTS[i], i);
      return "";
    }).join("");
  }

  // Shop: filters + grid
  var grid = document.getElementById("shop-grid");
  if (grid) {
    var chips = document.getElementById("chips");
    chips.innerHTML = '<button type="button" class="chipbtn" data-cat="all">All</button>' +
      CATEGORIES.map(function (c) { return '<button type="button" class="chipbtn" data-cat="' + c.id + '">' + esc(c.name) + '</button>'; }).join("");

    function show(cat) {
      if (!cat || !catName(cat)) cat = "all";
      chips.querySelectorAll(".chipbtn").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.cat === cat ? "true" : "false"); });
      var html = "";
      PRODUCTS.forEach(function (p, i) { if (cat === "all" || p.cat === cat) html += cardHTML(p, i); });
      grid.innerHTML = html;
      document.getElementById("shop-title").textContent = cat === "all" ? "Shop" : catName(cat);
    }
    chips.addEventListener("click", function (e) {
      var b = e.target.closest(".chipbtn"); if (!b) return;
      history.replaceState(null, "", b.dataset.cat === "all" ? "shop.html" : "#" + b.dataset.cat);
      show(b.dataset.cat);
    });
    window.addEventListener("hashchange", function () { show(location.hash.slice(1)); });
    show(location.hash.slice(1));
  }

  // Make it yours: idea cards, each pre-fills the request form
  var ideas = document.getElementById("custom-ideas");
  if (ideas) {
    ideas.innerHTML = CUSTOM_IDEAS.map(function (c, i) {
      var thumbs = c.imgs.length > 1
        ? '<div class="idea-thumbs">' + c.imgs.slice(1, 4).map(function (src) { return '<img src="' + esc(src) + '" alt="" loading="lazy">'; }).join("") + '</div>'
        : "";
      return '<article class="idea">' +
        '<div class="idea-img"><img src="' + esc(c.imgs[0]) + '" alt="' + esc(c.name) + '" loading="lazy"></div>' + thumbs +
        '<div class="pbody"><h3>' + esc(c.name) + '</h3>' +
        '<p class="idea-text">' + esc(c.text) + '</p>' +
        '<span class="pprice">' + (c.price ? esc(c.price) : "Price on request") + '</span>' +
        (c.note ? '<span class="pnote">' + esc(c.note) + '</span>' : '') +
        '<button type="button" class="btn small" data-start="' + i + '">Start with this</button></div>' +
        '</article>';
    }).join("");
    ideas.addEventListener("click", function (e) {
      var b = e.target.closest("[data-start]"); if (!b) return;
      var sel = document.getElementById("custom-type");
      if (sel) sel.value = CUSTOM_IDEAS[+b.dataset.start].type;
      var req = document.getElementById("request");
      req.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(function () { var t = req.querySelector("textarea"); if (t) t.focus({ preventScroll: true }); }, 500);
    });
  }

  // For businesses: past work
  var biz = document.getElementById("business-grid");
  if (biz) {
    biz.innerHTML = BUSINESS.map(function (p) {
      return '<article class="pcard">' +
        '<div class="pimg' + (p.fit === "contain" ? " contain" : "") + '"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
        '<div class="pbody"><h3>' + esc(p.name) + '</h3><span class="pnote" style="margin:0">Bulk pricing on request</span></div>' +
        '</article>';
    }).join("");
  }

  setupForms();
  setupOrderDialog();
});
