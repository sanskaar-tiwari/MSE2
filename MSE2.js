// ==========================================
// College E-Commerce Store (MSE2)
// Basic JavaScript for College Web Dev Project
// ==========================================

// --- 1. PRODUCT LIST ---
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

// --- 2. BASIC GLOBAL VARIABLES ---
let cart = [];
let wishlist = [];
let currentPage = "home";
let selectedProductId = 1;
let selectedSize = "M";
let selectedFilterSize = "";
let selectedColor = "";
let maxPrice = 3000;
let selectedSort = "featured";
let appliedCoupon = "";
let couponMessage = "";
let authMode = "login";

// Load saved data from localStorage on start
function loadData() {
  if (localStorage.getItem("tf-cart")) {
    try { cart = JSON.parse(localStorage.getItem("tf-cart")) || []; } catch(e) { cart = []; }
  }
  if (localStorage.getItem("tf-wishlist")) {
    try { wishlist = JSON.parse(localStorage.getItem("tf-wishlist")) || []; } catch(e) { wishlist = []; }
  }
}

// Save cart and wishlist to localStorage
function saveData() {
  localStorage.setItem("tf-cart", JSON.stringify(cart));
  localStorage.setItem("tf-wishlist", JSON.stringify(wishlist));
  updateCounts();
}

// --- 3. HELPER FUNCTIONS ---
function getProduct(id) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === Number(id)) return products[i];
  }
  return null;
}

function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function updateCounts() {
  let totalItems = 0;
  for (let i = 0; i < cart.length; i++) totalItems += cart[i].quantity;
  document.getElementById("cart-count").innerText = totalItems;
  document.getElementById("wish-count").innerText = wishlist.length > 0 ? "(" + wishlist.length + ")" : "";
}

function goToPage(pageName) {
  currentPage = pageName;
  render();
  window.scrollTo(0, 0);
}

function openProduct(id) {
  selectedProductId = Number(id);
  selectedSize = "M";
  goToPage("detail");
}

function selectSize(size) {
  selectedSize = size;
  render();
}

function setAuthMode(mode) {
  authMode = mode;
  render();
}

function clearFilters() {
  selectedFilterSize = "";
  selectedColor = "";
  maxPrice = 3000;
  render();
}

function showToast(message) {
  let old = document.querySelector(".toast");
  if (old) old.remove();
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 2000);
}

// --- 4. CART & WISHLIST ACTIONS ---
function addToCart(productId) {
  let product = getProduct(productId);
  if (!product) return;

  let size = product.sizes.includes(selectedSize) ? selectedSize : product.sizes[0];
  let found = false;

  for (let i = 0; i < cart.length; i++) {
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
  for (let i = 0; i < cart.length; i++) {
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
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId && cart[i].size === size) {
      cart.splice(i, 1);
      break;
    }
  }
  saveData();
  render();
}

function toggleWishlist(productId) {
  let id = Number(productId);
  let index = wishlist.indexOf(id);
  if (index !== -1) wishlist.splice(index, 1);
  else wishlist.push(id);
  saveData();
  render();
}

function calculateBill() {
  let subtotal = 0;
  for (let i = 0; i < cart.length; i++) {
    let p = getProduct(cart[i].id);
    if (p) subtotal += p.price * cart[i].quantity;
  }
  let discount = (appliedCoupon === "STYLE10") ? Math.round(subtotal * 0.10) : 0;
  let taxable = subtotal - discount;
  let gst = Math.round(taxable * 0.05);
  let shipping = (taxable === 0 || taxable >= 2000) ? 0 : 99;
  let total = taxable + gst + shipping;
  return { subtotal, discount, gst, shipping, total };
}

// --- 5. FORM SUBMISSIONS ---
function applyCoupon(event) {
  event.preventDefault();
  let input = document.getElementById("coupon-input");
  let code = input ? input.value.trim().toUpperCase() : "";

  if (code === "STYLE10") {
    appliedCoupon = code;
    couponMessage = "10% discount applied!";
  } else if (code === "") {
    appliedCoupon = "";
    couponMessage = "Please enter a coupon code.";
  } else {
    appliedCoupon = "";
    couponMessage = "Invalid coupon code.";
  }
  render();
}

function placeOrder(event) {
  event.preventDefault();

  let name = document.getElementById("full-name").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();
  let city = document.getElementById("city").value.trim();
  let pin = document.getElementById("pin").value.trim();
  let hasError = false;

  function check(id, msg) {
    let el = document.getElementById(id);
    el.nextElementSibling.innerText = msg;
    if (msg !== "") hasError = true;
  }

  check("full-name", name === "" ? "Full name is required." : "");
  check("email", !email.includes("@") ? "Enter a valid email address." : "");
  check("phone", phone.length !== 10 ? "Enter a 10-digit phone number." : "");
  check("address", address === "" ? "Address is required." : "");
  check("city", city === "" ? "City is required." : "");
  check("pin", pin.length !== 6 ? "Enter a 6-digit PIN code." : "");

  let msgBox = document.getElementById("checkout-message");
  if (hasError) {
    msgBox.innerText = "Please fill in all details correctly.";
    return;
  }

  cart = [];
  appliedCoupon = "";
  goToPage("confirmation");
  saveData();
}

function handleAuth(event) {
  event.preventDefault();
  let status = document.getElementById("auth-message");
  status.innerText = (authMode === "register") ? "Account created successfully!" : "Logged in successfully!";
}

// --- 6. HTML VIEW BUILDERS ---
function createProductCard(product) {
  let isWish = wishlist.includes(product.id);
  return `<article class="product-card">
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" onclick="openProduct(${product.id})">
      <button class="heart" type="button" onclick="toggleWishlist(${product.id})">${isWish ? "♥" : "♡"}</button>
    </div>
    <h3 class="product-name" onclick="openProduct(${product.id})">${product.name}</h3>
    <p class="product-price">${formatPrice(product.price)}</p>
    <div class="product-actions">
      <span class="product-price">${product.color}</span>
      <button class="button light small" type="button" onclick="addToCart(${product.id})">Add to bag</button>
    </div>
  </article>`;
}

function renderOrderSummary(isCheckout = false) {
  let bill = calculateBill();
  let itemsHtml = "";
  if (isCheckout) {
    itemsHtml = '<div class="checkout-summary">';
    for (let i = 0; i < cart.length; i++) {
      let p = getProduct(cart[i].id);
      if (p) itemsHtml += `<div class="summary-row"><span>${p.name} × ${cart[i].quantity}</span><span>${formatPrice(p.price * cart[i].quantity)}</span></div>`;
    }
    itemsHtml += '</div>';
  }

  let discountRow = bill.discount > 0 ? `<div class="summary-row"><span>Discount (STYLE10)</span><span>−${formatPrice(bill.discount)}</span></div>` : "";
  let couponHtml = !isCheckout ? `
    <form class="coupon" onsubmit="applyCoupon(event)">
      <input id="coupon-input" name="coupon" placeholder="Coupon code" value="${appliedCoupon}">
      <button class="button light small" type="submit">Apply</button>
    </form>
    <p class="coupon-message">${couponMessage}</p>` : "";

  return `<h2>Order summary</h2>${itemsHtml}
    <div class="summary-row"><span>Subtotal</span><span>${formatPrice(bill.subtotal)}</span></div>${discountRow}
    <div class="summary-row"><span>GST (5%)</span><span>${formatPrice(bill.gst)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${bill.shipping === 0 ? "Free" : formatPrice(bill.shipping)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${formatPrice(bill.total)}</span></div>${couponHtml}`;
}

function renderHome() {
  let cards = "";
  for (let i = 0; i < 4; i++) cards += createProductCard(products[i]);
  return `<section class="wrap">
    <div class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Welcome to our store</span>
        <h1>Shop clothes online</h1>
        <p>Browse our clothing collection and add your favourite items to the bag.</p>
        <button class="button" type="button" onclick="goToPage('shop')">Shop now</button>
      </div>
      <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85" alt="Store hero">
    </div>
    <section class="home-products">
      <div class="section-heading"><h2>Customer favourites</h2><a href="#" onclick="goToPage('shop'); return false;">View all →</a></div>
      <div class="product-grid">${cards}</div>
    </section>
  </section>`;
}

function renderShop() {
  let filtered = [];
  for (let i = 0; i < products.length; i++) {
    let p = products[i];
    let matchPrice = p.price <= maxPrice;
    let matchColor = (selectedColor === "" || p.color === selectedColor);
    let matchSize = (selectedFilterSize === "" || p.sizes.includes(selectedFilterSize));
    if (matchPrice && matchColor && matchSize) filtered.push(p);
  }

  if (selectedSort === "low") filtered.sort((a, b) => a.price - b.price);
  else if (selectedSort === "high") filtered.sort((a, b) => b.price - a.price);
  else if (selectedSort === "newest") filtered.sort((a, b) => b.newest - a.newest);

  let sizes = ["S", "M", "L", "XL"], colors = ["Ivory", "Olive", "Blue", "Sand", "Black"];
  let sizesHtml = "", colorsHtml = '<option value="">All colours</option>', productsHtml = "";

  for (let i = 0; i < sizes.length; i++) sizesHtml += `<label><input type="checkbox" name="size" value="${sizes[i]}" ${selectedFilterSize === sizes[i] ? "checked" : ""} onchange="onSizeChange(this)"> ${sizes[i]}</label>`;
  for (let i = 0; i < colors.length; i++) colorsHtml += `<option value="${colors[i]}" ${selectedColor === colors[i] ? "selected" : ""}>${colors[i]}</option>`;

  if (filtered.length > 0) {
    for (let i = 0; i < filtered.length; i++) productsHtml += createProductCard(filtered[i]);
  } else {
    productsHtml = '<div class="empty-state"><h2>No matches</h2><p>Try changing your filters.</p><button class="button light" type="button" onclick="clearFilters()">Clear filters</button></div>';
  }

  return `<section class="wrap page"><h1 class="page-title">Shop all</h1><p class="page-intro">Everyday favourites, made easy to wear.</p>
    <div class="shop-layout">
      <aside class="filters" aria-label="Filters">
        <fieldset class="filter-group"><legend>Size</legend>${sizesHtml}</fieldset>
        <fieldset class="filter-group"><legend>Colour</legend><select id="color-filter" onchange="onColorChange(this.value)">${colorsHtml}</select></fieldset>
        <fieldset class="filter-group"><legend id="price-legend">Max price: ${formatPrice(maxPrice)}</legend>
          <input id="price-filter" type="range" min="700" max="3000" step="100" value="${maxPrice}" oninput="onPriceChange(this.value)">
        </fieldset>
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
        <div class="product-grid">${productsHtml}</div>
      </div>
    </div>
  </section>`;
}

function renderDetail() {
  let product = getProduct(selectedProductId) || products[0];
  let isWish = wishlist.includes(product.id);
  let sizesHtml = "";
  for (let i = 0; i < product.sizes.length; i++) {
    sizesHtml += `<button type="button" class="size-button ${selectedSize === product.sizes[i] ? "selected" : ""}" onclick="selectSize('${product.sizes[i]}')">${product.sizes[i]}</button>`;
  }

  return `<section class="wrap page"><div class="detail"><img src="${product.image}" alt="${product.name}"><div class="detail-copy">
    <span class="eyebrow">Everyday collection</span><h1>${product.name}</h1><p class="price">${formatPrice(product.price)}</p><p>${product.description}</p>
    <label class="option-label">Choose a size</label><div class="sizes">${sizesHtml}</div>
    <label class="option-label">Colour</label><select class="color-select"><option>${product.color}</option></select>
    <div class="detail-actions">
      <button class="button" type="button" onclick="addToCart(${product.id})">Add to bag</button>
      <button class="button light" type="button" onclick="toggleWishlist(${product.id})">${isWish ? "♥ Saved" : "♡ Wishlist"}</button>
    </div>
  </div></div></section>`;
}

function renderWishlist() {
  let cards = "";
  for (let i = 0; i < wishlist.length; i++) {
    let p = getProduct(wishlist[i]);
    if (p) cards += createProductCard(p);
  }
  if (!cards) cards = '<div class="empty-state"><h2>No saved pieces yet</h2><p>Tap the heart on anything you love.</p><button class="button" type="button" onclick="goToPage(\'shop\')">Explore the shop</button></div>';
  return `<section class="wrap page"><h1 class="page-title">Your wishlist</h1><p class="page-intro">Your saved pieces, all in one place.</p><div class="product-grid">${cards}</div></section>`;
}

function renderCart() {
  if (cart.length === 0) {
    return `<section class="wrap page"><h1 class="page-title">Your bag</h1><div class="empty-state"><h2>Your bag is empty</h2><p>Find something you'll love wearing.</p><button class="button" type="button" onclick="goToPage('shop')">Shop now</button></div></section>`;
  }
  let itemsHtml = "";
  for (let i = 0; i < cart.length; i++) {
    let item = cart[i], p = getProduct(item.id);
    if (p) {
      itemsHtml += `<article class="cart-item"><img src="${p.image}" alt="${p.name}"><div>
        <h3>${p.name}</h3><p>Size: ${item.size} · ${p.color}</p><p>${formatPrice(p.price)}</p>
        <div class="quantity">
          <button type="button" onclick="changeQty(${p.id}, '${item.size}', -1)">−</button>
          <span>${item.quantity}</span>
          <button type="button" onclick="changeQty(${p.id}, '${item.size}', 1)">+</button>
        </div>
      </div><div class="price">${formatPrice(p.price * item.quantity)}<button class="text-button remove-button" type="button" onclick="removeItem(${p.id}, '${item.size}')">Remove</button></div></article>`;
    }
  }
  return `<section class="wrap page"><h1 class="page-title">Your bag</h1><p class="page-intro">Review your picks before checkout.</p>
    <div class="cart-layout"><div class="cart-list">${itemsHtml}</div><aside class="summary">${renderOrderSummary(false)}<button class="button" type="button" onclick="goToPage('checkout')">Continue to checkout</button></aside></div>
  </section>`;
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
    </div>
  </section>`;
}

function renderAuth() {
  let isRegister = (authMode === "register");
  return `<section class="wrap page"><div class="form-card auth-card"><h1 class="page-title">${isRegister ? "Create an account" : "Welcome back"}</h1><p class="page-intro">${isRegister ? "Join us for easy everyday shopping." : "Sign in to your account."}</p>
    <div class="auth-tabs"><button type="button" class="${!isRegister ? "active" : ""}" onclick="setAuthMode('login')">Login</button><button type="button" class="${isRegister ? "active" : ""}" onclick="setAuthMode('register')">Register</button></div>
    <form id="auth-form" onsubmit="handleAuth(event)">
      ${isRegister ? '<div class="field"><label>Name</label><input id="auth-name" required></div>' : ''}
      <div class="field"><label>Email</label><input id="auth-email" type="email" required></div>
      <div class="field"><label>Password</label><input id="auth-password" type="password" minlength="6" required></div>
      <p class="form-message" id="auth-message"></p><button class="button" type="submit">${isRegister ? "Create account" : "Login"}</button>
    </form>
  </div></section>`;
}

function renderConfirmation() {
  return `<section class="wrap page"><div class="empty-state"><span class="eyebrow">Thank you</span><h2>Order confirmed</h2><p>Your order has been placed successfully.</p><button class="button" type="button" onclick="goToPage('shop')">Continue shopping</button></div></section>`;
}

// Filter change functions
function onSizeChange(checkbox) { selectedFilterSize = checkbox.checked ? checkbox.value : ""; render(); }
function onColorChange(val) { selectedColor = val; render(); }
function onSortChange(val) { selectedSort = val; render(); }
function onPriceChange(val) {
  maxPrice = Number(val);
  let legend = document.getElementById("price-legend");
  if (legend) legend.innerText = "Max price: " + formatPrice(maxPrice);
}

// --- 7. MAIN RENDER FUNCTION ---
function render() {
  let html = "";
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

// Support header menu clicks
document.addEventListener("click", function(event) {
  let link = event.target.closest("[data-route]");
  if (link) {
    event.preventDefault();
    goToPage(link.getAttribute("data-route"));
  }
  let detailLink = event.target.closest("[data-detail]");
  if (detailLink) {
    event.preventDefault();
    openProduct(Number(detailLink.getAttribute("data-detail")));
  }
});

// --- 8. START THE APP ---
loadData();
render();
