// JS/toko.js

// Fungsi untuk mengambil data keranjang dari Local Storage
function getCart() {
  return JSON.parse(localStorage.getItem('ecostore_cart') || '[]');
}

// Fungsi untuk menyimpan data keranjang ke Local Storage
function saveCart(cart) {
  localStorage.setItem('ecostore_cart', JSON.stringify(cart));
}

// Fungsi untuk mengupdate angka merah (badge) di ikon keranjang navbar
function updateCartCount() {
  const cart = getCart();
  // Menjumlahkan total qty (kuantitas) semua barang di keranjang
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-count');
  
  if (total > 0) {
    badge.textContent = total;
    badge.classList.remove('hidden'); // Tampilkan badge
  } else {
    badge.classList.add('hidden'); // Sembunyikan jika kosong
  }
}

// Fungsi utama yang dipanggil saat tombol "Tambah ke Keranjang" diklik
function addToCart(id, name, price, image) {
  const cart = getCart();
  
  // Cek apakah barang tersebut sudah pernah dimasukkan ke keranjang sebelumnya
  const existing = cart.find(item => item.id === id);
  
  if (existing) {
    existing.qty += 1; // Jika sudah ada, cukup tambah kuantitasnya saja
  } else {
    // Jika belum ada, masukkan sebagai data barang baru dengan qty 1
    cart.push({ id, name, price, image, qty: 1 });
  }
  
  saveCart(cart); // Simpan perubahan ke Local Storage
  updateCartCount(); // Perbarui angka di ikon keranjang

  // --- Animasi Toast Notifikasi ---
  const toast = document.getElementById('toast');
  toast.textContent = `"${name}" ditambahkan ke keranjang!`;
  
  // Munculkan toast dengan menghapus class transparan dan memindahkannya ke atas
  toast.classList.remove('opacity-0', 'translate-y-4');
  toast.classList.add('opacity-100', 'translate-y-0');
  
  // Setel timer: hilangkan toast kembali setelah 2.5 detik (2500 milidetik)
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-4');
  }, 2500);
}

// Inisialisasi: Periksa dan tampilkan jumlah keranjang saat halaman baru selesai dimuat
document.addEventListener('DOMContentLoaded', updateCartCount);