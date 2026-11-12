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

const app = document.querySelector("#app");
const money = v => `₹${Number(v).toLocaleString("en-IN")}`;
const saved = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) || f; } catch { return f; } };
const state = { cart: saved("tf-cart", []), wishlist: saved("tf-wishlist", []), page: "home", productId: null, size: "M", filterSize: "", color: "", maxPrice: 3000, sort: "featured", coupon: "", couponMessage: "", authMode: "login" };
const productById = id => products.find(p => p.id === Number(id));
const persist = () => { localStorage.setItem("tf-cart", JSON.stringify(state.cart)); localStorage.setItem("tf-wishlist", JSON.stringify(state.wishlist)); updateCounts(); };

function updateCounts() {
  document.querySelector("#cart-count").textContent = state.cart.reduce((s, i) => s + i.quantity, 0);
  document.querySelector("#wish-count").textContent = state.wishlist.length ? `(${state.wishlist.length})` : "";
}

function go(p) { state.page = p; render(); window.scrollTo({ top: 0, behavior: "smooth" }); }

function productCard(p) {
  const wished = state.wishlist.includes(p.id);
  return `<article class="product-card">
    <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" data-detail="${p.id}"><button class="heart" type="button" aria-label="${wished ? "Remove from" : "Add to"} wishlist" data-wish="${p.id}">${wished ? "♥" : "♡"}</button></div>
    <h3 class="product-name" data-detail="${p.id}">${p.name}</h3><p class="product-price">${money(p.price)}</p>
    <div class="product-actions"><span class="product-price">${p.color}</span><button class="button light small" type="button" data-add="${p.id}">Add to bag</button></div>
  </article>`;
}

function renderHome() {
  return `<section class="wrap">
    <div class="hero"><div class="hero-copy"><span class="eyebrow">Welcome to our store</span><h1>Shop clothes online</h1><p>Browse our clothing collection and add your favourite items to the bag.</p><button class="button" type="button" data-route="shop">Shop now</button></div><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85" alt="Everyday clothing collection"></div>
    <section class="home-products"><div class="section-heading"><h2>Customer favourites</h2><a href="#" data-route="shop">View all →</a></div><div class="product-grid">${products.slice(0, 4).map(productCard).join("")}</div></section>
  </section>`;
}

function renderShop() {
  let filtered = products.filter(p => p.price <= state.maxPrice && (!state.color || p.color === state.color) && (!state.filterSize || p.sizes.includes(state.filterSize)));
  if (state.sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (state.sort === "high") filtered.sort((a, b) => b.price - a.price);
  if (state.sort === "newest") filtered.sort((a, b) => b.newest - a.newest);
  return `<section class="wrap page"><h1 class="page-title">Shop all</h1><p class="page-intro">Everyday favourites, made easy to wear.</p>
    <div class="shop-layout">
      <aside class="filters" aria-label="Product filters">
        <fieldset class="filter-group"><legend>Size</legend>${["S", "M", "L", "XL"].map(s => `<label><input type="checkbox" name="size" value="${s}" ${state.filterSize === s ? "checked" : ""}> ${s}</label>`).join("")}</fieldset>
        <fieldset class="filter-group"><legend>Colour</legend><select id="color-filter" aria-label="Filter by colour"><option value="">All colours</option>${["Ivory", "Olive", "Blue", "Sand", "Black"].map(c => `<option value="${c}" ${state.color === c ? "selected" : ""}>${c}</option>`).join("")}</select></fieldset>
        <fieldset class="filter-group"><legend>Max price: ${money(state.maxPrice)}</legend><input id="price-filter" type="range" min="700" max="3000" step="100" value="${state.maxPrice}" aria-label="Maximum price"></fieldset>
      </aside>
      <div>
        <div class="shop-toolbar"><span>${filtered.length} products</span>
          <select class="sort-select" id="sort-filter" aria-label="Sort products"><option value="featured" ${state.sort === "featured" ? "selected" : ""}>Featured</option><option value="low" ${state.sort === "low" ? "selected" : ""}>Price: low to high</option><option value="high" ${state.sort === "high" ? "selected" : ""}>Price: high to low</option><option value="newest" ${state.sort === "newest" ? "selected" : ""}>Newest</option></select>
        </div>
        ${filtered.length ? `<div class="product-grid">${filtered.map(productCard).join("")}</div>` : `<div class="empty-state"><h2>No matches</h2><p>Try changing your filters.</p><button class="button light" data-reset-filters type="button">Clear filters</button></div>`}
      </div>
    </div>
  </section>`;
}

function renderDetail() {
  const product = productById(state.productId) || products[0], wished = state.wishlist.includes(product.id);
  return `<section class="wrap page"><div class="detail"><img src="${product.image}" alt="${product.name}"><div class="detail-copy">
    <span class="eyebrow">Everyday collection</span><h1>${product.name}</h1><p class="price">${money(product.price)}</p><p>${product.description}</p>
    <label class="option-label">Choose a size</label><div class="sizes">${product.sizes.map(s => `<button type="button" class="size-button ${state.size === s ? "selected" : ""}" data-size="${s}">${s}</button>`).join("")}</div>
    <label class="option-label" for="detail-color">Colour</label><select class="color-select" id="detail-color"><option>${product.color}</option></select>
    <div class="detail-actions"><button class="button" type="button" data-add="${product.id}">Add to bag</button><button class="button light" type="button" data-wish="${product.id}">${wished ? "♥ Saved" : "♡ Wishlist"}</button></div>
  </div></div></section>`;
}

function renderWishlist() {
  const items = state.wishlist.map(productById).filter(Boolean);
  return `<section class="wrap page"><h1 class="page-title">Your wishlist</h1><p class="page-intro">Your saved pieces, all in one place.</p>
    ${items.length ? `<div class="product-grid">${items.map(productCard).join("")}</div>` : `<div class="empty-state"><h2>No saved pieces yet</h2><p>Tap the heart on anything you love.</p><button class="button" type="button" data-route="shop">Explore the shop</button></div>`}
  </section>`;
}

const subtotal = () => state.cart.reduce((s, i) => s + (productById(i.id)?.price || 0) * i.quantity, 0);

function totals() {
  const sub = subtotal(), discount = state.coupon === "STYLE10" ? Math.round(sub * .1) : 0, taxable = sub - discount, gst = Math.round(taxable * .05), shipping = taxable === 0 || taxable >= 2000 ? 0 : 99;
  return { sub, discount, gst, shipping, total: taxable + gst + shipping };
}

function renderSummary(checkout = false) {
  const t = totals(), discountRow = t.discount ? `<div class="summary-row"><span>Discount (STYLE10)</span><span>−${money(t.discount)}</span></div>` : "";
  return `<h2>Order summary</h2>${checkout ? `<div class="checkout-summary">${state.cart.map(i => { const p = productById(i.id); return p ? `<div class="summary-row"><span>${p.name} × ${i.quantity}</span><span>${money(p.price * i.quantity)}</span></div>` : ""; }).join("")}</div>` : ""}
    <div class="summary-row"><span>Subtotal</span><span>${money(t.sub)}</span></div>${discountRow}<div class="summary-row"><span>GST (5%)</span><span>${money(t.gst)}</span></div><div class="summary-row"><span>Shipping</span><span>${t.shipping ? money(t.shipping) : "Free"}</span></div><div class="summary-row total"><span>Total</span><span>${money(t.total)}</span></div>
    ${!checkout ? `<form class="coupon" id="coupon-form"><input name="coupon" placeholder="Coupon code" value="${state.coupon}" aria-label="Coupon code"><button class="button light small" type="submit">Apply</button></form><p class="coupon-message" role="status">${state.couponMessage}</p>` : ""}`;
}

function renderCart() {
  if (!state.cart.length) return `<section class="wrap page"><h1 class="page-title">Your bag</h1><div class="empty-state"><h2>Your bag is empty</h2><p>Find something you'll love wearing.</p><button class="button" type="button" data-route="shop">Shop now</button></div></section>`;
  return `<section class="wrap page"><h1 class="page-title">Your bag</h1><p class="page-intro">Review your picks before checkout.</p><div class="cart-layout">
    <div class="cart-list">${state.cart.map(i => { const p = productById(i.id); return p ? `<article class="cart-item"><img src="${p.image}" alt="${p.name}"><div><h3>${p.name}</h3><p>Size: ${i.size} · ${p.color}</p><p>${money(p.price)}</p><div class="quantity"><button type="button" aria-label="Decrease quantity" data-quantity="${p.id}" data-size="${i.size}" data-change="-1">−</button><span>${i.quantity}</span><button type="button" aria-label="Increase quantity" data-quantity="${p.id}" data-size="${i.size}" data-change="1">+</button></div></div><div class="price">${money(p.price * i.quantity)}<button class="text-button remove-button" type="button" data-remove="${p.id}" data-size="${i.size}">Remove</button></div></article>` : ""; }).join("")}</div>
    <aside class="summary">${renderSummary()}<button class="button" type="button" data-route="checkout">Continue to checkout</button></aside>
  </div></section>`;
}

function renderCheckout() {
  if (!state.cart.length) return `<section class="wrap page"><h1 class="page-title">Checkout</h1><div class="empty-state"><h2>Your bag is empty</h2><button class="button" data-route="shop" type="button">Shop now</button></div></section>`;
  return `<section class="wrap page"><h1 class="page-title">Checkout</h1><p class="page-intro">Add your details to place your order.</p><div class="checkout-layout">
    <form class="form-card" id="checkout-form" novalidate><h2>Delivery details</h2>
      <div class="form-grid">
        <div class="field full"><label for="full-name">Full name</label><input id="full-name" name="name" autocomplete="name" required><span class="form-error"></span></div>
        <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required><span class="form-error"></span></div>
        <div class="field"><label for="phone">Phone number</label><input id="phone" name="phone" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel" required><span class="form-error"></span></div>
        <div class="field full"><label for="address">Address</label><input id="address" name="address" autocomplete="street-address" required><span class="form-error"></span></div>
        <div class="field"><label for="city">City</label><input id="city" name="city" autocomplete="address-level2" required><span class="form-error"></span></div>
        <div class="field"><label for="pin">PIN code</label><input id="pin" name="pin" inputmode="numeric" maxlength="6" autocomplete="postal-code" required><span class="form-error"></span></div>
      </div><p class="form-message" id="checkout-message" role="status"></p><button class="button" type="submit">Place order</button>
    </form><aside class="summary">${renderSummary(true)}</aside>
  </div></section>`;
}

const renderConfirmation = () => `<section class="wrap page"><div class="empty-state"><span class="eyebrow">Thank you</span><h2>Order confirmed</h2><p>Your order has been placed successfully.</p><button class="button" type="button" data-route="shop">Continue shopping</button></div></section>`;

function renderAuth() {
  const isRegister = state.authMode === "register";
  return `<section class="wrap page"><div class="form-card auth-card"><h1 class="page-title">${isRegister ? "Create an account" : "Welcome back"}</h1><p class="page-intro">${isRegister ? "Join us for easy everyday shopping." : "Sign in to your account."}</p><div class="auth-tabs"><button type="button" data-auth-mode="login" class="${!isRegister ? "active" : ""}">Login</button><button type="button" data-auth-mode="register" class="${isRegister ? "active" : ""}">Register</button></div>
    <form id="auth-form">${isRegister ? `<div class="field"><label for="auth-name">Name</label><input id="auth-name" name="name" required></div>` : ""}<div class="field"><label for="auth-email">Email</label><input id="auth-email" name="email" type="email" required></div><div class="field"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" minlength="6" required></div><p class="form-message" id="auth-message" role="status"></p><button class="button" type="submit">${isRegister ? "Create account" : "Login"}</button></form>
  </div></section>`;
}

function render() {
  const pages = { home: renderHome, shop: renderShop, detail: renderDetail, wishlist: renderWishlist, cart: renderCart, checkout: renderCheckout, confirmation: renderConfirmation, auth: renderAuth };
  app.innerHTML = (pages[state.page] || renderHome)();
  updateCounts();
}

function toast(msg) {
  document.querySelector(".toast")?.remove();
  const node = document.createElement("div");
  node.className = "toast"; node.setAttribute("role", "status"); node.textContent = msg;
  document.body.append(node);
  setTimeout(() => node.remove(), 2200);
}

function toggleWishlist(id) {
  const pid = Number(id);
  state.wishlist = state.wishlist.includes(pid) ? state.wishlist.filter(i => i !== pid) : [...state.wishlist, pid];
  persist(); render();
}

function addToCart(id) {
  const p = productById(id);
  if (!p) return;
  const size = p.sizes.includes(state.size) ? state.size : p.sizes[0];
  const existing = state.cart.find(i => i.id === p.id && i.size === size);
  if (existing) existing.quantity += 1;
  else state.cart.push({ id: p.id, size, quantity: 1 });
  persist(); toast(`${p.name} added to your bag`);
}

document.addEventListener("click", e => {
  const t = e.target.closest("[data-route], [data-detail], [data-wish], [data-add], [data-size], [data-quantity], [data-remove], [data-reset-filters], [data-auth-mode]");
  if (!t) return;
  e.preventDefault();
  if (t.dataset.route) go(t.dataset.route);
  if (t.dataset.detail) { state.productId = Number(t.dataset.detail); state.size = "M"; go("detail"); }
  if (t.dataset.wish) toggleWishlist(t.dataset.wish);
  if (t.dataset.add) addToCart(t.dataset.add);
  if (t.dataset.size) { state.size = t.dataset.size; render(); }
  if (t.dataset.quantity) { const item = state.cart.find(i => i.id === Number(t.dataset.quantity) && i.size === t.dataset.size); if (item) item.quantity = Math.max(1, item.quantity + Number(t.dataset.change)); persist(); render(); }
  if (t.dataset.remove) { state.cart = state.cart.filter(i => i.id !== Number(t.dataset.remove) || i.size !== t.dataset.size); persist(); render(); }
  if (t.hasAttribute("data-reset-filters")) { state.filterSize = ""; state.color = ""; state.maxPrice = 3000; render(); }
  if (t.dataset.authMode) { state.authMode = t.dataset.authMode; render(); }
});

document.addEventListener("change", e => {
  if (e.target.name === "size") { state.filterSize = e.target.checked ? e.target.value : ""; render(); }
  if (e.target.id === "color-filter") { state.color = e.target.value; render(); }
  if (e.target.id === "price-filter") { state.maxPrice = Number(e.target.value); render(); }
  if (e.target.id === "sort-filter") { state.sort = e.target.value; render(); }
});

document.addEventListener("input", e => {
  if (e.target.id === "price-filter") { state.maxPrice = Number(e.target.value); e.target.closest(".filter-group").querySelector("legend").textContent = `Max price: ${money(state.maxPrice)}`; }
  if (e.target.id === "phone") e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
  if (e.target.id === "pin") e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
});

document.addEventListener("submit", e => {
  if (e.target.id === "coupon-form") {
    e.preventDefault();
    const code = new FormData(e.target).get("coupon").trim().toUpperCase();
    state.coupon = code === "STYLE10" ? code : "";
    state.couponMessage = code === "STYLE10" ? "10% discount applied." : (code ? "That coupon code isn't valid." : "Enter a coupon code.");
    render();
  }
  if (e.target.id === "checkout-form") {
    e.preventDefault();
    let valid = true;
    for (const input of e.target.querySelectorAll("input")) {
      let msg = "";
      if (!input.value.trim()) msg = "This field is required.";
      else if (input.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) msg = "Enter a valid email address.";
      else if (input.name === "phone" && !/^\d{10}$/.test(input.value)) msg = "Enter a 10-digit phone number.";
      else if (input.name === "pin" && !/^\d{6}$/.test(input.value)) msg = "Enter a 6-digit PIN code.";
      input.nextElementSibling.textContent = msg;
      if (msg) valid = false;
    }
    const status = document.querySelector("#checkout-message");
    if (!valid) { status.textContent = "Please check the highlighted details."; e.target.querySelector(".form-error:not(:empty)")?.previousElementSibling.focus(); return; }
    state.cart = []; state.coupon = ""; state.page = "confirmation"; persist(); render();
  }
  if (e.target.id === "auth-form") {
    e.preventDefault();
    document.querySelector("#auth-message").textContent = state.authMode === "register" ? "Account created for this demo." : "You’re signed in for this demo.";
  }
});

render();
