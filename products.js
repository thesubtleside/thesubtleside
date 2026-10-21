/* ============================================================
   PRODUCT CATALOGUE
   To add a product: copy one line, change the name, category, image and price.
   price: what shows on the card, e.g. "₹450", "From ₹750", "Custom quote".
          Leave it as "" to show "Ask for price".
   note:  optional small line under the price, e.g. "+₹200 per extra figure".
   Categories must match one of the ids in CATEGORIES below.
   ============================================================ */
var CATEGORIES = [
  { id: "jewellery",   name: "Jewellery" },
  { id: "portraits",   name: "3D portraits" },
  { id: "food",        name: "Food miniatures" },
  { id: "accessories", name: "Keychains & accessories" },
  { id: "figurines",   name: "Figurines & desk pieces" },
  { id: "decor",       name: "Home decor" },
  { id: "festive",     name: "Festive" },
  { id: "corporate",   name: "Corporate gifting" }
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

  // 3D portraits
  { name: "3D portrait on canvas",        cat: "portraits", img: "images/portraits/couple-portrait-1.jpg", price: "₹1,150", note: "2 figures · +₹200 per extra figure" },
  { name: "Travel memory portrait",       cat: "portraits", img: "images/portraits/travel-couple-portrait.jpg", price: "₹1,150", note: "2 figures · +₹200 per extra figure" },
  { name: "Beach couple portrait",        cat: "portraits", img: "images/portraits/beach-couple-portrait.jpg", price: "₹1,150", note: "2 figures · +₹200 per extra figure" },
  { name: "Graduation portrait",          cat: "portraits", img: "images/portraits/graduation-portrait-duo.jpg", price: "₹1,150", note: "2 figures · +₹200 per extra figure" },

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

  // Keychains & accessories
  { name: "Burger keychains",             cat: "accessories", img: "images/accessories/burger-keychains.jpg", price: "₹350" },
  { name: "Noodles & coffee keychain",    cat: "accessories", img: "images/food/noodles-charm.jpg", price: "₹550" },
  { name: "Chicken leg keychain",         cat: "accessories", img: "images/food/chicken-leg-keychain.jpg", price: "₹450" },
  { name: "Dumplings fridge magnet",      cat: "accessories", img: "images/accessories/dumplings-magnet.jpg", price: "₹550" },
  { name: "Chess bookmark",               cat: "accessories", img: "images/accessories/chess-bookmark.jpg", price: "₹450" },

  // Figurines & desk pieces
  { name: "Pet figurines",                cat: "figurines", img: "images/accessories/dog-trio-figures.jpg", price: "From ₹750" },
  { name: "Motorcycle desk model",        cat: "figurines", img: "images/accessories/desk-motorcycle-model.jpg", price: "₹1,500" },

  // Home decor
  { name: "Antique art tea light holder", cat: "decor", img: "images/tealights/antique-tealight-lit.jpg", price: "From ₹800" },
  { name: "Tea light holder set",         cat: "decor", img: "images/tealights/antique-tealight-row.jpg", price: "" },
  { name: "Tea light holder pair",        cat: "decor", img: "images/tealights/tealight-pair-glass.jpg", price: "" },
  { name: "Floral mirror frame",          cat: "decor", img: "images/accessories/floral-mirror-frame.jpg", price: "" },
  { name: "Story charm mirror frame",     cat: "decor", img: "images/accessories/charm-mirror-frame-large.jpg", price: "From ₹1,500" },

  // Festive
  { name: "Christmas charms",             cat: "festive", img: "images/festive/xmas-wreath-charms.jpg", price: "Custom quote" },
  { name: "Valentine's fridge magnets",   cat: "festive", img: "images/festive/valentine-heart-macro.jpg", price: "Custom quote" },
  { name: "Valentine's gift box magnets", cat: "festive", img: "images/festive/valentine-chocolate-box.jpg", price: "Custom quote" },

  // Corporate
  { name: "Welcome charms for resorts",   cat: "corporate", img: "images/corporate/kerala-animal-charms-set.jpg", price: "", fit: "contain" },
  { name: "Car lapel pin",                cat: "corporate", img: "images/lapelpins/beetle-car-pin.jpg", price: "", fit: "contain" },
  { name: "Race car lapel pin",           cat: "corporate", img: "images/lapelpins/lapel-pin-lifestyle.jpg", price: "" },
  { name: "Vintage car stick pin",        cat: "corporate", img: "images/lapelpins/vintage-car-stickpin.jpg", price: "", fit: "contain" }
];
