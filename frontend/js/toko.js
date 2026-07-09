// JS/toko.js

// Database statis untuk nilai Eco-Points & Karbon tiap produk
// ID produk disesuaikan dengan urutan di toko.html
const ECO_ATTRIBUTES = {
  1: { points: 150, carbon: 1.5 }, // Kaos Basic (Kategori: Katun organik)
  2: { points: 100, carbon: 1.0 }, // Kemeja Casual
  3: { points: 250, carbon: 2.5 }, // Celana Denim (Daur ulang)
  4: { points: 120, carbon: 1.2 }, // Sepatu Sneakers
  5: { points: 200, carbon: 2.0 }, // Jaket Hoodie
  6: { points: 50,  carbon: 0.5 }, // Topi Baseball
  7: { points: 150, carbon: 1.5 }, // Tas Ransel
  8: { points: 80,  carbon: 0.8 }, // Kacamata Sunglasses
  9: { points: 100, carbon: 1.0 }, // Jam Tangan
  10: { points: 30, carbon: 0.3 }, // Kaos Kaki
  11: { points: 180, carbon: 1.8 }, // Celana Jogger
  12: { points: 70, carbon: 0.7 }  // Sandal Casual
};

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
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  const badgeDesktop = document.getElementById('cart-count');
  const badgeMobile = document.getElementById('cart-count-mobile');
  
  if (total > 0) {
    if(badgeDesktop) { badgeDesktop.textContent = total; badgeDesktop.classList.remove('hidden'); }
    if(badgeMobile) { badgeMobile.textContent = total; badgeMobile.classList.remove('hidden'); }
  } else {
    if(badgeDesktop) badgeDesktop.classList.add('hidden');
    if(badgeMobile) badgeMobile.classList.add('hidden');
  }
}

// Fungsi utama yang dipanggil saat tombol "Tambah ke Keranjang" diklik
function addToCart(id, name, price, image) {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  
  // Ambil atribut eco berdasarkan ID produk, default 0 jika tidak terdaftar
  const eco = ECO_ATTRIBUTES[id] || { points: 0, carbon: 0 };
  
  if (existing) {
    existing.qty += 1;
  } else {
    // Menyimpan atribut ecoPoints dan carbonSaved ke dalam keranjang
    cart.push({ 
      id, name, price, image, qty: 1, 
      ecoPoints: eco.points, 
      carbonSaved: eco.carbon 
    });
  }
  
  saveCart(cart); 
  updateCartCount(); 

  // --- Animasi Toast Notifikasi ---
  const toast = document.getElementById('toast');
  if(toast) {
    // Tampilkan info poin yang didapat di toast
    toast.innerHTML = `🛒 "${name}" ditambahkan!<br><span class="text-emerald-400 text-xs">+${eco.points} Eco-Points</span>`;
    
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    
    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4');
    }, 2500);
  }
}

document.addEventListener('DOMContentLoaded', updateCartCount);