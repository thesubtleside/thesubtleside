/* ============================================================
   EDIT THESE TWO LINES, then upload the folder.
   WHATSAPP_NUMBER: country code + number, digits only (e.g. 919876543210)
   PAY_LINK: your Razorpay Payment Page / Payment Link URL (leave "" to hide the Pay button)
   ============================================================ */
var CONFIG = {
  WHATSAPP_NUMBER: "918800383938",
  PAY_LINK: ""
};

function openWhatsApp(text) {
  var url = "https://wa.me/" + CONFIG.WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  window.open(url, "_blank", "noopener");
}

document.addEventListener("DOMContentLoaded", function () {
  // Footer / anywhere: show the WhatsApp number
  document.querySelectorAll("[data-wa-number]").forEach(function (el) {
    el.textContent = "+" + CONFIG.WHATSAPP_NUMBER;
    el.setAttribute("href", "https://wa.me/" + CONFIG.WHATSAPP_NUMBER);
  });

  // Pay buttons: hide if no link configured
  document.querySelectorAll("[data-pay]").forEach(function (el) {
    if (!CONFIG.PAY_LINK) { el.style.display = "none"; return; }
    el.setAttribute("href", CONFIG.PAY_LINK);
  });

  // Custom request form (home page)
  var form = document.getElementById("custom-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var msg =
        "Hi The Subtle Side! I'd like a custom order.\n\n" +
        "Name: " + (d.get("name") || "") + "\n" +
        "Product: " + (d.get("product") || "") + "\n" +
        "Needed by: " + (d.get("date") || "not fixed") + "\n" +
        "Details: " + (d.get("details") || "") + "\n\n" +
        "I'll send my reference photos here.";
      openWhatsApp(msg);
    });
  }

  // Product page
  var pdp = document.getElementById("pdp");
  if (pdp) {
    var state = { size: pdp.querySelector(".pill[aria-pressed='true']").dataset.size, figures: 2 };
    var out = document.getElementById("figures");
    var sum = document.getElementById("summary");

    function addons() {
      return Array.prototype.map.call(pdp.querySelectorAll(".addon input:checked"), function (i) { return i.value; });
    }
    function render() {
      out.textContent = state.figures;
      var a = addons();
      sum.textContent = state.size + " · " + state.figures + " figure" + (state.figures > 1 ? "s" : "") + (a.length ? " · " + a.join(", ") : "");
    }

    pdp.querySelectorAll(".pill").forEach(function (b) {
      b.addEventListener("click", function () {
        pdp.querySelectorAll(".pill").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        state.size = b.dataset.size;
        render();
      });
    });
    document.getElementById("less").addEventListener("click", function () { state.figures = Math.max(1, state.figures - 1); render(); });
    document.getElementById("more").addEventListener("click", function () { state.figures = Math.min(8, state.figures + 1); render(); });
    pdp.querySelectorAll(".addon input").forEach(function (i) { i.addEventListener("change", render); });

    document.getElementById("order").addEventListener("click", function () {
      var notes = document.getElementById("notes").value;
      var msg =
        "Hi The Subtle Side! I'd like to order:\n\n" +
        pdp.dataset.product + "\n" +
        "Options: " + sum.textContent + "\n" +
        (notes ? "Notes: " + notes + "\n" : "") +
        "\nI'll send my photos here.";
      openWhatsApp(msg);
    });
    render();
  }
});
