/* ============================================================
   THE SUBTLE SIDE – PRODUCT LIST
   Edit this file to add, remove or re-price products.

   CHARMS: every charm has a "level". The level decides the price of each
   product type. Customers never see the level, only the ₹ price of the type
   they pick. To add a new charm, copy a line and give it a level.

   Optional charm fields:
     most: true      → "Most wanted" badge + shown in the top row
     small: 100      → overrides the phone/shoe/bookmark/lapel price
     note: "…"       → small line shown under the name
   ============================================================ */

/* The 8 things a charm can be made into.
   band: big = earrings & necklace, mid = keychain & magnet, small = the rest */
var TYPES = [
  { id: "earrings", name: "Earrings",           band: "big" },
  { id: "necklace", name: "Necklace",           band: "big" },
  { id: "keychain", name: "Keychain / bag tag", band: "mid" },
  { id: "phone",    name: "Phone charm",        band: "small" },
  { id: "shoe",     name: "Shoe charm",         band: "small" },
  { id: "magnet",   name: "Fridge magnet",      band: "mid" },
  { id: "bookmark", name: "Bookmark",           band: "small" },
  { id: "pin",      name: "Lapel pin / brooch", band: "small" }
];

/* INTERNAL price levels (₹). "flat" = same price for every type.
   "no" = types we don't normally make → shown as "Let's discuss – ask for price". */
var LEVELS = {
  A:   { big: 250, mid: 200, small: 150 },
  B:   { big: 300, mid: 250, small: 150 },
  C:   { big: 350, mid: 300, small: 200 },
  D:   { big: 400, mid: 350, small: 250 },
  E:   { big: 450, mid: 400, small: 300 },
  F:   { big: 550, mid: 500, small: 400 },
  P700: { flat: 700, no: ["earrings"] },
  P900: { flat: 900, no: ["earrings"] }
};

var THEMES = [
  { id: "food",    name: "Food & drink" },
  { id: "flowers", name: "Flowers & nature" },
  { id: "quirky",  name: "Quirky & fun" },
  { id: "sports",  name: "Sports & hobbies" }
];

var CHARMS = [
  // Food & drink
  { id: "strawberry",  name: "Strawberry",      theme: "food", level: "A", img: "images/charms/strawberry.jpg" },
  { id: "cookie",      name: "Cookie",          theme: "food", level: "A", img: "images/charms/cookie.jpg" },
  { id: "chilli",      name: "Chilli",          theme: "food", level: "A", img: "images/charms/chilli.jpg" },
  { id: "pizza-slice", name: "Pizza slice",     theme: "food", level: "C", img: "images/charms/pizza-slice.jpg" },
  { id: "donut",       name: "Donut",           theme: "food", level: "C", img: "images/charms/donut.jpg" },
  { id: "burger",      name: "Burger",          theme: "food", level: "E", img: "images/charms/burger.jpg", most: true },
  { id: "chicken-leg", name: "Chicken leg",     theme: "food", level: "E", img: "images/charms/chicken-leg.jpg", most: true },
  { id: "cakes",       name: "Mini cakes",      theme: "food", level: "E", img: "images/charms/cakes.jpg" },
  { id: "popcorn",     name: "Popcorn",         theme: "food", level: "F", img: "images/charms/popcorn.jpg" },
  { id: "dumplings",   name: "Dumplings",       theme: "food", level: "P700", img: "images/charms/dumplings.jpg", most: true },
  { id: "noodles",     name: "Noodles",         theme: "food", level: "P700", img: "images/charms/noodles.jpg", note: "Coffee charm shown is an add-on" },
  { id: "full-pizza",  name: "Full pizza",      theme: "food", level: "P700", img: "images/charms/full-pizza.jpg", most: true },
  { id: "dosa",        name: "Dosa platter",    theme: "food", level: "P700", img: "images/charms/dosa-platter.jpg", most: true },
  { id: "egg-toast",   name: "Egg toast plate", theme: "food", level: "P700", img: "images/charms/egg-toast-plate.jpg" },
  { id: "curry-naan",  name: "Curry & naan plate", theme: "food", level: "P700", img: "images/charms/curry-naan-plate.jpg" },
  { id: "sadhya",      name: "Sadhya platter",  theme: "food", level: "P900", img: "images/charms/sadhya-platter.jpg" },

  // Flowers & nature
  { id: "sunflower",   name: "Sunflower",       theme: "flowers", level: "C", img: "images/charms/sunflower.jpg" },
  { id: "calla-lily",  name: "Calla lily",      theme: "flowers", level: "A", small: 100, img: "images/charms/calla-lily.jpg" },
  { id: "daisy",       name: "Daisy",           theme: "flowers", level: "A", small: 100, img: "images/charms/daisy.jpg" },
  { id: "daisy-bee",   name: "Daisy with bee",  theme: "flowers", level: "D", img: "images/charms/daisy-bee.jpg" },
  { id: "mushroom",    name: "Mushroom",        theme: "flowers", level: "C", img: "images/charms/mushroom.jpg" },
  { id: "butterfly",   name: "Butterfly",       theme: "flowers", level: "F", img: "images/charms/butterfly.jpg" },

  // Quirky & fun (Jersey is under Sports & hobbies)
  { id: "cigarette",   name: "Cigarette",       theme: "quirky", level: "E", img: "images/charms/cigarette.jpg", most: true },
  { id: "nimbu-mirchi",name: "Nimbu mirchi",    theme: "quirky", level: "F", img: "images/charms/nimbu-mirchi.jpg", most: true },
  { id: "penguin",     name: "Penguin",         theme: "quirky", level: "B", img: "images/charms/penguin.jpg" },
  { id: "jersey",      name: "Jersey",          theme: "sports", level: "F", img: "images/charms/jersey.jpg", note: "Add any name and number" },
  { id: "rainbow",     name: "Rainbow",         theme: "quirky", level: "A", small: 100, img: "images/charms/rainbow.jpg" }
];

/* Order of the "Most wanted" row */
var MOST_WANTED = ["cigarette", "nimbu-mirchi", "dumplings", "burger", "chicken-leg", "full-pizza", "dosa"];

/* Price of one charm as one type. Returns a number, or null for "Let's discuss". */
function charmPrice(charm, typeId) {
  var lv = LEVELS[charm.level];
  if (!lv) return null;
  if (lv.no && lv.no.indexOf(typeId) !== -1) return null;
  if (lv.flat) return lv.flat;
  var t = TYPES.filter(function (x) { return x.id === typeId; })[0];
  if (t.band === "small" && charm.small) return charm.small;
  return lv[t.band];
}

/* ---------- Figurines & portraits ---------- */
var FIGURINES = [
  { name: "3D portraits", type: "3D portrait", price: "From ₹1,150", note: "2 figures · +₹200 per extra figure",
    text: "You, your people and your favourite place, sculpted from a photo.",
    imgs: ["images/figurines/portrait-5.jpg", "images/figurines/portrait-1.jpg", "images/figurines/portrait-3.jpg", "images/figurines/portrait-4.jpg"] },
  { name: "Pet figurines", type: "Pet figurine",
    text: "Your dog, cat or bird, down to the markings.",
    imgs: ["images/figurines/pet-2.jpg", "images/figurines/pet-1.jpg", "images/figurines/pet-3.jpg"] },
  { name: "Vehicle miniatures", type: "Vehicle miniature",
    text: "Their bike or car as a tiny desk model, number plate and all.",
    imgs: ["images/figurines/vehicle-1.jpg", "images/figurines/vehicle-2.jpg", "images/figurines/vehicle-3.jpg"] }
];

/* ---------- Home décor ---------- */
var DECOR = [
  { name: "Story mirrors", type: "Story mirror",
    text: "A mirror framed with charms of the things you love.",
    imgs: ["images/decor/mirror-1.jpg", "images/decor/mirror-2.jpg"] },
  { name: "Cake toppers", type: "Cake topper",
    text: "A clay topper to keep long after the cake is gone.",
    imgs: ["images/decor/cake-topper-2.jpg", "images/decor/cake-topper-1.jpg", "images/decor/cake-topper-3.jpg"] },
  { name: "Polaroid holders", type: "Polaroid holder",
    text: "A little clay stand to hold your favourite photo.",
    imgs: [] }
];

/* ---------- For businesses ---------- */
var BUSINESS = [
  { name: "Kerala animals set", fit: "contain", text: "Welcome charms made for a Kerala resort.", imgs: ["images/business/kerala-animals.jpg"] },
  { name: "Business logo pieces", text: "Your logo or brand in clay, for gift boxes and giveaways.", imgs: ["images/business/logo-box.jpg", "images/business/logo-box-detail.jpg", "images/business/logo-heart.jpg"] },
  { name: "Antique tealights", text: "Hand-painted tealight holders for hampers and festive gifting.", imgs: ["images/business/antique-tealight-1.jpg", "images/business/antique-tealight-2.jpg"] },
  { name: "Christmas wreath", text: "Festive wreath charms for teams and clients.", imgs: ["images/business/christmas-wreath.jpg"] }
];

/* ---------- Customise: what people can order from their own photos ---------- */
var CUSTOM_TYPES = [
  { name: "Earrings",           group: "Charms", hint: "Clear photo of the thing to sculpt, front and side" },
  { name: "Necklace",           group: "Charms", hint: "Clear photo of the thing to sculpt, front and side" },
  { name: "Keychain / bag tag", group: "Charms", hint: "Clear photo of the thing to sculpt, front and side" },
  { name: "Phone charm",        group: "Charms", hint: "Clear photo of the thing to sculpt, front and side" },
  { name: "Shoe charm",         group: "Charms", hint: "Clear photo of the thing to sculpt, front and side" },
  { name: "Fridge magnet",      group: "Charms", hint: "Clear photo of the thing to sculpt, front and side" },
  { name: "Bookmark",           group: "Charms", hint: "Clear photo of the thing to sculpt, front and side" },
  { name: "Lapel pin / brooch", group: "Charms", hint: "Clear photo of the thing to sculpt, front and side" },
  { name: "3D portrait",        group: "Figurines", price: "From ₹1,150", hint: "A full-length photo of each person, plus the outfit to copy" },
  { name: "Pet figurine",       group: "Figurines", hint: "Your pet from the front and side, plus a close-up of any markings" },
  { name: "Vehicle miniature",  group: "Figurines", hint: "The vehicle from the front, side and back, plus the number plate" },
  { name: "Story mirror",       group: "Home décor", hint: "The colours or theme you'd like, and the size" },
  { name: "Cake topper",        group: "Home décor", hint: "The cake theme, the name or number, and any character" },
  { name: "Polaroid holder",    group: "Home décor", hint: "The photo it will hold and the theme you'd like" },
  { name: "Something else",     group: "Other", hint: "Any photos that help, plus a note" }
];
