const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Glass Water Bottle', cat: 'Hydration', price: 24.99, icon: '💧', desc: 'Minimal reusable bottle with a clean silhouette and everyday carry feel.' },
  { id: 2, name: 'Desk Lamp', cat: 'Workspace', price: 79.99, icon: '💡', desc: 'Compact ambient desk lamp with a soft matte finish for home or studio.' },
  { id: 3, name: 'Canvas Tote', cat: 'Carry', price: 28.99, icon: '👜', desc: 'Structured tote for daily errands, books, and lightweight essentials.' },
  { id: 4, name: 'Soft Hoodie', cat: 'Apparel', price: 58.00, icon: '🧥', desc: 'Heavyweight hoodie with a clean premium look and relaxed fit.' },
  { id: 5, name: 'Ceramic Mug', cat: 'Kitchen', price: 19.50, icon: '☕', desc: 'Simple stoneware mug designed for a clean shelf and daily use.' },
  { id: 6, name: 'Notebook Set', cat: 'Workspace', price: 18.00, icon: '📓', desc: 'Minimal lined notebooks for planning, sketching, or note capture.' }
];

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const state = {
  products: loadProducts(),
  cart: JSON.parse(localStorage.getItem('store_cart') || '[]')
};

function loadProducts() {
  return JSON.parse(localStorage.getItem('store_products') || JSON.stringify(DEFAULT_PRODUCTS));
}
function saveProducts() {
  localStorage.setItem('store_products', JSON.stringify(state.products));
}
function saveCart() {
  localStorage.setItem('store_cart', JSON.stringify(state.cart));
}
function money(v) { return `$${v.toFixed(2)}`; }

window.showPage = function(name) {
  $$('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${name}`);
  if (page) page.classList.add('active');
  $$('.nav-links button').forEach(b => b.classList.remove('active'));
  const nav = document.getElementById(`nav-${name}`);
  if (nav) nav.classList.add('active');
  window.scrollTo(0,0);
}

function productCard(p) {
  return `<div class="product-card">
    <div class="product-img-wrap">${p.icon}</div>
    <div class="product-body">
      <div class="product-cat">${p.cat}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-footer">
        <div class="product-price">${money(p.price)}</div>
        <button class="add-btn" data-add="${p.id}">Add to Cart</button>
      </div>
    </div>
  </div>`;
}

function renderProducts() {
  const featured = $('#featured-grid');
  const all = $('#all-products-grid');
  if (featured) featured.innerHTML = state.products.slice(0,4).map(productCard).join('');
  if (all) all.innerHTML = state.products.map(productCard).join('');
  $$('[data-add]').forEach(btn => btn.onclick = () => addToCart(Number(btn.dataset.add)));
}

function addToCart(id) {
  const found = state.cart.find(i => i.id === id);
  if (found) found.qty += 1;
  else {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    state.cart.push({ id: p.id, qty: 1 });
  }
  saveCart();
  renderCart();
  toast('Added to cart');
}
window.openCart = function(){ $('#cart-sidebar')?.classList.add('open'); $('#overlay')?.classList.add('open'); }
window.closeCart = function(){ $('#cart-sidebar')?.classList.remove('open'); $('#overlay')?.classList.remove('open'); }

function cartDetails() {
  return state.cart.map(item => ({ ...state.products.find(p => p.id === item.id), qty: item.qty })).filter(Boolean);
}
function updateQty(id, delta) {
  const item = state.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) state.cart = state.cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}
window.updateQty = updateQty;

function renderCart() {
  const badge = $('#cart-badge');
  const count = state.cart.reduce((s,i)=>s+i.qty,0);
  if (badge) badge.textContent = count;
  const items = cartDetails();
  const sub = items.reduce((s,i)=>s+i.price*i.qty,0);
  const shipping = items.length ? 8.95 : 0;
  const cartItems = $('#cart-items');
  if (cartItems) {
    cartItems.innerHTML = items.length ? items.map(item => `
      <div class="cart-item">
        <div style="font-size:28px">${item.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-sub">${money(item.price)} each</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id},1)">+</button>
        </div>
      </div>`).join('') : '<div class="muted">Your cart is empty.</div>';
  }
  if ($('#cart-subtotal')) $('#cart-subtotal').textContent = money(sub);
  if ($('#cart-total')) $('#cart-total').textContent = money(sub + shipping);
}

function toast(msg){ const t=$('#toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200); }
window.toast = toast;

function bindGeneral() {
  renderProducts();
  renderCart();
  $('#year') && ($('#year').textContent = new Date().getFullYear());
}

document.addEventListener('DOMContentLoaded', bindGeneral);
