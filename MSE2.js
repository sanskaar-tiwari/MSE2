/* ========================================================
   College Clothing Store - Frontend JavaScript
   Project: MSE2
   Description: Single Page Application (SPA) handling
   product catalog, filtering, cart, wishlist, and checkout.
======================================================== */

// --- 1. PRODUCT CATALOG DATA ---
const products = [
  {
    id: 1,
    name: "Everyday Linen Shirt",
    price: 1890,
    color: "Ivory",
    sizes: ["S", "M", "L", "XL"],
    newest: 4,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85",
    description: "A relaxed linen-blend shirt with an easy fit and a soft, breathable feel."
  },
  {
    id: 2,
    name: "Relaxed Cotton Tee",
    price: 890,
    color: "Olive",
    sizes: ["S", "M", "L", "XL"],
    newest: 3,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85",
    description: "Your everyday essential, cut from comfortable cotton with a clean finish."
  },
  {
    id: 3,
    name: "Weekend Denim",
    price: 2290,
    color: "Blue",
    sizes: ["S", "M", "L"],
    newest: 2,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85",
    description: "Classic straight-leg denim designed to be worn on repeat."
  },
  {
    id: 4,
    name: "Soft Knit Cardigan",
    price: 2590,
    color: "Sand",
    sizes: ["S", "M", "L"],
    newest: 1,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=85",
    description: "A light, layer-friendly knit that works across seasons."
  },
  {
    id: 5,
    name: "Daily Cotton Dress",
    price: 1990,
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
    newest: 5,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=85",
    description: "An easy cotton dress with a comfortable shape for all-day wear."
  },
  {
    id: 6,
    name: "Linen Easy Trousers",
    price: 1790,
    color: "Sand",
    sizes: ["S", "M", "L", "XL"],
    newest: 6,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=85",
    description: "Lightweight, relaxed trousers made for everyday comfort."
  },
  {
    id: 7,
    name: "Classic Overshirt",
    price: 2190,
    color: "Olive",
    sizes: ["S", "M", "L"],
    newest: 7,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85",
    description: "A versatile layer with a roomy fit and useful everyday details."
  },
  {
    id: 8,
    name: "Ribbed Tank",
    price: 690,
    color: "Black",
    sizes: ["S", "M", "L", "XL"],
    newest: 8,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85",
    description: "A soft ribbed basic that slips easily into your daily rotation."
  }
];

// --- 2. APPLICATION STATE & LOCALSTORAGE ---
const app = document.querySelector("#app");

// Helper to load data safely from browser localStorage
function getSavedData(key, fallbackValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
}

// Global state holding current page, cart, wishlist, and active filters
const state = {
  cart: getSavedData("tf-cart", []),
  wishlist: getSavedData("tf-wishlist", []),
  page: "home",
  productId: null,
  size: "M",          // Selected size on product detail page
  filterSize: "",     // Filter by size on shop page
  color: "",
  maxPrice: 3000,
  sort: "featured",
  coupon: "",
  couponMessage: "",
  authMode: "login"
};

// Find product by its ID
function getProductById(id) {
  return products.find(product => product.id === Number(id));
}

// Save cart and wishlist to localStorage and update header counts
function saveState() {
  localStorage.setItem("tf-cart", JSON.stringify(state.cart));
  localStorage.setItem("tf-wishlist", JSON.stringify(state.wishlist));
  updateHeaderCounts();
}

// Update cart and wishlist count badges in the navigation bar
function updateHeaderCounts() {
  const totalCartItems = state.cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector("#cart-count").textContent = totalCartItems;
  
  const wishlistCount = state.wishlist.length;
  document.querySelector("#wish-count").textContent = wishlistCount > 0 ? `(${wishlistCount})` : "";
}

// Navigate to a different page and scroll to top
function navigateTo(pageName) {
  state.page = pageName;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Currency formatter for Indian Rupees
function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

// Show a temporary alert message toast at the bottom right
function showToast(message) {
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toastElement = document.createElement("div");
  toastElement.className = "toast";
  toastElement.setAttribute("role", "status");
  toastElement.textContent = message;
  document.body.appendChild(toastElement);

  setTimeout(() => {
    toastElement.remove();
  }, 2200);
}

// --- 3. CART & WISHLIST ACTIONS ---

// Toggle item in wishlist
function toggleWishlist(productId) {
  const id = Number(productId);
  if (state.wishlist.includes(id)) {
    state.wishlist = state.wishlist.filter(item => item !== id);
  } else {
    state.wishlist.push(id);
  }
  saveState();
  render();
}

// Add product to cart with selected size
function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const selectedSize = product.sizes.includes(state.size) ? state.size : product.sizes[0];
  const existingItem = state.cart.find(item => item.id === product.id && item.size === selectedSize);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ id: product.id, size: selectedSize, quantity: 1 });
  }

  saveState();
  showToast(`${product.name} added to your bag`);
}

// Calculate subtotal, discount, GST tax, and final total
function calculateTotals() {
  const subtotal = state.cart.reduce((sum, item) => {
    const product = getProductById(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  let discount = 0;
  if (state.coupon === "STYLE10") {
    discount = Math.round(subtotal * 0.10); // 10% coupon discount
  }

  const taxableAmount = subtotal - discount;
  const gst = Math.round(taxableAmount * 0.05); // 5% GST
  const shipping = (taxableAmount === 0 || taxableAmount >= 2000) ? 0 : 99; // Free above ₹2,000
  const total = taxableAmount + gst + shipping;

  return { subtotal, discount, gst, shipping, total };
}

// --- 4. HTML TEMPLATE BUILDERS ---

// Generate HTML card for an individual product
function createProductCard(product) {
  const isWishlisted = state.wishlist.includes(product.id);
  const heartIcon = isWishlisted ? "♥" : "♡";

  return `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" data-detail="${product.id}">
        <button class="heart" type="button" aria-label="Toggle wishlist" data-wish="${product.id}">
          ${heartIcon}
        </button>
      </div>
      <h3 class="product-name" data-detail="${product.id}">${product.name}</h3>
      <p class="product-price">${formatPrice(product.price)}</p>
      <div class="product-actions">
        <span class="product-price">${product.color}</span>
        <button class="button light small" type="button" data-add="${product.id}">Add to bag</button>
      </div>
    </article>
  `;
}

// Render Order Summary section (used in Cart and Checkout)
function renderOrderSummary(isCheckout = false) {
  const { subtotal, discount, gst, shipping, total } = calculateTotals();

  let itemsSummaryHtml = "";
  if (isCheckout) {
    itemsSummaryHtml = `
      <div class="checkout-summary">
        ${state.cart.map(item => {
          const product = getProductById(item.id);
          if (!product) return "";
          return `
            <div class="summary-row">
              <span>${product.name} × ${item.quantity}</span>
              <span>${formatPrice(product.price * item.quantity)}</span>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  const discountRowHtml = discount > 0 ? `
    <div class="summary-row">
      <span>Discount (STYLE10)</span>
      <span>−${formatPrice(discount)}</span>
    </div>
  ` : "";

  const couponFormHtml = !isCheckout ? `
    <form class="coupon" id="coupon-form">
      <input name="coupon" placeholder="Coupon code" value="${state.coupon}" aria-label="Coupon code">
      <button class="button light small" type="submit">Apply</button>
    </form>
    <p class="coupon-message" role="status">${state.couponMessage}</p>
  ` : "";

  return `
    <h2>Order summary</h2>
    ${itemsSummaryHtml}
    <div class="summary-row">
      <span>Subtotal</span>
      <span>${formatPrice(subtotal)}</span>
    </div>
    ${discountRowHtml}
    <div class="summary-row">
      <span>GST (5%)</span>
      <span>${formatPrice(gst)}</span>
    </div>
    <div class="summary-row">
      <span>Shipping</span>
      <span>${shipping === 0 ? "Free" : formatPrice(shipping)}</span>
    </div>
    <div class="summary-row total">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
    ${couponFormHtml}
  `;
}

// --- 5. PAGE RENDERERS ---

// Home Page
function renderHomePage() {
  const featuredProducts = products.slice(0, 4);

  return `
    <section class="wrap">
      <div class="hero">
        <div class="hero-copy">
          <span class="eyebrow">Welcome to our store</span>
          <h1>Shop clothes online</h1>
          <p>Browse our clothing collection and add your favourite items to the bag.</p>
          <button class="button" type="button" data-route="shop">Shop now</button>
        </div>
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85" alt="Everyday clothing collection">
      </div>
      <section class="home-products">
        <div class="section-heading">
          <h2>Customer favourites</h2>
          <a href="#" data-route="shop">View all →</a>
        </div>
        <div class="product-grid">
          ${featuredProducts.map(createProductCard).join("")}
        </div>
      </section>
    </section>
  `;
}

// Shop Catalog Page with filters and sorting
function renderShopPage() {
  let filteredProducts = products.filter(product => {
    const matchesPrice = product.price <= state.maxPrice;
    const matchesColor = !state.color || product.color === state.color;
    const matchesSize = !state.filterSize || product.sizes.includes(state.filterSize);
    return matchesPrice && matchesColor && matchesSize;
  });

  // Sort products
  if (state.sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (state.sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (state.sort === "newest") {
    filteredProducts.sort((a, b) => b.newest - a.newest);
  }

  const sizes = ["S", "M", "L", "XL"];
  const colors = ["Ivory", "Olive", "Blue", "Sand", "Black"];

  return `
    <section class="wrap page">
      <h1 class="page-title">Shop all</h1>
      <p class="page-intro">Everyday favourites, made easy to wear.</p>
      <div class="shop-layout">
        <!-- Sidebar Filters -->
        <aside class="filters" aria-label="Product filters">
          <fieldset class="filter-group">
            <legend>Size</legend>
            ${sizes.map(size => `
              <label>
                <input type="checkbox" name="size" value="${size}" ${state.filterSize === size ? "checked" : ""}> ${size}
              </label>
            `).join("")}
          </fieldset>

          <fieldset class="filter-group">
            <legend>Colour</legend>
            <select id="color-filter" aria-label="Filter by colour">
              <option value="">All colours</option>
              ${colors.map(color => `
                <option value="${color}" ${state.color === color ? "selected" : ""}>${color}</option>
              `).join("")}
            </select>
          </fieldset>

          <fieldset class="filter-group">
            <legend>Max price: ${formatPrice(state.maxPrice)}</legend>
            <input id="price-filter" type="range" min="700" max="3000" step="100" value="${state.maxPrice}" aria-label="Maximum price">
          </fieldset>
        </aside>

        <!-- Product Grid & Toolbar -->
        <div>
          <div class="shop-toolbar">
            <span>${filteredProducts.length} products</span>
            <select class="sort-select" id="sort-filter" aria-label="Sort products">
              <option value="featured" ${state.sort === "featured" ? "selected" : ""}>Featured</option>
              <option value="low" ${state.sort === "low" ? "selected" : ""}>Price: low to high</option>
              <option value="high" ${state.sort === "high" ? "selected" : ""}>Price: high to low</option>
              <option value="newest" ${state.sort === "newest" ? "selected" : ""}>Newest</option>
            </select>
          </div>

          ${filteredProducts.length > 0 ? `
            <div class="product-grid">
              ${filteredProducts.map(createProductCard).join("")}
            </div>
          ` : `
            <div class="empty-state">
              <h2>No matches</h2>
              <p>Try changing your filters.</p>
              <button class="button light" data-reset-filters type="button">Clear filters</button>
            </div>
          `}
        </div>
      </div>
    </section>
  `;
}

// Product Details Page
function renderDetailPage() {
  const product = getProductById(state.productId) || products[0];
  const isWishlisted = state.wishlist.includes(product.id);

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
          <div class="sizes">
            ${product.sizes.map(size => `
              <button type="button" class="size-button ${state.size === size ? "selected" : ""}" data-size="${size}">
                ${size}
              </button>
            `).join("")}
          </div>

          <label class="option-label" for="detail-color">Colour</label>
          <select class="color-select" id="detail-color">
            <option>${product.color}</option>
          </select>

          <div class="detail-actions">
            <button class="button" type="button" data-add="${product.id}">Add to bag</button>
            <button class="button light" type="button" data-wish="${product.id}">
              ${isWishlisted ? "♥ Saved" : "♡ Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Wishlist Page
function renderWishlistPage() {
  const wishlistedItems = state.wishlist.map(getProductById).filter(Boolean);

  return `
    <section class="wrap page">
      <h1 class="page-title">Your wishlist</h1>
      <p class="page-intro">Your saved pieces, all in one place.</p>
      ${wishlistedItems.length > 0 ? `
        <div class="product-grid">
          ${wishlistedItems.map(createProductCard).join("")}
        </div>
      ` : `
        <div class="empty-state">
          <h2>No saved pieces yet</h2>
          <p>Tap the heart on anything you love.</p>
          <button class="button" type="button" data-route="shop">Explore the shop</button>
        </div>
      `}
    </section>
  `;
}

// Shopping Bag / Cart Page
function renderCartPage() {
  if (state.cart.length === 0) {
    return `
      <section class="wrap page">
        <h1 class="page-title">Your bag</h1>
        <div class="empty-state">
          <h2>Your bag is empty</h2>
          <p>Find something you'll love wearing.</p>
          <button class="button" type="button" data-route="shop">Shop now</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="wrap page">
      <h1 class="page-title">Your bag</h1>
      <p class="page-intro">Review your picks before checkout.</p>
      <div class="cart-layout">
        <div class="cart-list">
          ${state.cart.map(item => {
            const product = getProductById(item.id);
            if (!product) return "";
            return `
              <article class="cart-item">
                <img src="${product.image}" alt="${product.name}">
                <div>
                  <h3>${product.name}</h3>
                  <p>Size: ${item.size} · ${product.color}</p>
                  <p>${formatPrice(product.price)}</p>
                  <div class="quantity">
                    <button type="button" aria-label="Decrease quantity" data-quantity="${product.id}" data-size="${item.size}" data-change="-1">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" aria-label="Increase quantity" data-quantity="${product.id}" data-size="${item.size}" data-change="1">+</button>
                  </div>
                </div>
                <div class="price">
                  ${formatPrice(product.price * item.quantity)}
                  <button class="text-button remove-button" type="button" data-remove="${product.id}" data-size="${item.size}">Remove</button>
                </div>
              </article>
            `;
          }).join("")}
        </div>
        <aside class="summary">
          ${renderOrderSummary(false)}
          <button class="button" type="button" data-route="checkout">Continue to checkout</button>
        </aside>
      </div>
    </section>
  `;
}

// Checkout Form Page
function renderCheckoutPage() {
  if (state.cart.length === 0) {
    return `
      <section class="wrap page">
        <h1 class="page-title">Checkout</h1>
        <div class="empty-state">
          <h2>Your bag is empty</h2>
          <button class="button" data-route="shop" type="button">Shop now</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="wrap page">
      <h1 class="page-title">Checkout</h1>
      <p class="page-intro">Add your details to place your order.</p>
      <div class="checkout-layout">
        <form class="form-card" id="checkout-form" novalidate>
          <h2>Delivery details</h2>
          <div class="form-grid">
            <div class="field full">
              <label for="full-name">Full name</label>
              <input id="full-name" name="name" autocomplete="name" required>
              <span class="form-error"></span>
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" required>
              <span class="form-error"></span>
            </div>
            <div class="field">
              <label for="phone">Phone number</label>
              <input id="phone" name="phone" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel" required>
              <span class="form-error"></span>
            </div>
            <div class="field full">
              <label for="address">Address</label>
              <input id="address" name="address" autocomplete="street-address" required>
              <span class="form-error"></span>
            </div>
            <div class="field">
              <label for="city">City</label>
              <input id="city" name="city" autocomplete="address-level2" required>
              <span class="form-error"></span>
            </div>
            <div class="field">
              <label for="pin">PIN code</label>
              <input id="pin" name="pin" inputmode="numeric" maxlength="6" autocomplete="postal-code" required>
              <span class="form-error"></span>
            </div>
          </div>
          <p class="form-message" id="checkout-message" role="status"></p>
          <button class="button" type="submit">Place order</button>
        </form>
        <aside class="summary">
          ${renderOrderSummary(true)}
        </aside>
      </div>
    </section>
  `;
}

// Order Confirmation Page
function renderConfirmationPage() {
  return `
    <section class="wrap page">
      <div class="empty-state">
        <span class="eyebrow">Thank you</span>
        <h2>Order confirmed</h2>
        <p>Your order has been placed successfully.</p>
        <button class="button" type="button" data-route="shop">Continue shopping</button>
      </div>
    </section>
  `;
}

// Account / Authentication Page
function renderAuthPage() {
  const isRegister = state.authMode === "register";

  return `
    <section class="wrap page">
      <div class="form-card auth-card">
        <h1 class="page-title">${isRegister ? "Create an account" : "Welcome back"}</h1>
        <p class="page-intro">${isRegister ? "Join us for easy everyday shopping." : "Sign in to your account."}</p>
        <div class="auth-tabs">
          <button type="button" data-auth-mode="login" class="${!isRegister ? "active" : ""}">Login</button>
          <button type="button" data-auth-mode="register" class="${isRegister ? "active" : ""}">Register</button>
        </div>
        <form id="auth-form">
          ${isRegister ? `
            <div class="field">
              <label for="auth-name">Name</label>
              <input id="auth-name" name="name" required>
            </div>
          ` : ""}
          <div class="field">
            <label for="auth-email">Email</label>
            <input id="auth-email" name="email" type="email" required>
          </div>
          <div class="field">
            <label for="auth-password">Password</label>
            <input id="auth-password" name="password" type="password" minlength="6" required>
          </div>
          <p class="form-message" id="auth-message" role="status"></p>
          <button class="button" type="submit">${isRegister ? "Create account" : "Login"}</button>
        </form>
      </div>
    </section>
  `;
}

// Main render function routing to the current page
function render() {
  const pageRoutes = {
    home: renderHomePage,
    shop: renderShopPage,
    detail: renderDetailPage,
    wishlist: renderWishlistPage,
    cart: renderCartPage,
    checkout: renderCheckoutPage,
    confirmation: renderConfirmationPage,
    auth: renderAuthPage
  };

  const pageRenderer = pageRoutes[state.page] || renderHomePage;
  app.innerHTML = pageRenderer();
  updateHeaderCounts();
}

// --- 6. EVENT LISTENERS ---

// Global click event listener for navigation and actions
document.addEventListener("click", function(event) {
  const target = event.target.closest("[data-route], [data-detail], [data-wish], [data-add], [data-size], [data-quantity], [data-remove], [data-reset-filters], [data-auth-mode]");
  if (!target) return;

  event.preventDefault();

  // Navigation route clicked
  if (target.dataset.route) {
    navigateTo(target.dataset.route);
  }

  // Open product detail view
  if (target.dataset.detail) {
    state.productId = Number(target.dataset.detail);
    state.size = "M";
    navigateTo("detail");
  }

  // Toggle wishlist
  if (target.dataset.wish) {
    toggleWishlist(target.dataset.wish);
  }

  // Add to cart
  if (target.dataset.add) {
    addToCart(target.dataset.add);
  }

  // Select size on detail page
  if (target.dataset.size) {
    state.size = target.dataset.size;
    render();
  }

  // Adjust cart item quantity (+ or -)
  if (target.dataset.quantity) {
    const productId = Number(target.dataset.quantity);
    const size = target.dataset.size;
    const change = Number(target.dataset.change);

    const item = state.cart.find(entry => entry.id === productId && entry.size === size);
    if (item) {
      item.quantity = Math.max(1, item.quantity + change);
      saveState();
      render();
    }
  }

  // Remove item from cart
  if (target.dataset.remove) {
    const productId = Number(target.dataset.remove);
    const size = target.dataset.size;
    state.cart = state.cart.filter(item => !(item.id === productId && item.size === size));
    saveState();
    render();
  }

  // Reset all filters in shop
  if (target.hasAttribute("data-reset-filters")) {
    state.filterSize = "";
    state.color = "";
    state.maxPrice = 3000;
    render();
  }

  // Switch between Login and Register tabs
  if (target.dataset.authMode) {
    state.authMode = target.dataset.authMode;
    render();
  }
});

// Dropdowns and checkbox filter changes
document.addEventListener("change", function(event) {
  if (event.target.name === "size") {
    state.filterSize = event.target.checked ? event.target.value : "";
    render();
  }

  if (event.target.id === "color-filter") {
    state.color = event.target.value;
    render();
  }

  if (event.target.id === "price-filter") {
    state.maxPrice = Number(event.target.value);
    render();
  }

  if (event.target.id === "sort-filter") {
    state.sort = event.target.value;
    render();
  }
});

// Real-time input handling for price slider and numeric formatters
document.addEventListener("input", function(event) {
  // Update price slider legend text
  if (event.target.id === "price-filter") {
    state.maxPrice = Number(event.target.value);
    const legend = event.target.closest(".filter-group").querySelector("legend");
    legend.textContent = `Max price: ${formatPrice(state.maxPrice)}`;
  }

  // Restrict phone input to 10 digits
  if (event.target.id === "phone") {
    event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
  }

  // Restrict PIN code input to 6 digits
  if (event.target.id === "pin") {
    event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
  }
});

// Form submissions (Coupons, Checkout, Authentication)
document.addEventListener("submit", function(event) {
  // Coupon Code form
  if (event.target.id === "coupon-form") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const code = (formData.get("coupon") || "").trim().toUpperCase();

    if (code === "STYLE10") {
      state.coupon = code;
      state.couponMessage = "10% discount applied.";
    } else {
      state.coupon = "";
      state.couponMessage = code ? "That coupon code isn't valid." : "Enter a coupon code.";
    }
    render();
  }

  // Checkout delivery details form
  if (event.target.id === "checkout-form") {
    event.preventDefault();
    const form = event.target;
    let isValid = true;

    // Validate each input field
    const inputs = form.querySelectorAll("input");
    inputs.forEach(input => {
      let errorMessage = "";
      const value = input.value.trim();

      if (!value) {
        errorMessage = "This field is required.";
      } else if (input.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMessage = "Enter a valid email address.";
      } else if (input.name === "phone" && !/^\d{10}$/.test(value)) {
        errorMessage = "Enter a 10-digit phone number.";
      } else if (input.name === "pin" && !/^\d{6}$/.test(value)) {
        errorMessage = "Enter a 6-digit PIN code.";
      }

      input.nextElementSibling.textContent = errorMessage;
      if (errorMessage) {
        isValid = false;
      }
    });

    const statusMessage = document.querySelector("#checkout-message");
    if (!isValid) {
      statusMessage.textContent = "Please check the highlighted details.";
      const firstInvalidField = form.querySelector(".form-error:not(:empty)");
      if (firstInvalidField && firstInvalidField.previousElementSibling) {
        firstInvalidField.previousElementSibling.focus();
      }
      return;
    }

    // Clear cart and show order confirmation
    state.cart = [];
    state.coupon = "";
    state.page = "confirmation";
    saveState();
    render();
  }

  // Login / Register form
  if (event.target.id === "auth-form") {
    event.preventDefault();
    const authStatus = document.querySelector("#auth-message");
    authStatus.textContent = state.authMode === "register"
      ? "Account created for this demo."
      : "You’re signed in for this demo.";
  }
});

// --- 7. INITIALIZE APPLICATION ---
render();
