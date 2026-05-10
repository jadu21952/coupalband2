
const PRODUCTS = [
  {
    id: 'pulsepair-classic',
    name: 'PulsePair Classic',
    price: 2999,
    oldPrice: 7999,
    save: 5000,
    description: 'A timeless pair of long-distance smart bracelets with instant vibration and soft light alerts.',
    fullDescription: 'PulsePair Classic is designed for couples who want a simple, elegant way to stay emotionally connected. Tap your bracelet and your partner instantly feels a gentle vibration with a soft blinking light through the paired mobile app.',
    colors: ['Midnight Black', 'Rose Gold'],
    features: ['Instant vibration', 'Soft light blink alert', 'App connected pairing', 'Rechargeable battery', 'Gift-ready packaging'],
    images: ['classic-front.png','classic-hand.png','classic-touch.png','classic-light.png','classic-box.png','classic-pair.png']
  },
  {
    id: 'sunmoon-touch-bracelets',
    name: 'Sun & Moon Touch Bracelets',
    price: 1999,
    oldPrice: 5999,
    save: 4000,
    description: 'A symbolic sun and moon touch bracelet set for couples who want elegant gifting and everyday connection.',
    fullDescription: 'Sun & Moon Touch Bracelets blend a premium celestial look with the same signature long-distance touch experience. They are crafted for anniversaries, birthdays, and couples who want meaningful connection across any distance.',
    colors: ['Gold', 'Silver'],
    features: ['Instant vibration', 'Soft light blink alert', 'App connected pairing', 'Rechargeable battery', 'Premium celestial finish'],
    images: ['sunmoon-front.png','sunmoon-hand.png','sunmoon-touch.png','sunmoon-light.png','sunmoon-box.png','sunmoon-pair.png']
  },
  {
    id: 'heartbeat-touch-bracelets',
    name: 'HEARTBEAT touch bracelets',
    price: 1999,
    oldPrice: 5999,
    save: 4000,
    description: 'A bold heartbeat-inspired bracelet set with a sleek darker finish and the same loving touch experience.',
    fullDescription: 'HEARTBEAT touch bracelets are made for couples who want a private heartbeat-style connection through vibration and blinking light, wrapped in a modern premium design.',
    colors: ['Midnight Black', 'Graphite'],
    features: ['Instant vibration', 'Soft light blink alert', 'App connected pairing', 'Rechargeable battery', 'Sleek matte finish'],
    images: ['heartbeat-front.png','heartbeat-hand.png','heartbeat-touch.png','heartbeat-light.png','heartbeat-box.png','heartbeat-pair.png']
  }
];

function getCart(){ return JSON.parse(localStorage.getItem('pulsepair_cart') || '[]'); }
function saveCart(cart){ localStorage.setItem('pulsepair_cart', JSON.stringify(cart)); updateCartBadge(); }
function updateCartBadge(){ const total = getCart().reduce((a,b)=>a+b.quantity,0); document.querySelectorAll('#cartCountHeader').forEach(el=>el.textContent=String(total)); }
function rupee(v){ return '₹' + Number(v).toLocaleString('en-IN'); }
function productById(id){ return PRODUCTS.find(p=>p.id===id); }
function addToCart(id){ const cart = getCart(); const existing = cart.find(i=>i.id===id); if(existing){ existing.quantity += 1; } else { cart.push({id, quantity:1}); } saveCart(cart); alert('Added to cart'); }

function renderHome(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  const input = document.getElementById('searchInput');
  const draw = () => {
    const q = (input?.value || '').trim().toLowerCase();
    const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    grid.innerHTML = filtered.map(p => `
      <article class="product-card">
        <a href="product.html?id=${p.id}" class="img-wrap"><img src="${p.images[0]}" alt="${p.name}" /></a>
        <div class="product-card-content">
          <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <p class="desc">${p.description}</p>
          <div class="price-row">
            <span class="new-price">${rupee(p.price)}</span>
            <span class="old-price">${rupee(p.oldPrice)}</span>
            <span class="save">Save ${rupee(p.save)}</span>
          </div>
          <div class="product-card-actions">
            <button class="btn btn-secondary" data-add="${p.id}">Add to Cart</button>
            <a href="product.html?id=${p.id}" class="btn btn-primary">Buy Now</a>
          </div>
        </div>
      </article>
    `).join('');
    document.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', ()=> addToCart(btn.dataset.add)));
  };
  draw();
  if(input) input.addEventListener('input', draw);
}

function renderProduct(){
  const target = document.getElementById('productDetail');
  if(!target) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const p = productById(id);
  if(!p){ target.innerHTML = '<div class="empty">Product not found.</div>'; return; }
  target.innerHTML = `
    <div class="product-detail-grid">
      <div>
        <div class="product-gallery-main"><img id="mainProductImage" src="${p.images[0]}" alt="${p.name}" /></div>
        <div class="thumb-grid">
          ${p.images.map(img => `<button class="thumb" data-img="${img}"><img src="${img}" alt="${p.name}" /></button>`).join('')}
        </div>
      </div>
      <div class="product-meta">
        <p class="eyebrow">Premium Couple Bracelet</p>
        <h1>${p.name}</h1>
        <div class="price-row">
          <span class="new-price">${rupee(p.price)}</span>
          <span class="old-price">${rupee(p.oldPrice)}</span>
          <span class="save">Save ${rupee(p.save)}</span>
        </div>
        <p class="desc">${p.description}</p>
        <p>${p.fullDescription}</p>
        <div class="meta-list">
          <div><strong>Colors:</strong> ${p.colors.join(', ')}</div>
          <div><strong>Features:</strong> ${p.features.join(', ')}</div>
        </div>
        <div class="product-card-actions">
          <button class="btn btn-secondary" id="addSingleToCart">Add to Cart</button>
          <a href="checkout.html?buy=${p.id}" class="btn btn-primary">Buy Now</a>
        </div>
      </div>
    </div>`;
  document.getElementById('addSingleToCart').addEventListener('click', ()=> addToCart(p.id));
  document.querySelectorAll('[data-img]').forEach(btn => btn.addEventListener('click', ()=> {
    document.getElementById('mainProductImage').src = btn.dataset.img;
  }));
}

function renderCart(){
  const target = document.getElementById('cartPage');
  if(!target) return;
  const cart = getCart();
  if(!cart.length){ target.innerHTML = '<div class="empty">Your cart is empty. <a href="index.html#shop">Continue shopping</a></div>'; return; }
  let total = 0;
  target.innerHTML = cart.map(item => {
    const p = productById(item.id);
    if(!p) return '';
    const line = p.price * item.quantity;
    total += line;
    return `
      <div class="cart-row">
        <img src="${p.images[0]}" alt="${p.name}" width="100" height="100" />
        <div>
          <h3>${p.name}</h3>
          <div class="price-row"><span class="new-price">${rupee(p.price)}</span><span class="old-price">${rupee(p.oldPrice)}</span></div>
        </div>
        <div>
          <div class="qty-box">
            <button data-minus="${p.id}">-</button>
            <strong>${item.quantity}</strong>
            <button data-plus="${p.id}">+</button>
          </div>
          <p><strong>${rupee(line)}</strong></p>
        </div>
      </div>`;
  }).join('') + `
    <div class="cart-actions">
      <a class="btn btn-secondary" href="index.html#shop">Continue Shopping</a>
      <div class="summary-card"><strong>Total: ${rupee(total)}</strong><div style="margin-top:12px"><a class="btn btn-primary" href="checkout.html">Proceed to Checkout</a></div></div>
    </div>`;
  document.querySelectorAll('[data-plus]').forEach(btn => btn.addEventListener('click', ()=> changeQty(btn.dataset.plus, 1)));
  document.querySelectorAll('[data-minus]').forEach(btn => btn.addEventListener('click', ()=> changeQty(btn.dataset.minus, -1)));
}
function changeQty(id, delta){
  let cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.quantity += delta;
  cart = cart.filter(i=>i.quantity>0);
  saveCart(cart);
  renderCart();
}

function getCheckoutItems(){
  const params = new URLSearchParams(location.search);
  const buy = params.get('buy');
  if(buy){ return [{id:buy, quantity:1}]; }
  return getCart();
}

function renderCheckout(){
  const summary = document.getElementById('checkoutSummary');
  const form = document.getElementById('checkoutForm');
  if(!summary || !form) return;
  const items = getCheckoutItems();
  if(!items.length){ summary.innerHTML = '<div class="empty">No items selected.</div>'; return; }
  let total = 0;
  summary.innerHTML = '<h3>Order Summary</h3>' + items.map(item => {
    const p = productById(item.id); if(!p) return '';
    total += p.price * item.quantity;
    return `<div style="display:flex;gap:12px;margin:14px 0;align-items:center"><img src="${p.images[0]}" alt="${p.name}" width="72" height="72" style="border-radius:12px"><div><strong>${p.name}</strong><div>${item.quantity} × ${rupee(p.price)}</div></div></div>`;
  }).join('') + `<hr><div class="price-row"><span class="new-price">Total ${rupee(total)}</span></div>`;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const order = {
      orderId: 'PP' + Date.now().toString().slice(-8),
      customer: Object.fromEntries(fd.entries()),
      items,
      total,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('pulsepair_last_order', JSON.stringify(order));
    if(!new URLSearchParams(location.search).get('buy')) saveCart([]);
    location.href = 'success.html';
  });
}

function renderSuccess(){
  const box = document.getElementById('successBox');
  if(!box) return;
  const order = JSON.parse(localStorage.getItem('pulsepair_last_order') || 'null');
  if(!order){ box.innerHTML = '<div class="empty">No recent order found.</div>'; return; }
  box.innerHTML = `
    <p class="eyebrow">Order Confirmed</p>
    <h1>Thank You For Your Order</h1>
    <p>Your order has been placed successfully.</p>
    <div class="summary-card" style="text-align:left;margin-top:18px">
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>Name:</strong> ${order.customer.name || ''}</p>
      <p><strong>Phone:</strong> ${order.customer.phone || ''}</p>
      <p><strong>Total:</strong> ${rupee(order.total)}</p>
    </div>
    <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a class="btn btn-primary" href="index.html">Back to Home</a>
      <a class="btn btn-secondary" href="index.html#shop">Continue Shopping</a>
    </div>`;
}

document.addEventListener('DOMContentLoaded', ()=>{
  updateCartBadge();
  renderHome();
  renderProduct();
  renderCart();
  renderCheckout();
  renderSuccess();
});
