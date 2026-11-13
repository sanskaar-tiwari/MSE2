// ==========================================
// College E-Commerce Store - JavaScript (MSE2)
// ==========================================

// 1. PRODUCT LIST
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

// 2. BASIC GLOBAL VARIABLES
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

// Load saved data from browser storage
if (localStorage.getItem("tf-cart")) {
  try { cart = JSON.parse(localStorage.getItem("tf-cart")) || []; } catch(e) { cart = []; }
}
if (localStorage.getItem("tf-wishlist")) {
  try { wishlist = JSON.parse(localStorage.getItem("tf-wishlist")) || []; } catch(e) { wishlist = []; }
}

// 3. HELPER FUNCTIONS
function getProduct(id) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === Number(id)) return products[i];
  }
  return null;
}

function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function saveState() {
  localStorage.setItem("tf-cart", JSON.stringify(cart));
  localStorage.setItem("tf-wishlist", JSON.stringify(wishlist));
  updateCounts();
}

function updateCounts() {
  let total = 0;
  for (let i = 0; i < cart.length; i++) total += cart[i].quantity;
  document.getElementById("cart-count").innerText = total;
  document.getElementById("wish-count").innerText = wishlist.length > 0 ? "(" + wishlist.length + ")" : "";
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
  saveState();
  showToast(product.name + " added to bag");
}

function toggleWishlist(productId) {
  let id = Number(productId);
  let index = wishlist.indexOf(id);
  if (index !== -1) wishlist.splice(index, 1);
  else wishlist.push(id);
  saveState();
  render();
}

function calculateTotals() {
  let subtotal = 0;
  for (let i = 0; i < cart.length; i++) {
    let p = getProduct(cart[i].id);
    if (p) subtotal += p.price * cart[i].quantity;
  }
  let discount = appliedCoupon === "STYLE10" ? Math.round(subtotal * 0.10) : 0;
  let taxable = subtotal - discount;
  let gst = Math.round(taxable * 0.05);
  let shipping = (taxable === 0 || taxable >= 2000) ? 0 : 99;
  let total = taxable + gst + shipping;
  return { subtotal, discount, gst, shipping, total };
}

// 4. HTML BUILDERS
function createProductCard(product) {
  let isWish = wishlist.includes(product.id);
  return `<article class="product-card">
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy" data-detail="${product.id}">
      <button class="heart" type="button" aria-label="Wishlist" data-wish="${product.id}">${isWish ? "♥" : "♡"}</button>
    </div>
    <h3 class="product-name" data-detail="${product.id}">${product.name}</h3>
    <p class="product-price">${formatPrice(product.price)}</p>
    <div class="product-actions"><span class="product-price">${product.color}</span><button class="button light small" type="button" data-add="${product.id}">Add to bag</button></div>
  </article>`;
}

function renderOrderSummary(isCheckout = false) {
  let bill = calculateTotals();
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
  let couponForm = !isCheckout ? `<form class="coupon" id="coupon-form"><input name="coupon" placeholder="Coupon code" value="${appliedCoupon}"><button class="button light small" type="submit">Apply</button></form><p class="coupon-message">${couponMessage}</p>` : "";

  return `<h2>Order summary</h2>${itemsHtml}
    <div class="summary-row"><span>Subtotal</span><span>${formatPrice(bill.subtotal)}</span></div>${discountRow}
    <div class="summary-row"><span>GST (5%)</span><span>${formatPrice(bill.gst)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${bill.shipping === 0 ? "Free" : formatPrice(bill.shipping)}</span></div>
    <div class="summary-row total"><span>Total</span><span>${formatPrice(bill.total)}</span></div>${couponForm}`;
}

// 5. PAGE VIEWS
function renderHome() {
  let cards = "";
  for (let i = 0; i < 4; i++) cards += createProductCard(products[i]);
  return `<section class="wrap">
    <div class="hero">
      <div class="hero-copy"><span class="eyebrow">Welcome to our store</span><h1>Shop clothes online</h1><p>Browse our clothing collection and add your favourite items to the bag.</p><button class="button" type="button" data-route="shop">Shop now</button></div>
      <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85" alt="Store hero">
    </div>
    <section class="home-products"><div class="section-heading"><h2>Customer favourites</h2><a href="#" data-route="shop">View all →</a></div><div class="product-grid">${cards}</div></section>
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

  for (let i = 0; i < sizes.length; i++) sizesHtml += `<label><input type="checkbox" name="size" value="${sizes[i]}" ${selectedFilterSize === sizes[i] ? "checked" : ""}> ${sizes[i]}</label>`;
  for (let i = 0; i < colors.length; i++) colorsHtml += `<option value="${colors[i]}" ${selectedColor === colors[i] ? "selected" : ""}>${colors[i]}</option>`;

  if (filtered.length > 0) {
    for (let i = 0; i < filtered.length; i++) productsHtml += createProductCard(filtered[i]);
  } else {
    productsHtml = '<div class="empty-state"><h2>No matches</h2><p>Try changing your filters.</p><button class="button light" data-reset-filters type="button">Clear filters</button></div>';
  }

  return `<section class="wrap page"><h1 class="page-title">Shop all</h1><p class="page-intro">Everyday favourites, made easy to wear.</p>
    <div class="shop-layout">
      <aside class="filters" aria-label="Filters">
        <fieldset class="filter-group"><legend>Size</legend>${sizesHtml}</fieldset>
        <fieldset class="filter-group"><legend>Colour</legend><select id="color-filter">${colorsHtml}</select></fieldset>
        <fieldset class="filter-group"><legend>Max price: ${formatPrice(maxPrice)}</legend><input id="price-filter" type="range" min="700" max="3000" step="100" value="${maxPrice}"></fieldset>
      </aside>
      <div>
        <div class="shop-toolbar"><span>${filtered.length} products</span>
          <select class="sort-select" id="sort-filter">
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
  for (let i = 0; i < product.sizes.length; i++) sizesHtml += `<button type="button" class="size-button ${selectedSize === product.sizes[i] ? "selected" : ""}" data-size="${product.sizes[i]}">${product.sizes[i]}</button>`;

  return `<section class="wrap page"><div class="detail"><img src="${product.image}" alt="${product.name}"><div class="detail-copy">
    <span class="eyebrow">Everyday collection</span><h1>${product.name}</h1><p class="price">${formatPrice(product.price)}</p><p>${product.description}</p>
    <label class="option-label">Choose a size</label><div class="sizes">${sizesHtml}</div>
    <label class="option-label">Colour</label><select class="color-select" id="detail-color"><option>${product.color}</option></select>
    <div class="detail-actions"><button class="button" type="button" data-add="${product.id}">Add to bag</button><button class="button light" type="button" data-wish="${product.id}">${isWish ? "♥ Saved" : "♡ Wishlist"}</button></div>
  </div></div></section>`;
}

function renderWishlist() {
  let cards = "";
  for (let i = 0; i < wishlist.length; i++) {
    let p = getProduct(wishlist[i]);
    if (p) cards += createProductCard(p);
  }
  if (!cards) cards = '<div class="empty-state"><h2>No saved pieces yet</h2><p>Tap the heart on anything you love.</p><button class="button" type="button" data-route="shop">Explore the shop</button></div>';
  return `<section class="wrap page"><h1 class="page-title">Your wishlist</h1><p class="page-intro">Your saved pieces, all in one place.</p><div class="product-grid">${cards}</div></section>`;
}

function renderCart() {
  if (cart.length === 0) return `<section class="wrap page"><h1 class="page-title">Your bag</h1><div class="empty-state"><h2>Your bag is empty</h2><p>Find something you'll love wearing.</p><button class="button" type="button" data-route="shop">Shop now</button></div></section>`;
  let items = "";
  for (let i = 0; i < cart.length; i++) {
    let item = cart[i], p = getProduct(item.id);
    if (p) items += `<article class="cart-item"><img src="${p.image}" alt="${p.name}"><div><h3>${p.name}</h3><p>Size: ${item.size} · ${p.color}</p><p>${formatPrice(p.price)}</p>
      <div class="quantity"><button type="button" data-quantity="${p.id}" data-size="${item.size}" data-change="-1">−</button><span>${item.quantity}</span><button type="button" data-quantity="${p.id}" data-size="${item.size}" data-change="1">+</button></div>
    </div><div class="price">${formatPrice(p.price * item.quantity)}<button class="text-button remove-button" type="button" data-remove="${p.id}" data-size="${item.size}">Remove</button></div></article>`;
  }
  return `<section class="wrap page"><h1 class="page-title">Your bag</h1><p class="page-intro">Review your picks before checkout.</p>
    <div class="cart-layout"><div class="cart-list">${items}</div><aside class="summary">${renderOrderSummary(false)}<button class="button" type="button" data-route="checkout">Continue to checkout</button></aside></div>
  </section>`;
}

function renderCheckout() {
  if (cart.length === 0) return `<section class="wrap page"><h1 class="page-title">Checkout</h1><div class="empty-state"><h2>Your bag is empty</h2><button class="button" data-route="shop" type="button">Shop now</button></div></section>`;
  return `<section class="wrap page"><h1 class="page-title">Checkout</h1><p class="page-intro">Add your details to place your order.</p>
    <div class="checkout-layout">
      <form class="form-card" id="checkout-form" novalidate><h2>Delivery details</h2>
        <div class="form-grid">
          <div class="field full"><label>Full name</label><input id="full-name" name="name" required><span class="form-error"></span></div>
          <div class="field"><label>Email</label><input id="email" name="email" type="email" required><span class="form-error"></span></div>
          <div class="field"><label>Phone</label><input id="phone" name="phone" type="tel" maxlength="10" required><span class="form-error"></span></div>
          <div class="field full"><label>Address</label><input id="address" name="address" required><span class="form-error"></span></div>
          <div class="field"><label>City</label><input id="city" name="city" required><span class="form-error"></span></div>
          <div class="field"><label>PIN code</label><input id="pin" name="pin" maxlength="6" required><span class="form-error"></span></div>
        </div><p class="form-message" id="checkout-message"></p><button class="button" type="submit">Place order</button>
      </form><aside class="summary">${renderOrderSummary(true)}</aside>
    </div>
  </section>`;
}

function renderAuth() {
  let isRegister = (authMode === "register");
  return `<section class="wrap page"><div class="form-card auth-card"><h1 class="page-title">${isRegister ? "Create an account" : "Welcome back"}</h1><p class="page-intro">${isRegister ? "Join us for easy everyday shopping." : "Sign in to your account."}</p>
    <div class="auth-tabs"><button type="button" data-auth-mode="login" class="${!isRegister ? "active" : ""}">Login</button><button type="button" data-auth-mode="register" class="${isRegister ? "active" : ""}">Register</button></div>
    <form id="auth-form">${isRegister ? '<div class="field"><label>Name</label><input id="auth-name" name="name" required></div>' : ''}
      <div class="field"><label>Email</label><input id="auth-email" name="email" type="email" required></div>
      <div class="field"><label>Password</label><input id="auth-password" name="password" type="password" minlength="6" required></div>
      <p class="form-message" id="auth-message"></p><button class="button" type="submit">${isRegister ? "Create account" : "Login"}</button>
    </form>
  </div></section>`;
}

function renderConfirmation() {
  return `<section class="wrap page"><div class="empty-state"><span class="eyebrow">Thank you</span><h2>Order confirmed</h2><p>Your order has been placed successfully.</p><button class="button" type="button" data-route="shop">Continue shopping</button></div></section>`;
}

function render() {
  let content = "";
  if (currentPage === "home") content = renderHome();
  else if (currentPage === "shop") content = renderShop();
  else if (currentPage === "detail") content = renderDetail();
  else if (currentPage === "wishlist") content = renderWishlist();
  else if (currentPage === "cart") content = renderCart();
  else if (currentPage === "checkout") content = renderCheckout();
  else if (currentPage === "confirmation") content = renderConfirmation();
  else if (currentPage === "auth") content = renderAuth();

  document.getElementById("app").innerHTML = content;
  updateCounts();
}

// 6. EVENT LISTENERS
document.addEventListener("click", function(event) {
  let target = event.target.closest("[data-route], [data-detail], [data-wish], [data-add], [data-size], [data-quantity], [data-remove], [data-reset-filters], [data-auth-mode]");
  if (!target) return;
  event.preventDefault();

  if (target.dataset.route) { currentPage = target.dataset.route; render(); window.scrollTo(0, 0); }
  else if (target.dataset.detail) { selectedProductId = Number(target.dataset.detail); selectedSize = "M"; currentPage = "detail"; render(); window.scrollTo(0, 0); }
  else if (target.dataset.wish) { toggleWishlist(target.dataset.wish); }
  else if (target.dataset.add) { addToCart(target.dataset.add); }
  else if (target.dataset.size) { selectedSize = target.dataset.size; render(); }
  else if (target.dataset.quantity) {
    let id = Number(target.dataset.quantity), size = target.dataset.size, change = Number(target.dataset.change);
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id && cart[i].size === size) {
        cart[i].quantity += change;
        if (cart[i].quantity < 1) cart[i].quantity = 1;
        break;
      }
    }
    saveState(); render();
  }
  else if (target.dataset.remove) {
    let id = Number(target.dataset.remove), size = target.dataset.size;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id && cart[i].size === size) { cart.splice(i, 1); break; }
    }
    saveState(); render();
  }
  else if (target.hasAttribute("data-reset-filters")) { selectedFilterSize = ""; selectedColor = ""; maxPrice = 3000; render(); }
  else if (target.dataset.authMode) { authMode = target.dataset.authMode; render(); }
});

document.addEventListener("change", function(event) {
  if (event.target.name === "size") { selectedFilterSize = event.target.checked ? event.target.value : ""; render(); }
  if (event.target.id === "color-filter") { selectedColor = event.target.value; render(); }
  if (event.target.id === "price-filter") { maxPrice = Number(event.target.value); render(); }
  if (event.target.id === "sort-filter") { selectedSort = event.target.value; render(); }
});

document.addEventListener("input", function(event) {
  if (event.target.id === "price-filter") {
    maxPrice = Number(event.target.value);
    let legend = event.target.closest(".filter-group").querySelector("legend");
    legend.innerText = "Max price: " + formatPrice(maxPrice);
  }
  if (event.target.id === "phone") event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
  if (event.target.id === "pin") event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
});

document.addEventListener("submit", function(event) {
  if (event.target.id === "coupon-form") {
    event.preventDefault();
    let input = event.target.querySelector("input[name='coupon']");
    let code = (input.value || "").trim().toUpperCase();
    if (code === "STYLE10") { appliedCoupon = code; couponMessage = "10% discount applied!"; }
    else if (code === "") { appliedCoupon = ""; couponMessage = "Please enter a coupon code."; }
    else { appliedCoupon = ""; couponMessage = "Invalid coupon code."; }
    render();
  }

  if (event.target.id === "checkout-form") {
    event.preventDefault();
    let form = event.target, inputs = form.querySelectorAll("input"), isValid = true;

    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i], val = input.value.trim(), error = "";
      if (val === "") error = "This field is required.";
      else if (input.name === "email" && !val.includes("@")) error = "Enter a valid email.";
      else if (input.name === "phone" && val.length !== 10) error = "Enter a 10-digit phone number.";
      else if (input.name === "pin" && val.length !== 6) error = "Enter a 6-digit PIN code.";
      input.nextElementSibling.innerText = error;
      if (error !== "") isValid = false;
    }

    let messageBox = document.getElementById("checkout-message");
    if (!isValid) { messageBox.innerText = "Please fill in all details correctly."; return; }

    cart = [];
    appliedCoupon = "";
    currentPage = "confirmation";
    saveState();
    render();
  }

  if (event.target.id === "auth-form") {
    event.preventDefault();
    let status = document.getElementById("auth-message");
    status.innerText = authMode === "register" ? "Account created successfully!" : "Logged in successfully!";
  }
});

// 7. INITIALIZE
render();
