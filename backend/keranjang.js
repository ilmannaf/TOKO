// JS/keranjang.js

// Fungsi untuk format angka menjadi format Rupiah
function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

// Fungsi untuk mengambil data keranjang dari Local Storage browser
function getCart() {
  return JSON.parse(localStorage.getItem("ecostore_cart") || "[]");
}

// Fungsi untuk menyimpan perubahan data keranjang ke Local Storage
function saveCart(cart) {
  localStorage.setItem("ecostore_cart", JSON.stringify(cart));
}

// Fungsi utama untuk me-render (menampilkan) isi keranjang ke layar
function renderCart() {
  const cart = getCart();
  const emptyState = document.getElementById("empty-state");
  const cartContainer = document.getElementById("cart-container");
  const cartItemsEl = document.getElementById("cart-items");

  // Jika keranjang kosong
  if (cart.length === 0) {
    emptyState.classList.remove("hidden");
    emptyState.classList.add("flex");
    cartContainer.classList.add("hidden");
    cartContainer.classList.remove("lg:grid");
    return;
  }

  // Jika keranjang ada isinya
  emptyState.classList.add("hidden");
  emptyState.classList.remove("flex");
  cartContainer.classList.remove("hidden");
  cartContainer.classList.add("lg:grid");

  // Kosongkan kontainer sebelum diisi ulang
  cartItemsEl.innerHTML = "";

  // Looping (perulangan) untuk menampilkan setiap barang di keranjang
  cart.forEach((item) => {
    const el = document.createElement("div");
    el.className =
      "item-enter bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4";
    el.innerHTML = `
      <img src="${item.image}" alt="${item.name}"
        class="h-20 w-20 rounded-xl object-cover flex-shrink-0 bg-gray-100" />
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-800 truncate">${item.name}</h3>
        <p class="text-indigo-600 font-medium text-sm mt-0.5">${formatRupiah(item.price)}</p>
        <div class="flex items-center gap-2 mt-3">
          <button onclick="changeQty(${item.id}, -1)"
            class="h-7 w-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition font-bold text-lg leading-none">−</button>
          <span class="w-8 text-center font-semibold text-gray-800">${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)"
            class="h-7 w-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 transition font-bold text-lg leading-none">+</button>
        </div>
      </div>
      <div class="flex flex-col items-end gap-3 flex-shrink-0">
        <p class="font-bold text-gray-900">${formatRupiah(item.price * item.qty)}</p>
        <button onclick="removeItem(${item.id})"
          class="text-gray-300 hover:text-red-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    `;
    cartItemsEl.appendChild(el);
  });

  // Update ringkasan harga
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById("summary-count").textContent = totalQty;
  document.getElementById("summary-subtotal").textContent = formatRupiah(totalPrice);
  document.getElementById("summary-total").textContent = formatRupiah(totalPrice);
}

// Fungsi untuk menambah atau mengurangi jumlah barang
function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;

  // Jika jumlah barang jadi 0, hapus dari keranjang
  if (item.qty <= 0) {
    cart.splice(cart.indexOf(item), 1);
  }
  saveCart(cart);
  renderCart();
}

// Fungsi untuk menghapus barang dari keranjang
function removeItem(id) {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  renderCart();
}

// Fungsi untuk mengosongkan semua isi keranjang
function clearCart() {
  if (confirm("Yakin ingin mengosongkan keranjang?")) {
    saveCart([]);
    renderCart();
  }
}

// Fungsi untuk memunculkan pop-up sukses checkout
function checkout() {
  const modal = document.getElementById("checkout-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

// Fungsi untuk menutup pop-up dan kembali ke toko
function closeModal() {
  saveCart([]); // Kosongkan keranjang setelah checkout sukses
  document.getElementById("checkout-modal").classList.add("hidden");
  document.getElementById("checkout-modal").classList.remove("flex");
  window.location.href = "toko.html";
}

// Inisialisasi: Jalankan renderCart saat pertama kali file dimuat
renderCart();
