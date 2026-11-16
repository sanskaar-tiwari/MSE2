// ==========================================
// College E-Commerce Project (MSE2)
// Basic JavaScript for Web Development Practical
// ==========================================

// --- 1. PRODUCT LIST (Array of Objects) ---
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

// --- 2. GLOBAL VARIABLES ---
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

// --- 3. LOCAL STORAGE FUNCTIONS ---
// Function to load saved cart and wishlist from browser memory
function loadData() {
  var savedCart = localStorage.getItem("tf-cart");
  if (savedCart) {
    try { cart = JSON.parse(savedCart); } catch (e) { cart = []; }
  }
  var savedWishlist = localStorage.getItem("tf-wishlist");
  if (savedWishlist) {
    try { wishlist = JSON.parse(savedWishlist); } catch (e) { wishlist = []; }
  }
}

// Function to save cart and wishlist to browser memory
function saveData() {
  localStorage.setItem("tf-cart", JSON.stringify(cart));
  localStorage.setItem("tf-wishlist", JSON.stringify(wishlist));
  updateCounts();
}

// --- 4. BASIC HELPER FUNCTIONS ---
// Function to find a product by ID using a standard for loop
function getProduct(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === Number(id)) {
      return products[i];
    }
  }
  return null;
}

// Function to format amount as Indian Rupees
function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

// Function to update cart and wishlist counters in header
function updateCounts() {
  var totalItems = 0;
  for (var i = 0; i < cart.length; i++) {
    totalItems = totalItems + cart[i].quantity;
  }
  document.getElementById("cart-count").innerText = totalItems;
  if (wishlist.length > 0) {
    document.getElementById("wish-count").innerText = "(" + wishlist.length + ")";
  } else {
    document.getElementById("wish-count").innerText = "";
  }
}

// Function to change page view
function goToPage(pageName) {
  currentPage = pageName;
  render();
  window.scrollTo(0, 0);
}

// Function to open product details
function openProduct(id) {
  selectedProductId = Number(id);
  selectedSize = "M";
  goToPage("detail");
}

// Function to select size in product detail view
function selectSize(size) {
  selectedSize = size;
  render();
}

// Function to toggle between login and register
function setAuthMode(mode) {
  authMode = mode;
  render();
}

// Function to reset shop filters
function clearFilters() {
  selectedFilterSize = "";
  selectedColor = "";
  maxPrice = 3000;
  render();
}

// Function to show a temporary alert toast
function showToast(message) {
  var oldToast = document.querySelector(".toast");
  if (oldToast) {
    oldToast.remove();
  }
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.remove();
  }, 2000);
}

// --- 5. CART & WISHLIST ACTIONS ---
// Function to add product to cart
function addToCart(productId) {
  var product = getProduct(productId);
  if (!product) return;

  var size = selectedSize;
  var sizeFound = false;
  for (var i = 0; i < product.sizes.length; i++) {
    if (product.sizes[i] === selectedSize) {
      sizeFound = true;
      break;
    }
  }
  if (!sizeFound) {
    size = product.sizes[0];
  }

  // Check if item with this size is already in cart
  var itemExists = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id && cart[i].size === size) {
      cart[i].quantity = cart[i].quantity + 1;
      itemExists = true;
      break;
    }
  }

  if (!itemExists) {
    cart.push({ id: product.id, size: size, quantity: 1 });
  }

  saveData();
  showToast(product.name + " added to bag");
}

// Function to increase or decrease quantity
function changeQty(productId, size, change) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId && cart[i].size === size) {
      cart[i].quantity = cart[i].quantity + change;
      if (cart[i].quantity < 1) {
        cart[i].quantity = 1;
      }
      break;
    }
  }
  saveData();
  render();
}

// Function to remove an item from the cart
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

// Function to add or remove product from wishlist
function toggleWishlist(productId) {
  var id = Number(productId);
  var foundIndex = -1;
  for (var i = 0; i < wishlist.length; i++) {
    if (wishlist[i] === id) {
      foundIndex = i;
      break;
    }
  }

  if (foundIndex !== -1) {
    wishlist.splice(foundIndex, 1);
  } else {
    wishlist.push(id);
  }

  saveData();
  render();
}

// Function to calculate bill values (subtotal, discount, GST, shipping, total)
function calculateBill() {
  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    var p = getProduct(cart[i].id);
    if (p) {
      subtotal = subtotal + (p.price * cart[i].quantity);
    }
  }

  var discount = 0;
  if (appliedCoupon === "STYLE10") {
    discount = Math.round(subtotal * 0.10);
  }

  var taxable = subtotal - discount;
  var gst = Math.round(taxable * 0.05);

  var shipping = 0;
  if (taxable > 0 && taxable < 2000) {
    shipping = 99;
  }

  var total = taxable + gst + shipping;

  return {
    subtotal: subtotal,
    discount: discount,
    gst: gst,
    shipping: shipping,
    total: total
  };
}

// --- 6. FORM HANDLERS ---
// Function to apply discount coupon
function applyCoupon(event) {
  event.preventDefault();
  var input = document.getElementById("coupon-input");
  var code = "";
  if (input) {
    code = input.value.trim().toUpperCase();
  }

  if (code === "STYLE10") {
    appliedCoupon = "STYLE10";
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

// Function to validate delivery form and complete order
function placeOrder(event) {
  event.preventDefault();

  var name = document.getElementById("full-name").value.trim();
  var email = document.getElementById("email").value.trim();
  var phone = document.getElementById("phone").value.trim();
  var address = document.getElementById("address").value.trim();
  var city = document.getElementById("city").value.trim();
  var pin = document.getElementById("pin").value.trim();

  var hasError = false;

  // Validation checks
  var nameErr = document.getElementById("full-name").nextElementSibling;
  if (name === "") { nameErr.innerText = "Full name is required."; hasError = true; } else { nameErr.innerText = ""; }

  var emailErr = document.getElementById("email").nextElementSibling;
  if (email.indexOf("@") === -1) { emailErr.innerText = "Enter a valid email address."; hasError = true; } else { emailErr.innerText = ""; }

  var phoneErr = document.getElementById("phone").nextElementSibling;
  if (phone.length !== 10) { phoneErr.innerText = "Enter a 10-digit phone number."; hasError = true; } else { phoneErr.innerText = ""; }

  var addrErr = document.getElementById("address").nextElementSibling;
  if (address === "") { addrErr.innerText = "Address is required."; hasError = true; } else { addrErr.innerText = ""; }

  var cityErr = document.getElementById("city").nextElementSibling;
  if (city === "") { cityErr.innerText = "City is required."; hasError = true; } else { cityErr.innerText = ""; }

  var pinErr = document.getElementById("pin").nextElementSibling;
  if (pin.length !== 6) { pinErr.innerText = "Enter a 6-digit PIN code."; hasError = true; } else { pinErr.innerText = ""; }

  var msgBox = document.getElementById("checkout-message");
  if (hasError) {
    msgBox.innerText = "Please fill in all details correctly.";
    return;
  }

  cart = [];
  appliedCoupon = "";
  goToPage("confirmation");
  saveData();
}

// Function to handle login / register
function handleAuth(event) {
  event.preventDefault();
  var msg = document.getElementById("auth-message");
  if (authMode === "register") {
    msg.innerText = "Account created successfully!";
  } else {
    msg.innerText = "Logged in successfully!";
  }
}

// --- 7. HTML VIEW BUILDERS ---
// Function to create HTML for a single product card
function createProductCard(product) {
  var isWish = false;
  for (var i = 0; i < wishlist.length; i++) {
    if (wishlist[i] === product.id) {
      isWish = true;
      break;
    }
  }

  var heartIcon = isWish ? "♥" : "♡";

  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" onclick="openProduct(${product.id})">
        <button class="heart" type="button" onclick="toggleWishlist(${product.id})">${heartIcon}</button>
      </div>
      <h3 class="product-name" onclick="openProduct(${product.id})">${product.name}</h3>
      <p class="product-price">${formatPrice(product.price)}</p>
      <div class="product-actions">
        <span class="product-price">${product.color}</span>
        <button class="button light small" type="button" onclick="addToCart(${product.id})">Add to bag</button>
      </div>
    </article>
  `;
}

// Function to render order summary box
function renderOrderSummary(isCheckout) {
  var bill = calculateBill();

  var itemsHtml = "";
  if (isCheckout) {
    itemsHtml = '<div class="checkout-summary">';
    for (var i = 0; i < cart.length; i++) {
      var p = getProduct(cart[i].id);
      if (p) {
        itemsHtml += `<div class="summary-row"><span>${p.name} × ${cart[i].quantity}</span><span>${formatPrice(p.price * cart[i].quantity)}</span></div>`;
      }
    }
    itemsHtml += '</div>';
  }

  var discountRow = "";
  if (bill.discount > 0) {
    discountRow = `<div class="summary-row"><span>Discount (STYLE10)</span><span>−${formatPrice(bill.discount)}</span></div>`;
  }

  var couponHtml = "";
  if (!isCheckout) {
    couponHtml = `
      <form class="coupon" onsubmit="applyCoupon(event)">
        <input id="coupon-input" name="coupon" placeholder="Coupon code" value="${appliedCoupon}">
        <button class="button light small" type="submit">Apply</button>
      </form>
      <p class="coupon-message">${couponMessage}</p>
    `;
  }

  var shippingText = bill.shipping === 0 ? "Free" : formatPrice(bill.shipping);

  return `
    <h2>Order summary</h2>
    ${itemsHtml}
    <div class="summary-row"><span>Subtotal</span><span>${formatPrice(bill.subtotal)}</span></div>
    ${discountRow}
    <div class="summary-row"><span>GST (5%)</span><span>${formatPrice(bill.gst)}</span></div>
    <div class="summary-row"><span>Shipping</span><span>${shippingText}</span></div>
    <div class="summary-row total"><span>Total</span><span>${formatPrice(bill.total)}</span></div>
    ${couponHtml}
  `;
}

// Function to render Home page
function renderHome() {
  var cardsHtml = "";
  for (var i = 0; i < 4 && i < products.length; i++) {
    cardsHtml += createProductCard(products[i]);
  }

  return `
    <section class="wrap">
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
        <div class="section-heading">
          <h2>Customer favourites</h2>
          <a href="#" onclick="goToPage('shop'); return false;">View all →</a>
        </div>
        <div class="product-grid">${cardsHtml}</div>
      </section>
    </section>
  `;
}

// Function to render Shop page
function renderShop() {
  // Filter products by price, color, and size
  var filtered = [];
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var matchPrice = p.price <= maxPrice;
    var matchColor = (selectedColor === "" || p.color === selectedColor);

    var matchSize = true;
    if (selectedFilterSize !== "") {
      matchSize = false;
      for (var s = 0; s < p.sizes.length; s++) {
        if (p.sizes[s] === selectedFilterSize) {
          matchSize = true;
          break;
        }
      }
    }

    if (matchPrice && matchColor && matchSize) {
      filtered.push(p);
    }
  }

  // Sort products
  if (selectedSort === "low") {
    filtered.sort(function(a, b) { return a.price - b.price; });
  } else if (selectedSort === "high") {
    filtered.sort(function(a, b) { return b.price - a.price; });
  } else if (selectedSort === "newest") {
    filtered.sort(function(a, b) { return b.newest - a.newest; });
  }

  // Size checkboxes HTML
  var sizes = ["S", "M", "L", "XL"];
  var sizesHtml = "";
  for (var i = 0; i < sizes.length; i++) {
    var isChecked = selectedFilterSize === sizes[i] ? "checked" : "";
    sizesHtml += `<label><input type="checkbox" name="size" value="${sizes[i]}" ${isChecked} onchange="onSizeChange(this)"> ${sizes[i]}</label>`;
  }

  // Color dropdown options HTML
  var colors = ["Ivory", "Olive", "Blue", "Sand", "Black"];
  var colorsHtml = '<option value="">All colours</option>';
  for (var i = 0; i < colors.length; i++) {
    var isSelected = selectedColor === colors[i] ? "selected" : "";
    colorsHtml += `<option value="${colors[i]}" ${isSelected}>${colors[i]}</option>`;
  }

  // Product cards grid HTML
  var productsHtml = "";
  if (filtered.length > 0) {
    for (var i = 0; i < filtered.length; i++) {
      productsHtml += createProductCard(filtered[i]);
    }
  } else {
    productsHtml = `
      <div class="empty-state">
        <h2>No matches</h2>
        <p>Try changing your filters.</p>
        <button class="button light" type="button" onclick="clearFilters()">Clear filters</button>
      </div>
    `;
  }

  return `
    <section class="wrap page">
      <h1 class="page-title">Shop all</h1>
      <p class="page-intro">Everyday favourites, made easy to wear.</p>
      <div class="shop-layout">
        <aside class="filters" aria-label="Filters">
          <fieldset class="filter-group"><legend>Size</legend>${sizesHtml}</fieldset>
          <fieldset class="filter-group"><legend>Colour</legend><select id="color-filter" onchange="onColorChange(this.value)">${colorsHtml}</select></fieldset>
          <fieldset class="filter-group"><legend id="price-legend">Max price: ${formatPrice(maxPrice)}</legend><input id="price-filter" type="range" min="700" max="3000" step="100" value="${maxPrice}" oninput="onPriceChange(this.value)"></fieldset>
        </aside>
        <div>
          <div class="shop-toolbar">
            <span>${filtered.length} products</span>
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
    </section>
  `;
}

// Function to render Product Details page
function renderDetail() {
  var product = getProduct(selectedProductId);
  if (!product) {
    product = products[0];
  }

  var isWish = false;
  for (var i = 0; i < wishlist.length; i++) {
    if (wishlist[i] === product.id) {
      isWish = true;
      break;
    }
  }

  var sizesHtml = "";
  for (var i = 0; i < product.sizes.length; i++) {
    var sizeClass = selectedSize === product.sizes[i] ? "size-button selected" : "size-button";
    sizesHtml += `<button type="button" class="${sizeClass}" onclick="selectSize('${product.sizes[i]}')">${product.sizes[i]}</button>`;
  }

  var wishButtonText = isWish ? "♥ Saved" : "♡ Wishlist";

  return `
    <section class="wrap page">
      <div class="detail">
        <img src="${product.image}" alt="${product.name}">
        <div class="detail-copy">
          <span class="eyebrow">Everyday collection</span>
          <h1>${product.name}</h1>
          <p class="price">${formatPrice(product.price)}</p>
          <p>${product.description}</p>
          <label class="option-label">Choose a size</label>
          <div class="sizes">${sizesHtml}</div>
          <label class="option-label">Colour</label>
          <select class="color-select"><option>${product.color}</option></select>
          <div class="detail-actions">
            <button class="button" type="button" onclick="addToCart(${product.id})">Add to bag</button>
            <button class="button light" type="button" onclick="toggleWishlist(${product.id})">${wishButtonText}</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Function to render Wishlist page
function renderWishlist() {
  var cardsHtml = "";
  for (var i = 0; i < wishlist.length; i++) {
    var product = getProduct(wishlist[i]);
    if (product) {
      cardsHtml += createProductCard(product);
    }
  }

  if (cardsHtml === "") {
    cardsHtml = `
      <div class="empty-state">
        <h2>No saved pieces yet</h2>
        <p>Tap the heart on anything you love.</p>
        <button class="button" type="button" onclick="goToPage('shop')">Explore the shop</button>
      </div>
    `;
  }

  return `
    <section class="wrap page">
      <h1 class="page-title">Your wishlist</h1>
      <p class="page-intro">Your saved pieces, all in one place.</p>
      <div class="product-grid">${cardsHtml}</div>
    </section>
  `;
}

// Function to render Cart page
function renderCart() {
  if (cart.length === 0) {
    return `
      <section class="wrap page">
        <h1 class="page-title">Your bag</h1>
        <div class="empty-state">
          <h2>Your bag is empty</h2>
          <p>Find something you'll love wearing.</p>
          <button class="button" type="button" onclick="goToPage('shop')">Shop now</button>
        </div>
      </section>
    `;
  }

  var itemsHtml = "";
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var p = getProduct(item.id);
    if (p) {
      itemsHtml += `
        <article class="cart-item">
          <img src="${p.image}" alt="${p.name}">
          <div>
            <h3>${p.name}</h3>
            <p>Size: ${item.size} · ${p.color}</p>
            <p>${formatPrice(p.price)}</p>
            <div class="quantity">
              <button type="button" onclick="changeQty(${p.id}, '${item.size}', -1)">−</button>
              <span>${item.quantity}</span>
              <button type="button" onclick="changeQty(${p.id}, '${item.size}', 1)">+</button>
            </div>
          </div>
          <div class="price">
            ${formatPrice(p.price * item.quantity)}
            <button class="text-button remove-button" type="button" onclick="removeItem(${p.id}, '${item.size}')">Remove</button>
          </div>
        </article>
      `;
    }
  }

  return `
    <section class="wrap page">
      <h1 class="page-title">Your bag</h1>
      <p class="page-intro">Review your picks before checkout.</p>
      <div class="cart-layout">
        <div class="cart-list">${itemsHtml}</div>
        <aside class="summary">
          ${renderOrderSummary(false)}
          <button class="button" type="button" onclick="goToPage('checkout')">Continue to checkout</button>
        </aside>
      </div>
    </section>
  `;
}

// Function to render Checkout page
function renderCheckout() {
  if (cart.length === 0) {
    return `
      <section class="wrap page">
        <h1 class="page-title">Checkout</h1>
        <div class="empty-state">
          <h2>Your bag is empty</h2>
          <button class="button" type="button" onclick="goToPage('shop')">Shop now</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="wrap page">
      <h1 class="page-title">Checkout</h1>
      <p class="page-intro">Add your details to place your order.</p>
      <div class="checkout-layout">
        <form class="form-card" id="checkout-form" onsubmit="placeOrder(event)" novalidate>
          <h2>Delivery details</h2>
          <div class="form-grid">
            <div class="field full"><label>Full name</label><input id="full-name" required><span class="form-error"></span></div>
            <div class="field"><label>Email</label><input id="email" type="email" required><span class="form-error"></span></div>
            <div class="field"><label>Phone</label><input id="phone" type="tel" maxlength="10" oninput="this.value=this.value.replace(/\\D/g,'')" required><span class="form-error"></span></div>
            <div class="field full"><label>Address</label><input id="address" required><span class="form-error"></span></div>
            <div class="field"><label>City</label><input id="city" required><span class="form-error"></span></div>
            <div class="field"><label>PIN code</label><input id="pin" maxlength="6" oninput="this.value=this.value.replace(/\\D/g,'')" required><span class="form-error"></span></div>
          </div>
          <p class="form-message" id="checkout-message"></p>
          <button class="button" type="submit">Place order</button>
        </form>
        <aside class="summary">${renderOrderSummary(true)}</aside>
      </div>
    </section>
  `;
}

// Function to render Login / Register page
function renderAuth() {
  var isRegister = (authMode === "register");
  var pageTitle = isRegister ? "Create an account" : "Welcome back";
  var pageIntro = isRegister ? "Join us for easy everyday shopping." : "Sign in to your account.";
  var nameField = isRegister ? '<div class="field"><label>Name</label><input id="auth-name" required></div>' : "";
  var submitText = isRegister ? "Create account" : "Login";

  return `
    <section class="wrap page">
      <div class="form-card auth-card">
        <h1 class="page-title">${pageTitle}</h1>
        <p class="page-intro">${pageIntro}</p>
        <div class="auth-tabs">
          <button type="button" class="${!isRegister ? "active" : ""}" onclick="setAuthMode('login')">Login</button>
          <button type="button" class="${isRegister ? "active" : ""}" onclick="setAuthMode('register')">Register</button>
        </div>
        <form id="auth-form" onsubmit="handleAuth(event)">
          ${nameField}
          <div class="field"><label>Email</label><input id="auth-email" type="email" required></div>
          <div class="field"><label>Password</label><input id="auth-password" type="password" minlength="6" required></div>
          <p class="form-message" id="auth-message"></p>
          <button class="button" type="submit">${submitText}</button>
        </form>
      </div>
    </section>
  `;
}

// Function to render Order Confirmation page
function renderConfirmation() {
  return `
    <section class="wrap page">
      <div class="empty-state">
        <span class="eyebrow">Thank you</span>
        <h2>Order confirmed</h2>
        <p>Your order has been placed successfully.</p>
        <button class="button" type="button" onclick="goToPage('shop')">Continue shopping</button>
      </div>
    </section>
  `;
}

// --- 8. FILTER INPUT EVENT HANDLERS ---
function onSizeChange(checkbox) {
  if (checkbox.checked) {
    selectedFilterSize = checkbox.value;
  } else {
    selectedFilterSize = "";
  }
  render();
}

function onColorChange(value) {
  selectedColor = value;
  render();
}

function onSortChange(value) {
  selectedSort = value;
  render();
}

function onPriceChange(value) {
  maxPrice = Number(value);
  var legend = document.getElementById("price-legend");
  if (legend) {
    legend.innerText = "Max price: " + formatPrice(maxPrice);
  }
}

// --- 9. MAIN RENDER FUNCTION ---
function render() {
  var html = "";

  if (currentPage === "home") {
    html = renderHome();
  } else if (currentPage === "shop") {
    html = renderShop();
  } else if (currentPage === "detail") {
    html = renderDetail();
  } else if (currentPage === "wishlist") {
    html = renderWishlist();
  } else if (currentPage === "cart") {
    html = renderCart();
  } else if (currentPage === "checkout") {
    html = renderCheckout();
  } else if (currentPage === "confirmation") {
    html = renderConfirmation();
  } else if (currentPage === "auth") {
    html = renderAuth();
  }

  document.getElementById("app").innerHTML = html;
  updateCounts();
}

// Listen for clicks on header navigation links
document.addEventListener("click", function(event) {
  var routeLink = event.target.closest("[data-route]");
  if (routeLink) {
    event.preventDefault();
    goToPage(routeLink.getAttribute("data-route"));
  }

  var detailLink = event.target.closest("[data-detail]");
  if (detailLink) {
    event.preventDefault();
    openProduct(Number(detailLink.getAttribute("data-detail")));
  }
});

// --- 10. APP INITIALIZATION ---
loadData();
render();
