function getCart() {
  return JSON.parse(localStorage.getItem('ecostore_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('ecostore_cart', JSON.stringify(cart));
}

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

function addToCart(id, name, price, image) {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  showToast(name);
}

function showToast(name) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerHTML = '🛒 "' + name + '" ditambahkan!';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(1rem)';
    }, 2500);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
});
