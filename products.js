/* ============================================================
   THE SUBTLE SIDE – PRODUCT LISTS
   There are three lists below, one for each part of the website:

   1. PRODUCTS      → the Shop (ready to order)
   2. CUSTOM_IDEAS  → the "Make it yours" page (made from customer photos)
   3. BUSINESS      → the "For businesses" page

   To add a product: copy one line, then change the name, image and price.
   price: what shows on the card, e.g. "₹450", "From ₹750", "Custom quote".
          Leave it as "" to show "Ask for price".
   note:  optional small line under the price.
   ============================================================ */

/* ---------- 1. SHOP: ready to order ---------- */
var CATEGORIES = [
  { id: "jewellery",   name: "Jewellery" },
  { id: "food",        name: "Food miniatures" },
  { id: "accessories", name: "Keychains & magnets" },
  { id: "decor",       name: "Home decor" },
  { id: "festive",     name: "Festive" }
];

var PRODUCTS = [
  // Jewellery
  { name: "Strawberry earrings",          cat: "jewellery", img: "images/jewellery/strawberry-earrings.jpg", price: "₹250" },
  { name: "Sunflower necklace",           cat: "jewellery", img: "images/jewellery/sunflower-necklace.jpg", price: "₹250" },
  { name: "Daisy drop earrings",          cat: "jewellery", img: "images/jewellery/daisy-drop-earrings.jpg", price: "₹250" },
  { name: "Calla lily earrings",          cat: "jewellery", img: "images/jewellery/calla-lily-earrings.jpg", price: "₹250" },
  { name: "Chilli earrings",              cat: "jewellery", img: "images/jewellery/chilli-earrings.jpg", price: "₹350" },
  { name: "Cookie earrings",              cat: "jewellery", img: "images/jewellery/cookie-earrings.jpg", price: "₹350" },
  { name: "Rainbow studs",                cat: "jewellery", img: "images/jewellery/rainbow-studs.jpg", price: "₹250" },
  { name: "Penguin studs",                cat: "jewellery", img: "images/jewellery/penguin-studs.jpg", price: "₹250" },
  { name: "Butterfly brooch",             cat: "jewellery", img: "images/jewellery/butterfly-brooch.jpg", price: "₹350" },
  { name: "Jersey earrings (your name & number)", cat: "jewellery", img: "images/jewellery/dhoni-jersey-earrings.jpg", price: "₹550" },
  { name: "Pet earrings & cake charm",    cat: "jewellery", img: "images/accessories/doggo-earrings-cake-charm.jpg", price: "₹450" },

  // Food miniatures
  { name: "Dosa platter",                 cat: "food", img: "images/food/dosa-platter.jpg", price: "₹450" },
  { name: "Mini pizzas",                  cat: "food", img: "images/food/mini-pizzas-grid.jpg", price: "₹450" },
  { name: "Noodles plate",                cat: "food", img: "images/food/noodles-black-plate.jpg", price: "₹450" },
  { name: "Egg & toast plate",            cat: "food", img: "images/food/egg-toast-plate.jpg", price: "₹450" },
  { name: "Chicken lollipop tray",        cat: "food", img: "images/food/chicken-lollipop-tray.jpg", price: "₹450" },
  { name: "Drumsticks tray",              cat: "food", img: "images/food/drumsticks-tray.jpg", price: "₹450" },
  { name: "Paan charm",                   cat: "food", img: "images/food/paan-charm.jpg", price: "₹450" },
  { name: "Popcorn charms",               cat: "food", img: "images/food/popcorn-charms.jpg", price: "₹450" },
  { name: "Pizza tray set",               cat: "food", img: "images/food/pizza-tray-set.jpg", price: "₹450" },
  { name: "Dessert charms",               cat: "food", img: "images/food/dessert-heart-strip.jpg", price: "₹450" },
  { name: "Burger jar",                   cat: "food", img: "images/food/burger-jar.jpg", price: "₹850" },

  // Keychains & magnets
  { name: "Burger keychains",             cat: "accessories", img: "images/accessories/burger-keychains.jpg", price: "₹350" },
  { name: "Noodles & coffee keychain",    cat: "accessories", img: "images/food/noodles-charm.jpg", price: "₹550" },
  { name: "Chicken leg keychain",         cat: "accessories", img: "images/food/chicken-leg-keychain.jpg", price: "₹450" },
  { name: "Dumplings fridge magnet",      cat: "accessories", img: "images/accessories/dumplings-magnet.jpg", price: "₹550" },
  { name: "Chess bookmark",               cat: "accessories", img: "images/accessories/chess-bookmark.jpg", price: "₹450" },

  // Home decor
  { name: "Antique art tea light holder", cat: "decor", img: "images/tealights/antique-tealight-lit.jpg", price: "From ₹800" },
  { name: "Tea light holder set",         cat: "decor", img: "images/tealights/antique-tealight-row.jpg", price: "" },
  { name: "Tea light holder pair",        cat: "decor", img: "images/tealights/tealight-pair-glass.jpg", price: "" },
  { name: "Floral mirror frame",          cat: "decor", img: "images/accessories/floral-mirror-frame.jpg", price: "" },

  // Festive (seasonal)
  { name: "Christmas charms",             cat: "festive", img: "images/festive/xmas-wreath-charms.jpg", price: "Custom quote" },
  { name: "Valentine's fridge magnets",   cat: "festive", img: "images/festive/valentine-heart-macro.jpg", price: "Custom quote" },
  { name: "Valentine's gift box magnets", cat: "festive", img: "images/festive/valentine-chocolate-box.jpg", price: "Custom quote" }
];

/* Products shown under "Customer favourites" on the home page (names must match the list above) */
var FEATURED = ["Dosa platter", "Strawberry earrings", "Antique art tea light holder", "Burger keychains"];

/* ---------- 2. MAKE IT YOURS: made from customer photos ---------- */
/* type must match an option in the form on custom.html */
var CUSTOM_IDEAS = [
  { name: "3D portraits", type: "3D portrait", price: "From ₹1,150", note: "2 figures · +₹200 per extra figure",
    text: "Your people on a mini canvas, sculpted from your photos: outfits, poses and the backdrop of a day you loved.",
    imgs: ["images/portraits/couple-portrait-1.jpg", "images/portraits/travel-couple-portrait.jpg", "images/portraits/graduation-portrait-duo.jpg", "images/portraits/beach-couple-portrait.jpg"] },
  { name: "Pet figurines", type: "Pet figurine", price: "From ₹750", note: "",
    text: "Your pet in clay, down to the patches, the ears and the collar.",
    imgs: ["images/accessories/dog-trio-figures.jpg"] },
  { name: "Vehicle models", type: "Vehicle model", price: "₹1,500", note: "",
    text: "Their bike or car, recreated as a desk piece. Send us photos from a few angles.",
    imgs: ["images/accessories/desk-motorcycle-model.jpg"] },
  { name: "Story charm mirror frame", type: "Story charm mirror frame", price: "From ₹1,500", note: "",
    text: "A mirror framed with tiny charms of the people, places and things that make up your story.",
    imgs: ["images/accessories/charm-mirror-frame-large.jpg"] }
];

/* ---------- 3. FOR BUSINESSES ---------- */
var BUSINESS = [
  { name: "Welcome charms for resorts", img: "images/corporate/kerala-animal-charms-set.jpg", fit: "contain" },
  { name: "Car lapel pin",              img: "images/lapelpins/beetle-car-pin.jpg", fit: "contain" },
  { name: "Race car lapel pin",         img: "images/lapelpins/lapel-pin-lifestyle.jpg" },
  { name: "Vintage car stick pin",      img: "images/lapelpins/vintage-car-stickpin.jpg", fit: "contain" }
];
