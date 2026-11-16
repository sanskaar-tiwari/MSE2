// ==========================================
// College E-Commerce Project (MSE2)
// Simple JavaScript for College Evaluation
// ==========================================

// 1. PRODUCTS DATA
var products = [
  { id: 1, name: "Everyday Linen Shirt", price: 1890, color: "Ivory", sizes: ["S", "M", "L", "XL"], newest: 4, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85", description: "A relaxed linen-blend shirt with an easy fit and a soft, breathable feel." },
  { id: 2, name: "Relaxed Cotton Tee", price: 890, color: "Olive", sizes: ["S", "M", "L", "XL"], newest: 3, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85", description: "Your everyday essential, cut from comfortable cotton with a clean finish." },
  { id: 3, name: "Weekend Denim", price: 2290, color: "Blue", sizes: ["S", "M", "L"], newest: 2, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85", description: "Classic straight-leg denim designed to be worn on repeat." },
  { id: 4, name: "Soft Knit Cardigan", price: 2590, color: "Sand", sizes: ["S", "M", "L"], newest: 1, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=85", description: "A light, layer-friendly knit that works across seasons." },
  { id: 5, name: "Daily Cotton Dress", price: 1990, color: "Black", sizes: ["S", "M", "L", "XL"], newest: 5, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=85", description: "An easy cotton dress with a comfortable shape for all-day wear." },
  { id: 6, name: "Linen Easy Trousers", price: 1790, color: "Sand", sizes: ["S", "M", "L", "XL"], newest: 6, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=85", description: "Lightweight, relaxed trousers made for everyday comfort." },
  { id: 7, name: "Classic Overshirt", price: 2190, color: "Olive", sizes: ["S", "M", "L"], newest: 7, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85", description: "A versatile layer with a roomy fit and useful everyday details." },
  { id: 8, name: "Ribbed Tank", price: 690, color: "Black", sizes: ["S", "M", "L", "XL"], newest: 8, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85", description: "A soft ribbed basic that slips easily into your daily rotation." }
];

// 2. GLOBAL VARIABLES
var cart = [];
var wishlist = [];
var currentPage = "home";
var selectedProductId = 1;
var selectedSize = "M";
var selectedFilterSize = "";
var selectedColor = "";
var maxPrice = 3000;
var selectedSort = "featured";
var appliedCoupon = "";
var couponMessage = "";
var authMode = "login";

// 3. STORAGE & BASIC HELPERS
function loadData() {
  try { cart = JSON.parse(localStorage.getItem("tf-cart")) || []; } catch(e) { cart = []; }
  try { wishlist = JSON.parse(localStorage.getItem("tf-wishlist")) || []; } catch(e) { wishlist = []; }
}

function saveData() {
  localStorage.setItem("tf-cart", JSON.stringify(cart));
  localStorage.setItem("tf-wishlist", JSON.stringify(wishlist));
  updateCounts();
}

function getProduct(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === Number(id)) return products[i];
  }
  return null;
}

function formatPrice(amt) {
  return "₹" + Number(amt).toLocaleString("en-IN");
}

function updateCounts() {
  var total = 0;
  for (var i = 0; i < cart.length; i++) total += cart[i].quantity;
  document.getElementById("cart-count").innerText = total;
  document.getElementById("wish-count").innerText = wishlist.length > 0 ? "(" + wishlist.length + ")" : "";
}

function goToPage(page) { currentPage = page; render(); window.scrollTo(0, 0); }
function openProduct(id) { selectedProductId = Number(id); selectedSize = "M"; goToPage("detail"); }
function selectSize(s) { selectedSize = s; render(); }
function setAuthMode(m) { authMode = m; render(); }
function clearFilters() { selectedFilterSize = ""; selectedColor = ""; maxPrice = 3000; render(); }

function showToast(msg) {
  var old = document.querySelector(".toast");
  if (old) old.remove();
  var t = document.createElement("div");
  t.className = "toast";
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(function() { t.remove(); }, 2000);
}

// 4. CART & WISHLIST ACTIONS
function addToCart(productId) {
  var product = getProduct(productId);
  if (!product) return;
  var size = selectedSize;
  var found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id && cart[i].size === size) {
      cart[i].quantity += 1;
      found = true;
      break;
    }
  }
  if (!found) cart.push({ id: product.id, size: size, quantity: 1 });
  saveData();
  showToast(product.name + " added to bag");
}

function changeQty(productId, size, change) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId && cart[i].size === size) {
      cart[i].quantity += change;
      if (cart[i].quantity < 1) cart[i].quantity = 1;
      break;
    }
  }
  saveData();
  render();
}

function removeItem(productId, size) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId && cart[i].size === size) {
      cart.splice(i, 1);
      break;
    }
  }
  saveData();
  render();
}

function toggleWishlist(productId) {
  var id = Number(productId);
  var idx = wishlist.indexOf(id);
  if (idx !== -1) wishlist.splice(idx, 1);
  else wishlist.push(id);
  saveData();
  render();
}

function calculateBill() {
  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    var p = getProduct(cart[i].id);
    if (p) subtotal += p.price * cart[i].quantity;
  }
  var discount = (appliedCoupon === "STYLE10") ? Math.round(subtotal * 0.10) : 0;
  var taxable = subtotal - discount;
  var gst = Math.round(taxable * 0.05);
  var shipping = (taxable > 0 && taxable < 2000) ? 99 : 0;
  return { subtotal: subtotal, discount: discount, gst: gst, shipping: shipping, total: taxable + gst + shipping };
}

// 5. FORM SUBMISSIONS
function applyCoupon(event) {
  event.preventDefault();
  var input = document.getElementById("coupon-input");
  var code = input ? input.value.trim().toUpperCase() : "";
  if (code === "STYLE10") { appliedCoupon = code; couponMessage = "10% discount applied!"; }
  else if (code === "") { appliedCoupon = ""; couponMessage = "Please enter a coupon code."; }
  else { appliedCoupon = ""; couponMessage = "Invalid coupon code."; }
  render();
}

function placeOrder(event) {
  event.preventDefault();
  var fields = [
    { id: "full-name", valid: document.getElementById("full-name").value.trim() !== "", msg: "Full name is required." },
    { id: "email", valid: document.getElementById("email").value.indexOf("@") !== -1, msg: "Enter a valid email address." },
    { id: "phone", valid: document.getElementById("phone").value.trim().length === 10, msg: "Enter a 10-digit phone number." },
    { id: "address", valid: document.getElementById("address").value.trim() !== "", msg: "Address is required." },
    { id: "city", valid: document.getElementById("city").value.trim() !== "", msg: "City is required." },
    { id: "pin", valid: document.getElementById("pin").value.trim().length === 6, msg: "Enter a 6-digit PIN code." }
  ];
  var hasError = false;
  for (var i = 0; i < fields.length; i++) {
    var el = document.getElementById(fields[i].id);
    var errSpan = el.nextElementSibling;
    if (!fields[i].valid) { errSpan.innerText = fields[i].msg; hasError = true; }
    else { errSpan.innerText = ""; }
  }
  if (hasError) {
    document.getElementById("checkout-message").innerText = "Please fill in all details correctly.";
    return;
  }
  cart = [];
  appliedCoupon = "";
  goToPage("confirmation");
  saveData();
}

function handleAuth(event) {
  event.preventDefault();
  var msg = (authMode === "register") ? "Account created successfully!" : "Logged in successfully!";
  document.getElementById("auth-message").innerText = msg;
}

// 6. VIEW BUILDERS
function createProductCard(product) {
  var isWish = wishlist.indexOf(product.id) !== -1;
  return `<article class="product-card">
    <div class="product-image"><img src="${product.image}" alt="${product.name}" onclick="openProduct(${product.id})"><button class="heart" type="button" onclick="toggleWishlist(${product.id})">${isWish ? "♥" : "♡"}</button></div>
    <h3 class="product-name" onclick="openProduct(${product.id})">${product.name}</h3><p class="product-price">${formatPrice(product.price)}</p>
    <div class="product-actions"><span class="product-price">${product.color}</span><button class="button light small" type="button" onclick="addToCart(${product.id})">Add to bag</button></div>
  </article>`;
}

function renderOrderSummary(isCheckout) {
  var bill = calculateBill();
  var itemsHtml = "";
  if (isCheckout) {
    itemsHtml = '<div class="checkout-summary">';
    for (var i = 0; i < cart.length; i++) {
      var p = getProduct(cart[i].id);
      if (p) itemsHtml += `<div class="summary-row"><span>${p.name} × ${cart[i].quantity}</span><span>${formatPrice(p.price * cart[i].quantity)}</span></div>`;
    }
    itemsHtml += '</div>';
  }
  var discRow = bill.discount > 0 ? `<div class="summary-row"><span>Discount (STYLE10)</span><span>−${formatPrice(bill.discount)}</span></div>` : "";
  var couponBox = !isCheckout ? `<form class="coupon" onsubmit="applyCoupon(event)"><input id="coupon-input" name="coupon" placeholder="Coupon code" value="${appliedCoupon}"><button class="button light small" type="submit">Apply</button></form><p class="coupon-message">${couponMessage}</p>` : "";
  return `<h2>Order summary</h2>${itemsHtml}
    <div class="summary-row"><span>Subtotal</span><span>${formatPrice(bill.subtotal)}</span></div>${discRow}
    <div class="summary-row"><span>GST (5%)</span><span>${formatPrice(bill.gst)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${bill.shipping === 0 ? "Free" : formatPrice(bill.shipping)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${formatPrice(bill.total)}</span></div>${couponBox}`;
}

function renderHome() {
  var cards = "";
  for (var i = 0; i < 4; i++) cards += createProductCard(products[i]);
  return `<section class="wrap">
    <div class="hero"><div class="hero-copy"><span class="eyebrow">Welcome to our store</span><h1>Shop clothes online</h1><p>Browse our clothing collection and add your favourite items to the bag.</p><button class="button" type="button" onclick="goToPage('shop')">Shop now</button></div><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85" alt="Store hero"></div>
    <section class="home-products"><div class="section-heading"><h2>Customer favourites</h2><a href="#" onclick="goToPage('shop'); return false;">View all →</a></div><div class="product-grid">${cards}</div></section>
  </section>`;
}

function renderShop() {
  var filtered = [];
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var matchPrice = p.price <= maxPrice;
    var matchColor = (selectedColor === "" || p.color === selectedColor);
    var matchSize = (selectedFilterSize === "" || p.sizes.indexOf(selectedFilterSize) !== -1);
    if (matchPrice && matchColor && matchSize) filtered.push(p);
  }

  if (selectedSort === "low") filtered.sort(function(a, b) { return a.price - b.price; });
  else if (selectedSort === "high") filtered.sort(function(a, b) { return b.price - a.price; });
  else if (selectedSort === "newest") filtered.sort(function(a, b) { return b.newest - a.newest; });

  var sizes = ["S", "M", "L", "XL"], sizesHtml = "";
  for (var i = 0; i < sizes.length; i++) {
    sizesHtml += `<label><input type="checkbox" name="size" value="${sizes[i]}" ${selectedFilterSize === sizes[i] ? "checked" : ""} onchange="onSizeChange(this)"> ${sizes[i]}</label>`;
  }

  var colors = ["Ivory", "Olive", "Blue", "Sand", "Black"], colorsHtml = '<option value="">All colours</option>';
  for (var i = 0; i < colors.length; i++) {
    colorsHtml += `<option value="${colors[i]}" ${selectedColor === colors[i] ? "selected" : ""}>${colors[i]}</option>`;
  }

  var grid = "";
  if (filtered.length > 0) {
    for (var i = 0; i < filtered.length; i++) grid += createProductCard(filtered[i]);
  } else {
    grid = '<div class="empty-state"><h2>No matches</h2><p>Try changing your filters.</p><button class="button light" type="button" onclick="clearFilters()">Clear filters</button></div>';
  }

  return `<section class="wrap page"><h1 class="page-title">Shop all</h1><p class="page-intro">Everyday favourites, made easy to wear.</p>
    <div class="shop-layout">
      <aside class="filters" aria-label="Filters">
        <fieldset class="filter-group"><legend>Size</legend>${sizesHtml}</fieldset>
        <fieldset class="filter-group"><legend>Colour</legend><select id="color-filter" onchange="onColorChange(this.value)">${colorsHtml}</select></fieldset>
        <fieldset class="filter-group"><legend id="price-legend">Max price: ${formatPrice(maxPrice)}</legend><input id="price-filter" type="range" min="700" max="3000" step="100" value="${maxPrice}" oninput="onPriceChange(this.value)"></fieldset>
      </aside>
      <div>
        <div class="shop-toolbar"><span>${filtered.length} products</span>
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
  var product = getProduct(selectedProductId) || products[0];
  var isWish = wishlist.indexOf(product.id) !== -1;
  var sizesHtml = "";
  for (var i = 0; i < product.sizes.length; i++) {
    sizesHtml += `<button type="button" class="size-button ${selectedSize === product.sizes[i] ? "selected" : ""}" onclick="selectSize('${product.sizes[i]}')">${product.sizes[i]}</button>`;
  }
  return `<section class="wrap page"><div class="detail"><img src="${product.image}" alt="${product.name}"><div class="detail-copy">
    <span class="eyebrow">Everyday collection</span><h1>${product.name}</h1><p class="price">${formatPrice(product.price)}</p><p>${product.description}</p>
    <label class="option-label">Choose a size</label><div class="sizes">${sizesHtml}</div>
    <label class="option-label">Colour</label><select class="color-select"><option>${product.color}</option></select>
    <div class="detail-actions"><button class="button" type="button" onclick="addToCart(${product.id})">Add to bag</button><button class="button light" type="button" onclick="toggleWishlist(${product.id})">${isWish ? "♥ Saved" : "♡ Wishlist"}</button></div>
  </div></div></section>`;
}

function renderWishlist() {
  var cards = "";
  for (var i = 0; i < wishlist.length; i++) {
    var p = getProduct(wishlist[i]);
    if (p) cards += createProductCard(p);
  }
  if (cards === "") cards = '<div class="empty-state"><h2>No saved pieces yet</h2><p>Tap the heart on anything you love.</p><button class="button" type="button" onclick="goToPage(\'shop\')">Explore the shop</button></div>';
  return `<section class="wrap page"><h1 class="page-title">Your wishlist</h1><p class="page-intro">Your saved pieces, all in one place.</p><div class="product-grid">${cards}</div></section>`;
}

function renderCart() {
  if (cart.length === 0) return `<section class="wrap page"><h1 class="page-title">Your bag</h1><div class="empty-state"><h2>Your bag is empty</h2><p>Find something you'll love wearing.</p><button class="button" type="button" onclick="goToPage('shop')">Shop now</button></div></section>`;
  var items = "";
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i], p = getProduct(item.id);
    if (p) {
      items += `<article class="cart-item"><img src="${p.image}" alt="${p.name}"><div><h3>${p.name}</h3><p>Size: ${item.size} · ${p.color}</p><p>${formatPrice(p.price)}</p><div class="quantity"><button type="button" onclick="changeQty(${p.id}, '${item.size}', -1)">−</button><span>${item.quantity}</span><button type="button" onclick="changeQty(${p.id}, '${item.size}', 1)">+</button></div></div><div class="price">${formatPrice(p.price * item.quantity)}<button class="text-button remove-button" type="button" onclick="removeItem(${p.id}, '${item.size}')">Remove</button></div></article>`;
    }
  }
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
  var isReg = (authMode === "register");
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

// 7. FILTER EVENT HANDLERS & RENDER DISPATCHER
function onSizeChange(box) { selectedFilterSize = box.checked ? box.value : ""; render(); }
function onColorChange(val) { selectedColor = val; render(); }
function onSortChange(val) { selectedSort = val; render(); }
function onPriceChange(val) {
  maxPrice = Number(val);
  var el = document.getElementById("price-legend");
  if (el) el.innerText = "Max price: " + formatPrice(maxPrice);
}

function render() {
  var html = "";
  if (currentPage === "home") html = renderHome();
  else if (currentPage === "shop") html = renderShop();
  else if (currentPage === "detail") html = renderDetail();
  else if (currentPage === "wishlist") html = renderWishlist();
  else if (currentPage === "cart") html = renderCart();
  else if (currentPage === "checkout") html = renderCheckout();
  else if (currentPage === "confirmation") html = renderConfirmation();
  else if (currentPage === "auth") html = renderAuth();
  document.getElementById("app").innerHTML = html;
  updateCounts();
}

// Support for header route clicks
document.addEventListener("click", function(e) {
  var route = e.target.closest("[data-route]");
  if (route) { e.preventDefault(); goToPage(route.getAttribute("data-route")); }
  var detail = e.target.closest("[data-detail]");
  if (detail) { e.preventDefault(); openProduct(Number(detail.getAttribute("data-detail"))); }
});

// 8. START APP
loadData();
render();
