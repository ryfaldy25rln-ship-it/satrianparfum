// sample product data
const sampleProducts = [
  { id: 'p1', name: 'Noir Intense', price: 250000, img: "image20.png", desc: 'Aroma oriental woody, tahan lama.' },
  { id: 'p2', name: 'Rose Velvet', price: 190000, img: "image21.png", desc: 'Segar floral, cocok untuk siang hari.' },
  { id: 'p3', name: 'Citrus Spark', price: 150000, img: 'image22.png', desc: 'Aroma citrus fresh, ringan.' },
  { id: 'p4', name: 'Midnight Oud', price: 320000, img: "image33.png", desc: 'Eksotis, kaya woody oud.' },
  { id: 'p5', name: 'Vanilla Bliss', price: 180000, img: 'SASA1.png', desc: 'Manis hangat, cozy.' },
  { id: 'p6', name: 'Ocean Mist', price: 140000, img: 'VANILA2.png', desc: 'Aroma laut segar.' }
];

const productsEl = document.getElementById('products');
const bestEl = document.getElementById('best');

function formatRp(n){
  return 'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function renderProductCard(p){
  const div = document.createElement('div');
  div.className = 'bg-white rounded-lg overflow-hidden shadow-sm';
  div.innerHTML = `
    <img src="${p.img}" alt="${p.name}" class="w-full product-img" />
    <div class="p-4">
      <h4 class="font-semibold">${p.name}</h4>
      <div class="mt-2 flex items-center justify-between">
        <div class="text-purple-600 font-bold">${formatRp(p.price)}</div>
        <div class="flex gap-2">
          <button data-id="${p.id}" class="detailBtn px-3 py-1 border rounded text-sm">Detail</button>
          <button data-id="${p.id}" class="addBtn px-3 py-1 bg-purple-600 text-white rounded text-sm">Beli</button>
        </div>
      </div>
    </div>
  `;
  return div;
}

sampleProducts.forEach((p,i)=>{
  productsEl.appendChild(renderProductCard(p));
  if(i<3) bestEl.appendChild(renderProductCard(p));
});

// Modal
const modal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const modalImg = document.getElementById('modalImg');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const closeModal = document.getElementById('closeModal');
const addToCartModal = document.getElementById('addToCartModal');

document.body.addEventListener('click', (e)=>{
  if(e.target.classList.contains('detailBtn')){
    const id = e.target.dataset.id;
    const p = sampleProducts.find(x=>x.id===id);
    modalTitle.textContent = p.name;
    modalImg.src = p.img;
    modalDesc.textContent = p.desc;
    modalPrice.textContent = formatRp(p.price);
    addToCartModal.dataset.id = p.id;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  if(e.target.classList.contains('addBtn')){
    const id = e.target.dataset.id;
    addToCart(id,1);
  }
});

closeModal.addEventListener('click', ()=>{ modal.classList.add('hidden'); modal.classList.remove('flex'); });
addToCartModal.addEventListener('click', ()=>{ addToCart(addToCartModal.dataset.id,1); modal.classList.add('hidden'); modal.classList.remove('flex'); });

// Cart logic
const cartKey = 'f2_cart_v1';
function getCart(){ return JSON.parse(localStorage.getItem(cartKey) || '[]'); }
function saveCart(c){ localStorage.setItem(cartKey, JSON.stringify(c)); renderCart(); }

function addToCart(id, qty=1){
  const cart = getCart();
  const idx = cart.findIndex(i=>i.id===id);
  if(idx>-1) cart[idx].qty += qty; else cart.push({ id, qty });
  saveCart(cart);
  showToast('Produk ditambahkan ke keranjang');
}

function removeFromCart(id){
  let cart = getCart().filter(i=>i.id!==id);
  saveCart(cart);
}

function renderCart(){
  const cart = getCart();
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cartCount').textContent = cartCount;
  const itemsEl = document.getElementById('cartItems');
  itemsEl.innerHTML = '';
  let total = 0;
  cart.forEach(ci=>{
    const p = sampleProducts.find(x=>x.id===ci.id);
    const row = document.createElement('div');
    row.className='flex items-center gap-2 py-2 border-b';
    row.innerHTML = `
      <img src="${p.img}" class="w-12 h-12 object-cover rounded" />
      <div class="flex-1">
        <div class="text-sm font-semibold">${p.name}</div>
        <div class="text-xs text-gray-500">${formatRp(p.price)} × ${ci.qty}</div>
      </div>
      <div>
        <div class="text-sm font-semibold">${formatRp(p.price * ci.qty)}</div>
        <button data-id="${p.id}" class="removeCart text-xs text-red-500">Hapus</button>
      </div>
    `;
    itemsEl.appendChild(row);
    total += p.price * ci.qty;
  });
  document.getElementById('cartTotal').textContent = formatRp(total);
}

// show cart drawer
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
cartBtn.addEventListener('click', ()=>{ cartDrawer.classList.toggle('hidden'); renderCart(); });

document.body.addEventListener('click', (e)=>{
  if(e.target.classList.contains('removeCart')) removeFromCart(e.target.dataset.id);
});

// quick toast
t.className = 'fixed left-1/2 -translate-x-1/2 bottom-8 bg-black text-white px-4 py-2 rounded shadow z-60';

