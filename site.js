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

/* Products shown under "Customer favourites" on the home page (names must match products.js) */
var FEATURED = ["3D portrait on canvas", "Dosa platter", "Strawberry earrings", "Antique art tea light holder"];

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

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-pay]").forEach(function (el) {
    if (!CONFIG.PAY_LINK) { el.style.display = "none"; return; }
    el.setAttribute("href", CONFIG.PAY_LINK);
  });

  // Home: featured products
  var feat = document.getElementById("featured");
  if (feat) {
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
      document.getElementById("shop-title").textContent = cat === "all" ? "All products" : catName(cat);
    }
    chips.addEventListener("click", function (e) {
      var b = e.target.closest(".chipbtn"); if (!b) return;
      history.replaceState(null, "", b.dataset.cat === "all" ? "shop.html" : "#" + b.dataset.cat);
      show(b.dataset.cat);
    });
    window.addEventListener("hashchange", function () { show(location.hash.slice(1)); });
    show(location.hash.slice(1));
  }

  setupForms();
  setupOrderDialog();
});
