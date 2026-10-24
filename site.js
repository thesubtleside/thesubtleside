/* ============================================================
   SETTINGS
   INSTAGRAM      – handle the "Message us on Instagram" button opens
   FORM_ENDPOINT  – FormSubmit address that emails you "Reach out to me" requests
   READY_DAYS     – earliest "needed by" date for ready designs (calendar days from today)
   CUSTOM_DAYS    – earliest "needed by" date for custom work
   ============================================================ */
var CONFIG = {
  INSTAGRAM: "thesubtle.side",
  FORM_ENDPOINT: "https://formsubmit.co/thesubtleside@gmail.com",
  READY_DAYS: 11,   // 5 working days to make + 3 working days to ship
  CUSTOM_DAYS: 14
};
var MAX_UPLOAD_MB = 10;

/* ---------- small helpers ---------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function rupees(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
function igLink() { return "https://ig.me/m/" + CONFIG.INSTAGRAM; }
function addDays(n) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return d; }
function isoDate(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function niceDate(v) {
  var p = String(v).split("-"); if (p.length !== 3) return v;
  return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function param(k) { try { return new URLSearchParams(location.search).get(k); } catch (e) { return null; } }

function copyText(t) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
  return new Promise(function (ok, fail) {
    var ta = document.createElement("textarea");
    ta.value = t; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    var done = false; try { done = document.execCommand("copy"); } catch (e) {}
    ta.remove(); done ? ok() : fail();
  });
}
function toast(t) {
  var el = document.createElement("div");
  el.className = "toast"; el.setAttribute("role", "status"); el.textContent = t;
  document.body.appendChild(el);
  setTimeout(function () { el.remove(); }, 3500);
}

var IG_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>';
var ME_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';

/* ============================================================
   CONTACT STEP – the same last step for every flow
   ============================================================ */
function contactHTML() {
  return '' +
    '<h2 class="wtitle">Here\'s your request</h2>' +
    '<pre class="c-sum" data-sum tabindex="0"></pre>' +
    '<p class="c-lbl">How would you like to continue?</p>' +
    '<div class="c-opts">' +
      '<button type="button" class="c-opt c-ig" data-ig>' + IG_ICON + '<span><b>Message us on Instagram</b><small>We\'ll copy this for you. Paste it in the chat.</small></span></button>' +
      '<button type="button" class="c-opt" data-reach aria-expanded="false">' + ME_ICON + '<span><b>Reach out to me</b><small>Leave your details and we\'ll contact you.</small></span></button>' +
    '</div>' +
    '<div class="c-done" data-igdone hidden>' +
      '<p><b>Copied! Paste this in the chat.</b> In our Instagram chat, press and hold the message box, tap Paste, then Send.</p>' +
      '<p class="c-photos" data-photonote hidden>Please send your photos in the chat too.</p>' +
      '<div class="row"><a class="btn small ig-btn" href="' + igLink() + '" target="_blank" rel="noopener" data-igagain>' + IG_ICON + 'Open Instagram again</a>' +
      '<button type="button" class="btn small ghost" data-copy>Copy again</button></div>' +
    '</div>' +
    '<div class="c-reach" data-reachbox hidden>' +
      '<label class="f full">Your name<input name="Name" type="text" autocomplete="name" required disabled data-c></label>' +
      '<label class="f">Phone<input name="Phone" type="tel" placeholder="+91" autocomplete="tel" disabled data-c data-one></label>' +
      '<label class="f">Instagram handle<input name="Instagram" type="text" placeholder="@yourhandle" autocapitalize="off" disabled data-c data-one></label>' +
      '<label class="f full">Email<input name="email" type="email" autocomplete="email" disabled data-c data-one></label>' +
      '<p class="note full">Fill in at least one of phone, Instagram or email.</p>' +
      '<button class="btn block full" type="submit" data-send>Send my request</button>' +
    '</div>' +
    '<textarea name="Summary" hidden data-c data-summary></textarea>' +
    '<div class="wnav"><button type="button" class="btn ghost small" data-go="back">Back</button></div>';
}

/* Build the order summary from the filled-in fields */
function buildSummary(form) {
  var lines = [form.getAttribute("data-intro") || "Hi The Subtle Side!", ""];
  var photos = 0;
  Array.prototype.forEach.call(form.elements, function (el) {
    if (!el.name || el.name.charAt(0) === "_" || el.hasAttribute("data-c") || el.closest("[data-skipped]")) return;
    if (el.type === "file") { photos += el.files ? el.files.length : 0; return; }
    if ((el.type === "radio" || el.type === "checkbox") && !el.checked) return;
    var v = String(el.value || "").trim();
    if (!v) return;
    if (el.type === "date") v = niceDate(v);
    lines.push(el.name + ": " + v);
  });
  if (photos) lines.push("Photos: " + photos + " attached");
  return { text: lines.join("\n"), photos: photos };
}

/* ============================================================
   WIZARD – forms split into steps; the last step is the contact step
   ============================================================ */
function setupWizard(form) {
  if (form._wiz) return form._wiz;
  form.setAttribute("action", CONFIG.FORM_ENDPOINT);
  var next = form.querySelector("[name=_next]");
  if (next) next.value = new URL("thanks.html", location.href).href;

  var box = form.querySelector("[data-contact]");
  box.innerHTML = contactHTML();
  var steps = Array.prototype.slice.call(form.querySelectorAll(".wstep"));
  var prog = form.querySelectorAll(".wprog li");
  var cur = 0, history = [];

  function show(n, focus) {
    cur = n;
    steps.forEach(function (s, i) { s.hidden = i !== n; });
    prog.forEach(function (li, i) {
      li.classList.toggle("done", i < n);
      if (i === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    if (steps[n] === box) enterContact();
    if (focus) {
      var h = steps[n].querySelector(".wtitle");
      if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
      var top = form.getBoundingClientRect().top;
      if (top < 0 && !form.closest("dialog")) form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  function valid(step) {
    var els = step.querySelectorAll("input,select,textarea");
    for (var i = 0; i < els.length; i++) {
      if (els[i].disabled || els[i].type === "hidden") continue;
      if (!els[i].checkValidity()) { els[i].reportValidity(); return false; }
    }
    var files = step.querySelector("input[type=file]");
    if (files && files.files) {
      var total = 0;
      for (var j = 0; j < files.files.length; j++) total += files.files[j].size;
      if (total > MAX_UPLOAD_MB * 1048576) { toast("Your photos add up to more than " + MAX_UPLOAD_MB + " MB. Please pick fewer or smaller ones."); return false; }
    }
    return true;
  }
  function go(dir) {
    if (dir === "back") { if (history.length) show(history.pop(), true); return; }
    if (!valid(steps[cur])) return;
    var to = form.skipTo ? form.skipTo(cur) : null;
    if (to == null) to = cur + 1;
    steps.forEach(function (s, i) { if (i > cur && i < to) s.setAttribute("data-skipped", ""); else if (i >= to) s.removeAttribute("data-skipped"); });
    history.push(cur);
    show(to, true);
  }

  var sum = "";
  function setReach(open) {
    var rb = box.querySelector("[data-reachbox]");
    rb.hidden = !open;
    box.querySelector("[data-reach]").setAttribute("aria-expanded", open ? "true" : "false");
    rb.querySelectorAll("[data-c]").forEach(function (i) { i.disabled = !open; });
  }
  function enterContact() {
    var s = buildSummary(form);
    sum = s.text;
    box.querySelector("[data-sum]").textContent = sum;
    box.querySelector("[data-summary]").value = sum;
    box.querySelector("[data-photonote]").hidden = !s.photos;
    box.querySelector("[data-igdone]").hidden = true;
    setReach(false);
  }

  form.addEventListener("click", function (e) {
    var g = e.target.closest("[data-go]");
    if (g) { e.preventDefault(); go(g.getAttribute("data-go")); return; }
    if (e.target.closest("[data-ig]")) {
      copyText(sum).then(function () {}, function () { toast("Couldn't copy automatically. Press and hold the summary to copy it."); });
      window.open(igLink(), "_blank", "noopener");
      setReach(false);
      box.querySelector("[data-igdone]").hidden = false;
      return;
    }
    if (e.target.closest("[data-igagain]")) { copyText(sum).catch(function () {}); return; }
    if (e.target.closest("[data-copy]")) {
      copyText(sum).then(function () { toast("Copied! Paste it in our Instagram chat."); }, function () { toast("Couldn't copy. Press and hold the summary to copy it."); });
      return;
    }
    if (e.target.closest("[data-reach]")) {
      var open = box.querySelector("[data-reachbox]").hidden;
      box.querySelector("[data-igdone]").hidden = true;
      setReach(open);
      if (open) box.querySelector("[name=Name]").focus();
    }
  });

  // Enter in a field moves to the next step instead of sending the form
  form.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON") return;
    if (steps[cur] !== box) { e.preventDefault(); go("next"); }
  });

  form.addEventListener("submit", function (e) {
    var rb = box.querySelector("[data-reachbox]");
    if (steps[cur] !== box || rb.hidden) { e.preventDefault(); return; }
    var ones = rb.querySelectorAll("[data-one]");
    var any = Array.prototype.some.call(ones, function (i) { return i.value.trim(); });
    ones[0].setCustomValidity(any ? "" : "Please add a phone number, Instagram handle or email so we can reach you.");
    if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); return; }
    box.querySelector("[data-summary]").value = buildSummary(form).text;
    var b = rb.querySelector("[data-send]"); b.disabled = true; b.textContent = "Sending…";
  });
  form.addEventListener("input", function (e) { if (e.target.hasAttribute("data-one")) form.querySelectorAll("[data-one]")[0].setCustomValidity(""); });

  form._wiz = { show: show, reset: function () { history = []; form.querySelectorAll("[data-skipped]").forEach(function (s) { s.removeAttribute("data-skipped"); }); show(0); } };
  show(0);
  return form._wiz;
}

/* Earliest "needed by" dates */
function setupDates() {
  document.querySelectorAll("input[type=date][data-min]").forEach(function (inp) {
    var d = addDays(inp.getAttribute("data-min") === "custom" ? CONFIG.CUSTOM_DAYS : CONFIG.READY_DAYS);
    inp.min = isoDate(d);
    var hint = inp.parentNode.querySelector(".date-hint");
    if (hint) hint.textContent = "Earliest: " + d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  });
}

/* ============================================================
   CHARMS (shop.html)
   ============================================================ */
function fromPrice(c) {
  var min = Infinity;
  TYPES.forEach(function (t) { var p = charmPrice(c, t.id); if (p != null && p < min) min = p; });
  return min === Infinity ? null : min;
}
function themeName(id) { var t = THEMES.filter(function (x) { return x.id === id; })[0]; return t ? t.name : ""; }
function charmCard(c) {
  var p = fromPrice(c);
  return '<article class="pcard">' +
    '<div class="pimg">' + (c.most ? '<span class="badge">Most wanted</span>' : '') +
      '<img src="' + esc(c.img) + '" alt="' + esc(c.name) + ' charm" loading="lazy"></div>' +
    '<div class="pbody"><span class="pcat">' + esc(themeName(c.theme)) + '</span>' +
      '<h3>' + esc(c.name) + '</h3>' +
      '<span class="pprice">' + (p ? "From " + rupees(p) : "Ask for price") + '</span>' +
      (c.note ? '<span class="pnote">' + esc(c.note) + '</span>' : '') +
      '<button type="button" class="btn small" data-charm="' + esc(c.id) + '">Choose</button></div>' +
    '</article>';
}
function findCharm(id) { return CHARMS.filter(function (c) { return c.id === id; })[0]; }

function setupShop() {
  var grid = document.getElementById("shop-grid");
  if (!grid) return;
  var row = document.getElementById("most-row");
  if (row) row.innerHTML = MOST_WANTED.map(function (id) { return charmCard(findCharm(id)); }).join("");

  var chips = document.getElementById("chips");
  chips.innerHTML = '<button type="button" class="chipbtn" data-theme="all">All charms</button>' +
    THEMES.map(function (t) { return '<button type="button" class="chipbtn" data-theme="' + t.id + '">' + esc(t.name) + '</button>'; }).join("");
  function show(th) {
    if (!themeName(th)) th = "all";
    chips.querySelectorAll(".chipbtn").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.theme === th ? "true" : "false"); });
    var list = CHARMS.filter(function (c) { return th === "all" || c.theme === th; });
    grid.innerHTML = list.map(charmCard).join("");
  }
  chips.addEventListener("click", function (e) {
    var b = e.target.closest(".chipbtn"); if (!b) return;
    history.replaceState(null, "", b.dataset.theme === "all" ? "shop.html" : "#" + b.dataset.theme);
    show(b.dataset.theme);
  });
  window.addEventListener("hashchange", function () { show(location.hash.slice(1)); });
  show(location.hash.slice(1));

  /* Order dialog: pick type → personalise → contact */
  var dlg = document.getElementById("order-dialog");
  var form = dlg.querySelector("form");
  var typesBox = document.getElementById("type-list");
  var charm = null;
  var wiz = setupWizard(form);

  form.skipTo = function (cur) {
    if (cur !== 0) return null;
    var picked = form.querySelector("[name='Make it as']:checked");
    return picked && picked.hasAttribute("data-discuss") ? 2 : null;
  };
  form.addEventListener("change", function (e) {
    if (e.target.name !== "Make it as") return;
    var p = charmPrice(charm, e.target.getAttribute("data-type"));
    form.querySelector("[name=Price]").value = p == null ? "Let's discuss – please share a price" : rupees(p);
  });

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-charm]"); if (!b) return;
    charm = findCharm(b.getAttribute("data-charm"));
    form.reset();
    dlg.querySelector("#od-img").src = charm.img;
    dlg.querySelector("#od-img").alt = charm.name;
    dlg.querySelector("#od-name").textContent = charm.name + " charm";
    dlg.querySelector("#od-cat").textContent = themeName(charm.theme) + (charm.note ? " · " + charm.note : "");
    form.querySelector("[name=Charm]").value = charm.name;
    form.querySelector("[name=_subject]").value = "New charm order: " + charm.name;
    typesBox.innerHTML = TYPES.map(function (t) {
      var p = charmPrice(charm, t.id);
      return '<label class="opt"><input type="radio" name="Make it as" value="' + esc(t.name) + '" data-type="' + t.id + '" required' + (p == null ? ' data-discuss' : '') + '>' +
        '<span class="opt-name">' + esc(t.name) + '</span>' +
        '<span class="opt-price' + (p == null ? ' ask' : '') + '">' + (p == null ? "Let's discuss" : rupees(p)) + '</span></label>';
    }).join("");
    wiz.reset();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  });
  dlg.querySelector("[data-close]").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
}

/* ============================================================
   Ask-for-price cards (figurines, décor, business)
   ============================================================ */
function ideaCard(c, btn) {
  var main = c.imgs[0]
    ? '<div class="idea-img' + (c.fit === "contain" ? " contain" : "") + '"><img src="' + esc(c.imgs[0]) + '" alt="' + esc(c.name) + '" loading="lazy"></div>'
    : '<div class="idea-img soon"><span>Photo coming soon</span></div>';
  var thumbs = c.imgs.length > 1
    ? '<div class="idea-thumbs">' + c.imgs.slice(1, 4).map(function (s) { return '<img src="' + esc(s) + '" alt="" loading="lazy">'; }).join("") + '</div>' : "";
  return '<article class="idea">' + main + thumbs +
    '<div class="pbody"><h3>' + esc(c.name) + '</h3>' +
    '<p class="idea-text">' + esc(c.text) + '</p>' +
    (c.price ? '<span class="pprice">' + esc(c.price) + '</span>' : '') +
    (c.note ? '<span class="pnote">' + esc(c.note) + '</span>' : '') + btn + '</div></article>';
}
function quoteBtn(c) {
  return '<a class="btn small" href="custom.html?type=' + encodeURIComponent(c.type) + '&item=' + encodeURIComponent(c.name) + '">' + (c.price ? "Get started" : "Get a quote") + '</a>';
}
function setupIdeas() {
  var f = document.getElementById("figurine-grid");
  if (f) f.innerHTML = FIGURINES.map(function (c) { return ideaCard(c, quoteBtn(c)); }).join("");
  var d = document.getElementById("decor-grid");
  if (d) d.innerHTML = DECOR.map(function (c) { return ideaCard(c, quoteBtn(c)); }).join("");
  var b = document.getElementById("business-grid");
  if (b) {
    b.innerHTML = BUSINESS.map(function (c, i) { return ideaCard(c, '<button type="button" class="btn small" data-biz="' + i + '">Get a quote</button>'); }).join("");
    b.addEventListener("click", function (e) {
      var x = e.target.closest("[data-biz]"); if (!x) return;
      pickBiz(BUSINESS[+x.dataset.biz].name);
    });
    var it = param("item"); if (it) pickBiz(it, true);
  }
}
function pickBiz(name, quiet) {
  var sel = document.querySelector("#business-form [name='Looking for']");
  if (!sel) return;
  for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === name) sel.value = name;
  var f = document.getElementById("enquire");
  f.scrollIntoView({ behavior: quiet ? "auto" : "smooth", block: "start" });
}

/* ============================================================
   CUSTOMISE (custom.html)
   ============================================================ */
function setupCustom() {
  var form = document.getElementById("custom-form");
  if (!form) return;
  var box = document.getElementById("custom-types");
  var groups = [];
  CUSTOM_TYPES.forEach(function (t) { if (groups.indexOf(t.group) === -1) groups.push(t.group); });
  box.innerHTML = groups.map(function (g) {
    return '<fieldset class="tgroup"><legend>' + esc(g === "Charms" ? "A charm, made as…" : g) + '</legend><div class="opts">' +
      CUSTOM_TYPES.filter(function (t) { return t.group === g; }).map(function (t) {
        return '<label class="opt"><input type="radio" name="What to make" value="' + esc(t.name) + '" required>' +
          '<span class="opt-name">' + esc(t.name) + '</span>' +
          (t.price ? '<span class="opt-price">' + esc(t.price) + '</span>' : '') + '</label>';
      }).join("") + '</div></fieldset>';
  }).join("");

  var hint = document.getElementById("photo-hint");
  function setHint() {
    var v = form.querySelector("[name='What to make']:checked");
    var t = v && CUSTOM_TYPES.filter(function (x) { return x.name === v.value; })[0];
    hint.textContent = t ? "Helpful photos: " + t.hint + "." : "";
    form.querySelector("[name=_subject]").value = "New custom request: " + (v ? v.value : "") + " – The Subtle Side website";
  }
  form.addEventListener("change", function (e) { if (e.target.name === "What to make") setHint(); });

  var wiz = setupWizard(form);
  var type = param("type"), item = param("item");
  if (type) {
    var r = form.querySelector("[name='What to make'][value='" + type.replace(/'/g, "\\'") + "']");
    if (r) { r.checked = true; setHint(); }
    if (item) {
      form.querySelector("[name='Starting from']").value = item;
      var s = document.getElementById("start-from"); s.hidden = false; s.querySelector("b").textContent = item;
    }
    if (r) form.querySelector("[data-go=next]").click();
  }
}

/* ============================================================
   Menu, back-to-top, how-it-works tabs
   ============================================================ */
function setupMenu() {
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("site-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  var sub = document.querySelector(".sub-toggle");
  var list = document.getElementById("custom-sub");
  if (!sub || !list) return;
  function set(open) { list.classList.toggle("open", open); sub.setAttribute("aria-expanded", open ? "true" : "false"); }
  sub.addEventListener("click", function (e) { e.stopPropagation(); set(!list.classList.contains("open")); });
  document.addEventListener("click", function (e) { if (!e.target.closest(".has-sub")) set(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && list.classList.contains("open")) { set(false); sub.focus(); } });
  var hub = document.querySelector(".has-sub");
  if (window.matchMedia("(hover: hover) and (min-width: 981px)").matches) {
    hub.addEventListener("mouseenter", function () { set(true); });
    hub.addEventListener("mouseleave", function () { set(false); });
  }
}
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
  setupMenu();
  setupToTop();
  setupHowTabs();
  setupDates();
  if (typeof CHARMS !== "undefined") {
    var home = document.getElementById("home-most");
    if (home) home.innerHTML = MOST_WANTED.map(function (id) { var c = findCharm(id); return '<a class="mini" href="shop.html"><img src="' + esc(c.img) + '" alt="" loading="lazy"><span>' + esc(c.name) + '</span></a>'; }).join("");
    setupShop();
    setupIdeas();
    setupCustom();
  }
  document.querySelectorAll("form.wiz:not(#custom-form):not(.in-dialog)").forEach(setupWizard);
});
