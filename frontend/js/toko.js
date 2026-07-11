// JS/toko.js - Handle produk statis untuk backward compatibility
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
// Fungsi untuk menambah produk ke keranjang
function addToCart(id, name, price, image) {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  // Ambil data produk dari API untuk eco points
  fetch(`${API_PRODUCTS}/${id}`)
    .then(res => res.json())
    .then(data => {
      const product = data.product;
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ 
          id, name, price, image, qty: 1, 
          ecoPoints: product.eco_points || 0, 
          carbonSaved: product.carbon_saved || 0 
        });
      }
      saveCart(cart);
      updateCartCount();
      showToast(name, product.eco_points || 0);
    })
    .catch(err => {
      console.error('API tidak tersedia, menggunakan default eco points');
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id, name, price, image, qty: 1, ecoPoints: 100, carbonSaved: 1.0 });
      }
      saveCart(cart);
      updateCartCount();
      showToast(name, 100);
    });
}
// Fungsi untuk menampilkan toast
function showToast(name, ecoPoints) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerHTML = `🛒 "${name}" ditambahkan!<br><span class="text-emerald-400 text-xs">+${ecoPoints} Eco-Points</span>`;
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4');
    }, 2500);
  }
}
// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});
