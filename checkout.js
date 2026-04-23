let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Ongkir
const ongkirData = {
  BogorKab: 10000,
  BogorKot: 15000,
  Depok: 20000
};

// Agar penulisan Rp ada "." dan ",-"
function formatRupiah(angka) {
  return Number(angka).toLocaleString("id-ID")+",-";
}

const cartList = document.getElementById("cart-list");
const subtotalEl = document.getElementById("subtotal");
const ongkirEl = document.getElementById("ongkir");
const totalEl = document.getElementById("total");
const kotaSelect = document.getElementById("kota");
const promoInfo = document.getElementById("promo-info");

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");

// Render cart
function renderCart() {
  if (!cartList) return;

  cartList.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    const totalItem = item.price * item.qty;
    subtotal += totalItem;

    cartList.innerHTML += `
      <li class="list-group-item d-flex justify-content-between">
        ${item.name} (${item.qty})
        <span>Rp ${formatRupiah(totalItem)}</span>
      </li>
    `;
  });

  subtotalEl.textContent = formatRupiah(subtotal);
  subtotalEl.dataset.value = subtotal;

  hitungTotal();
}

// Logika jumlah total
function hitungTotal() {
  const kota = kotaSelect.value;
  let ongkir = ongkirData[kota] || 0;
  const subtotal = parseInt(subtotalEl.dataset.value) || 0;

  if (subtotal >= 75000) {
    ongkir = 0;
    ongkirEl.innerHTML = `<span class="text-success fw-bold">Gratis</span>`;

    if (promoInfo) {
      promoInfo.innerHTML = `<span class="text-success">🎉 Selamat! Anda Mendapatkan Gratis Ongkir</span>`;
    }
  } else {
    ongkirEl.textContent = formatRupiah(ongkir);

    const kurang = 75000 - subtotal;

    if (promoInfo) {
      promoInfo.innerHTML = `
        Belanja lagi Rp <b>${formatRupiah(kurang)}</b> untuk 
        <span class="text-success fw-bold">Gratis Ongkir</span>
      `;
    }
  }

  totalEl.textContent = formatRupiah(subtotal + ongkir);
}

// Select kota
if (kotaSelect) {
  kotaSelect.addEventListener("change", hitungTotal);
}

// Prsanan Redirect ke WA
function checkoutWA() {
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  const nama = document.getElementById("nama").value;
  const alamat = document.getElementById("alamat").value;
  const kota = kotaSelect.value;

  if (!nama || !alamat || !kota) {
    alert("Lengkapi data dulu!");
    return;
  }

  let pesan = `Halo MamangFresh, saya ingin order:\n\n`;
  let subtotal = 0;

  cart.forEach(item => {
    const totalItem = item.price * item.qty;
    subtotal += totalItem;

    pesan += `- ${item.name} (${item.qty}) = Rp ${formatRupiah(totalItem)}\n`;
  });

  let ongkir = ongkirData[kota] || 0;

  if (subtotal >= 75000) {
    ongkir = 0;
  }

  const total = subtotal + ongkir;

  pesan += `\nSubtotal: Rp ${formatRupiah(subtotal)}`;
  pesan += `\nOngkir: Rp ${formatRupiah(ongkir)}`;
  pesan += `\nTotal: Rp ${formatRupiah(total)}`;

  pesan += `\n\nNama: ${nama}`;
  pesan += `\nAlamat: ${alamat}`;
  pesan += `\nKota: ${kota}`;

  const url = `https://wa.me/6285133012443?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");

  localStorage.removeItem("cart");
}

// Data Product
const products = [
  { id: 1, name: "Tomat Segar", price: 10000, image: "images/tomat.jpg" },
  { id: 2, name: "Wortel Organik", price: 8000, image: "images/wortel.jpg" },
  { id: 3, name: "Bayam Hijau", price: 5000, image: "images/bayam.jpg" }
];

// Get Quantity
function getQty(id) {
  const item = cart.find(i => i.id === id);
  return item ? item.qty : 0;
}

// Tambah product
function increase(id) {
  const product = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveAndRender();
}

// Kurang product
function decrease(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty--;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveAndRender();
}

// Simpan dan Refresh
function saveAndRender() {
  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
  renderProducts();
  updateCartCount();
}

// Render produk
function renderProducts() {
  if (!productList) return;

  productList.innerHTML = "";

  products.forEach(p => {
    const qty = getQty(p.id);

    productList.innerHTML += `
      <div class="col-md-4">
        <div class="card p-3 text-center">
          <img src="${p.image}" class="product-img mb-2">
          <h6>${p.name}</h6>
          <p class="text-success fw-bold">Rp ${formatRupiah(p.price)}</p>

          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-sm btn-danger" onclick="decrease(${p.id})">-</button>
            <span>${qty}</span>
            <button class="btn btn-sm btn-success" onclick="increase(${p.id})">+</button>
          </div>
        </div>
      </div>
    `;
  });
}

// Update Item yang di cart
function updateCartCount() {
  if (!cartCount) return;

  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = total;
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  cart = JSON.parse(localStorage.getItem("cart")) || [];

  renderCart();
  renderProducts();
  updateCartCount();
});