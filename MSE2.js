// ==========================================
// College E-Commerce Store (MSE2)
// Basic JavaScript for College Web Dev Project
// ==========================================

// 1. PRODUCT CATALOG
const products = [
  { id: 1, name: "Everyday Linen Shirt", price: 1890, color: "Ivory", sizes: ["S", "M", "L", "XL"], newest: 4, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85", description: "A relaxed linen-blend shirt with an easy fit and a soft, breathable feel." },
  { id: 2, name: "Relaxed Cotton Tee", price: 890, color: "Olive", sizes: ["S", "M", "L", "XL"], newest: 3, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85", description: "Your everyday essential, cut from comfortable cotton with a clean finish." },
  { id: 3, name: "Weekend Denim", price: 2290, color: "Blue", sizes: ["S", "M", "L"], newest: 2, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85", description: "Classic straight-leg denim designed to be worn on repeat." },
  { id: 4, name: "Soft Knit Cardigan", price: 2590, color: "Sand", sizes: ["S", "M", "L"], newest: 1, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=85", description: "A light, layer-friendly knit that works across seasons." },
  { id: 5, name: "Daily Cotton Dress", price: 1990, color: "Black", sizes: ["S", "M", "L", "XL"], newest: 5, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=85", description: "An easy cotton dress with a comfortable shape for all-day wear." },
  { id: 6, name: "Linen Easy Trousers", price: 1790, color: "Sand", sizes: ["S", "M", "L", "XL"], newest: 6, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=85", description: "Lightweight, relaxed trousers made for everyday comfort." },
  { id: 7, name: "Classic Overshirt", price: 2190, color: "Olive", sizes: ["S", "M", "L"], newest: 7, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85", description: "A versatile layer with a roomy fit and useful everyday details." },
  { id: 8, name: "Ribbed Tank", price: 690, color: "Black", sizes: ["S", "M", "L", "XL"], newest: 8, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85", description: "A soft ribbed basic that slips easily into your daily rotation." }
];

// 2. STATE VARIABLES
let cart = [], wishlist = [];
let currentPage = "home", selectedProductId = 1, selectedSize = "M";
let selectedFilterSize = "", selectedColor = "", maxPrice = 3000, selectedSort = "featured";
let appliedCoupon = "", couponMessage = "", authMode = "login";

// 3. STORAGE & HELPER FUNCTIONS
function loadData() {
  try { cart = JSON.parse(localStorage.getItem("tf-cart")) || []; } catch(e) { cart = []; }
  try { wishlist = JSON.parse(localStorage.getItem("tf-wishlist")) || []; } catch(e) { wishlist = []; }
}
function saveData() {
  localStorage.setItem("tf-cart", JSON.stringify(cart));
  localStorage.setItem("tf-wishlist", JSON.stringify(wishlist));
  updateCounts();
}
function getProduct(id) { return products.find(p => p.id === Number(id)) || null; }
function formatPrice(amt) { return "₹" + Number(amt).toLocaleString("en-IN"); }
function updateCounts() {
  document.getElementById("cart-count").innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
  document.getElementById("wish-count").innerText = wishlist.length ? `(${wishlist.length})` : "";
}
function goToPage(page) { currentPage = page; render(); window.scrollTo(0, 0); }
function openProduct(id) { selectedProductId = Number(id); selectedSize = "M"; goToPage("detail"); }
function selectSize(size) { selectedSize = size; render(); }
function setAuthMode(mode) { authMode = mode; render(); }
function clearFilters() { selectedFilterSize = ""; selectedColor = ""; maxPrice = 3000; render(); }
function showToast(msg) {
  let old = document.querySelector(".toast"); if (old) old.remove();
  let toast = document.createElement("div"); toast.className = "toast"; toast.innerText = msg;
  document.body.appendChild(toast); setTimeout(() => toast.remove(), 2000);
}

// 4. CART & WISHLIST ACTIONS
function addToCart(id) {
  let p = getProduct(id); if (!p) return;
  let size = p.sizes.includes(selectedSize) ? selectedSize : p.sizes[0];
  let item = cart.find(i => i.id === p.id && i.size === size);
  if (item) item.quantity++; else cart.push({ id: p.id, size, quantity: 1 });
  saveData(); showToast(p.name + " added to bag");
}
function changeQty(id, size, change) {
  let item = cart.find(i => i.id === id && i.size === size);
  if (item) item.quantity = Math.max(1, item.quantity + change);
  saveData(); render();
}
function removeItem(id, size) {
  cart = cart.filter(i => !(i.id === id && i.size === size));
  saveData(); render();
}
function toggleWishlist(id) {
  id = Number(id);
  let idx = wishlist.indexOf(id);
  if (idx !== -1) wishlist.splice(idx, 1); else wishlist.push(id);
  saveData(); render();
}
function calculateBill() {
  let subtotal = cart.reduce((sum, i) => sum + (getProduct(i.id)?.price || 0) * i.quantity, 0);
  let discount = (appliedCoupon === "STYLE10") ? Math.round(subtotal * 0.10) : 0;
  let taxable = subtotal - discount;
  let gst = Math.round(taxable * 0.05);
  let shipping = (taxable === 0 || taxable >= 2000) ? 0 : 99;
  return { subtotal, discount, gst, shipping, total: taxable + gst + shipping };
}

// 5. FORM SUBMISSIONS
function applyCoupon(e) {
  e.preventDefault();
  let code = (document.getElementById("coupon-input")?.value || "").trim().toUpperCase();
  appliedCoupon = (code === "STYLE10") ? code : "";
  couponMessage = (code === "STYLE10") ? "10% discount applied!" : (code ? "Invalid coupon code." : "Please enter a coupon code.");
  render();
}
function placeOrder(e) {
  e.preventDefault();
  let getVal = id => document.getElementById(id).value.trim();
  let checks = [
    ["full-name", getVal("full-name") !== "", "Full name is required."],
    ["email", getVal("email").includes("@"), "Enter a valid email address."],
    ["phone", getVal("phone").length === 10, "Enter a 10-digit phone number."],
    ["address", getVal("address") !== "", "Address is required."],
    ["city", getVal("city") !== "", "City is required."],
    ["pin", getVal("pin").length === 6, "Enter a 6-digit PIN code."]
  ];
  let hasError = false;
  checks.forEach(([id, ok, msg]) => {
    document.getElementById(id).nextElementSibling.innerText = ok ? "" : msg;
    if (!ok) hasError = true;
  });
  if (hasError) { document.getElementById("checkout-message").innerText = "Please fill in all details correctly."; return; }
  cart = []; appliedCoupon = ""; goToPage("confirmation"); saveData();
}
function handleAuth(e) {
  e.preventDefault();
  document.getElementById("auth-message").innerText = authMode === "register" ? "Account created successfully!" : "Logged in successfully!";
}

// 6. HTML VIEW BUILDERS
function createProductCard(p) {
  let isWish = wishlist.includes(p.id);
  return `<article class="product-card">
    <div class="product-image"><img src="${p.image}" alt="${p.name}" onclick="openProduct(${p.id})"><button class="heart" type="button" onclick="toggleWishlist(${p.id})">${isWish ? "♥" : "♡"}</button></div>
    <h3 class="product-name" onclick="openProduct(${p.id})">${p.name}</h3><p class="product-price">${formatPrice(p.price)}</p>
    <div class="product-actions"><span class="product-price">${p.color}</span><button class="button light small" type="button" onclick="addToCart(${p.id})">Add to bag</button></div>
  </article>`;
}

function renderOrderSummary(isCheckout = false) {
  let b = calculateBill();
  let items = isCheckout ? '<div class="checkout-summary">' + cart.map(i => `<div class="summary-row"><span>${getProduct(i.id).name} × ${i.quantity}</span><span>${formatPrice(getProduct(i.id).price * i.quantity)}</span></div>`).join("") + '</div>' : "";
  let disc = b.discount > 0 ? `<div class="summary-row"><span>Discount (STYLE10)</span><span>−${formatPrice(b.discount)}</span></div>` : "";
  let coupon = !isCheckout ? `<form class="coupon" onsubmit="applyCoupon(event)"><input id="coupon-input" name="coupon" placeholder="Coupon code" value="${appliedCoupon}"><button class="button light small" type="submit">Apply</button></form><p class="coupon-message">${couponMessage}</p>` : "";
  return `<h2>Order summary</h2>${items}
    <div class="summary-row"><span>Subtotal</span><span>${formatPrice(b.subtotal)}</span></div>${disc}
    <div class="summary-row"><span>GST (5%)</span><span>${formatPrice(b.gst)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${b.shipping === 0 ? "Free" : formatPrice(b.shipping)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${formatPrice(b.total)}</span></div>${coupon}`;
}

function renderHome() {
  return `<section class="wrap">
    <div class="hero"><div class="hero-copy"><span class="eyebrow">Welcome to our store</span><h1>Shop clothes online</h1><p>Browse our clothing collection and add your favourite items to the bag.</p><button class="button" type="button" onclick="goToPage('shop')">Shop now</button></div><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85" alt="Store hero"></div>
    <section class="home-products"><div class="section-heading"><h2>Customer favourites</h2><a href="#" onclick="goToPage('shop'); return false;">View all →</a></div><div class="product-grid">${products.slice(0, 4).map(createProductCard).join("")}</div></section>
  </section>`;
}

function renderShop() {
  let list = products.filter(p => p.price <= maxPrice && (!selectedColor || p.color === selectedColor) && (!selectedFilterSize || p.sizes.includes(selectedFilterSize)));
  if (selectedSort === "low") list.sort((a, b) => a.price - b.price);
  if (selectedSort === "high") list.sort((a, b) => b.price - a.price);
  if (selectedSort === "newest") list.sort((a, b) => b.newest - a.newest);

  let sizesHtml = ["S", "M", "L", "XL"].map(s => `<label><input type="checkbox" name="size" value="${s}" ${selectedFilterSize === s ? "checked" : ""} onchange="onSizeChange(this)"> ${s}</label>`).join("");
  let colorsHtml = '<option value="">All colours</option>' + ["Ivory", "Olive", "Blue", "Sand", "Black"].map(c => `<option value="${c}" ${selectedColor === c ? "selected" : ""}>${c}</option>`).join("");
  let grid = list.length ? list.map(createProductCard).join("") : '<div class="empty-state"><h2>No matches</h2><p>Try changing your filters.</p><button class="button light" type="button" onclick="clearFilters()">Clear filters</button></div>';

  return `<section class="wrap page"><h1 class="page-title">Shop all</h1><p class="page-intro">Everyday favourites, made easy to wear.</p>
    <div class="shop-layout">
      <aside class="filters" aria-label="Filters">
        <fieldset class="filter-group"><legend>Size</legend>${sizesHtml}</fieldset>
        <fieldset class="filter-group"><legend>Colour</legend><select id="color-filter" onchange="onColorChange(this.value)">${colorsHtml}</select></fieldset>
        <fieldset class="filter-group"><legend id="price-legend">Max price: ${formatPrice(maxPrice)}</legend><input id="price-filter" type="range" min="700" max="3000" step="100" value="${maxPrice}" oninput="onPriceChange(this.value)"></fieldset>
      </aside>
      <div>
        <div class="shop-toolbar"><span>${list.length} products</span>
          <select class="sort-select" id="sort-filter" onchange="onSortChange(this.value)">
            <option value="featured" ${selectedSort === "featured" ? "selected" : ""}>Featured</option>
            <option value="low" ${selectedSort === "low" ? "selected" : ""}>Price: low to high</option>
            <option value="high" ${selectedSort === "high" ? "selected" : ""}>Price: high to low</option>
            <option value="newest" ${selectedSort === "newest" ? "selected" : ""}>Newest</option>
          </select>
        </div>
        <div class="product-grid">${grid}</div>
      </div>
    </div>
  </section>`;
}

function renderDetail() {
  let p = getProduct(selectedProductId) || products[0];
  let isWish = wishlist.includes(p.id);
  let sizesHtml = p.sizes.map(s => `<button type="button" class="size-button ${selectedSize === s ? "selected" : ""}" onclick="selectSize('${s}')">${s}</button>`).join("");
  return `<section class="wrap page"><div class="detail"><img src="${p.image}" alt="${p.name}"><div class="detail-copy">
    <span class="eyebrow">Everyday collection</span><h1>${p.name}</h1><p class="price">${formatPrice(p.price)}</p><p>${p.description}</p>
    <label class="option-label">Choose a size</label><div class="sizes">${sizesHtml}</div>
    <label class="option-label">Colour</label><select class="color-select"><option>${p.color}</option></select>
    <div class="detail-actions"><button class="button" type="button" onclick="addToCart(${p.id})">Add to bag</button><button class="button light" type="button" onclick="toggleWishlist(${p.id})">${isWish ? "♥ Saved" : "♡ Wishlist"}</button></div>
  </div></div></section>`;
}

function renderWishlist() {
  let cards = wishlist.map(getProduct).filter(Boolean).map(createProductCard).join("");
  if (!cards) cards = '<div class="empty-state"><h2>No saved pieces yet</h2><p>Tap the heart on anything you love.</p><button class="button" type="button" onclick="goToPage(\'shop\')">Explore the shop</button></div>';
  return `<section class="wrap page"><h1 class="page-title">Your wishlist</h1><p class="page-intro">Your saved pieces, all in one place.</p><div class="product-grid">${cards}</div></section>`;
}

function renderCart() {
  if (cart.length === 0) return `<section class="wrap page"><h1 class="page-title">Your bag</h1><div class="empty-state"><h2>Your bag is empty</h2><p>Find something you'll love wearing.</p><button class="button" type="button" onclick="goToPage('shop')">Shop now</button></div></section>`;
  let items = cart.map(item => {
    let p = getProduct(item.id);
    return `<article class="cart-item"><img src="${p.image}" alt="${p.name}"><div><h3>${p.name}</h3><p>Size: ${item.size} · ${p.color}</p><p>${formatPrice(p.price)}</p><div class="quantity"><button type="button" onclick="changeQty(${p.id}, '${item.size}', -1)">−</button><span>${item.quantity}</span><button type="button" onclick="changeQty(${p.id}, '${item.size}', 1)">+</button></div></div><div class="price">${formatPrice(p.price * item.quantity)}<button class="text-button remove-button" type="button" onclick="removeItem(${p.id}, '${item.size}')">Remove</button></div></article>`;
  }).join("");
  return `<section class="wrap page"><h1 class="page-title">Your bag</h1><p class="page-intro">Review your picks before checkout.</p><div class="cart-layout"><div class="cart-list">${items}</div><aside class="summary">${renderOrderSummary(false)}<button class="button" type="button" onclick="goToPage('checkout')">Continue to checkout</button></aside></div></section>`;
}

function renderCheckout() {
  if (cart.length === 0) return `<section class="wrap page"><h1 class="page-title">Checkout</h1><div class="empty-state"><h2>Your bag is empty</h2><button class="button" type="button" onclick="goToPage('shop')">Shop now</button></div></section>`;
  return `<section class="wrap page"><h1 class="page-title">Checkout</h1><p class="page-intro">Add your details to place your order.</p>
    <div class="checkout-layout">
      <form class="form-card" id="checkout-form" onsubmit="placeOrder(event)" novalidate><h2>Delivery details</h2>
        <div class="form-grid">
          <div class="field full"><label>Full name</label><input id="full-name" required><span class="form-error"></span></div>
          <div class="field"><label>Email</label><input id="email" type="email" required><span class="form-error"></span></div>
          <div class="field"><label>Phone</label><input id="phone" type="tel" maxlength="10" oninput="this.value=this.value.replace(/\\D/g,'')" required><span class="form-error"></span></div>
          <div class="field full"><label>Address</label><input id="address" required><span class="form-error"></span></div>
          <div class="field"><label>City</label><input id="city" required><span class="form-error"></span></div>
          <div class="field"><label>PIN code</label><input id="pin" maxlength="6" oninput="this.value=this.value.replace(/\\D/g,'')" required><span class="form-error"></span></div>
        </div><p class="form-message" id="checkout-message"></p><button class="button" type="submit">Place order</button>
      </form><aside class="summary">${renderOrderSummary(true)}</aside>
    </div></section>`;
}

function renderAuth() {
  let isReg = (authMode === "register");
  return `<section class="wrap page"><div class="form-card auth-card"><h1 class="page-title">${isReg ? "Create an account" : "Welcome back"}</h1><p class="page-intro">${isReg ? "Join us for easy everyday shopping." : "Sign in to your account."}</p>
    <div class="auth-tabs"><button type="button" class="${!isReg ? "active" : ""}" onclick="setAuthMode('login')">Login</button><button type="button" class="${isReg ? "active" : ""}" onclick="setAuthMode('register')">Register</button></div>
    <form id="auth-form" onsubmit="handleAuth(event)">
      ${isReg ? '<div class="field"><label>Name</label><input id="auth-name" required></div>' : ''}
      <div class="field"><label>Email</label><input id="auth-email" type="email" required></div>
      <div class="field"><label>Password</label><input id="auth-password" type="password" minlength="6" required></div>
      <p class="form-message" id="auth-message"></p><button class="button" type="submit">${isReg ? "Create account" : "Login"}</button>
    </form></div></section>`;
}

function renderConfirmation() {
  return `<section class="wrap page"><div class="empty-state"><span class="eyebrow">Thank you</span><h2>Order confirmed</h2><p>Your order has been placed successfully.</p><button class="button" type="button" onclick="goToPage('shop')">Continue shopping</button></div></section>`;
}

// 7. FILTER LISTENERS & MAIN RENDER
function onSizeChange(box) { selectedFilterSize = box.checked ? box.value : ""; render(); }
function onColorChange(val) { selectedColor = val; render(); }
function onSortChange(val) { selectedSort = val; render(); }
function onPriceChange(val) {
  maxPrice = Number(val);
  let el = document.getElementById("price-legend");
  if (el) el.innerText = "Max price: " + formatPrice(maxPrice);
}

function render() {
  let views = { home: renderHome, shop: renderShop, detail: renderDetail, wishlist: renderWishlist, cart: renderCart, checkout: renderCheckout, confirmation: renderConfirmation, auth: renderAuth };
  document.getElementById("app").innerHTML = (views[currentPage] || renderHome)();
  updateCounts();
}

// Header link clicks
document.addEventListener("click", function(e) {
  let route = e.target.closest("[data-route]");
  if (route) { e.preventDefault(); goToPage(route.getAttribute("data-route")); }
  let detail = e.target.closest("[data-detail]");
  if (detail) { e.preventDefault(); openProduct(Number(detail.getAttribute("data-detail"))); }
});

// 8. START APP
loadData();
render();
