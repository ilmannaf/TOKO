function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function getCart() {
  return JSON.parse(localStorage.getItem('ecostore_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('ecostore_cart', JSON.stringify(cart));
}

function renderCart() {
  var cart = getCart();
  var emptyState = document.getElementById('empty-state');
  var cartContainer = document.getElementById('cart-container');
  var cartItemsEl = document.getElementById('cart-items');

  if (cart.length === 0) {
    emptyState.classList.remove('hidden');
    emptyState.style.display = 'flex';
    cartContainer.classList.add('hidden');
    cartContainer.classList.remove('lg:grid');
    return;
  }

  emptyState.classList.add('hidden');
  emptyState.style.display = 'none';
  cartContainer.classList.remove('hidden');
  cartContainer.classList.add('lg:grid');
  cartItemsEl.innerHTML = '';

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var el = document.createElement('div');
    el.className = 'nb-card';
    el.style.cssText = 'padding:1rem;display:flex;align-items:center;gap:1rem;';
    el.innerHTML = '<div style="width:80px;height:80px;overflow:hidden;border:4px solid #000;flex-shrink:0;">'
      + '<img src="' + item.image + '" alt="' + item.name + '" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.src=\'https://placehold.co/200x200?text=Error\'" />'
      + '</div>'
      + '<div style="flex:1;min-width:0;">'
        + '<h3 style="font-weight:900;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:0;">' + item.name + '</h3>'
        + '<p style="font-weight:700;font-size:0.875rem;margin-top:4px;">' + formatRupiah(item.price) + '</p>'
        + '<div style="display:flex;align-items:center;gap:8px;margin-top:12px;">'
          + '<button onclick="changeQty(' + item.id + ', -1)" style="border:4px solid #000;background:#fff;padding:4px 12px;font-weight:900;cursor:pointer;box-shadow:4px 4px 0 0 rgba(0,0,0,1);font-family:inherit;font-size:1rem;line-height:1;">−</button>'
          + '<span style="width:32px;text-align:center;font-weight:900;">' + item.qty + '</span>'
          + '<button onclick="changeQty(' + item.id + ', 1)" style="border:4px solid #000;background:#fff;padding:4px 12px;font-weight:900;cursor:pointer;box-shadow:4px 4px 0 0 rgba(0,0,0,1);font-family:inherit;font-size:1rem;line-height:1;">+</button>'
        + '</div>'
      + '</div>'
      + '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:12px;flex-shrink:0;">'
        + '<p style="font-weight:900;margin:0;">' + formatRupiah(item.price * item.qty) + '</p>'
        + '<button onclick="removeItem(' + item.id + ')" style="border:4px solid #000;background:#FF6B9D;color:#fff;padding:4px 12px;font-weight:900;cursor:pointer;box-shadow:4px 4px 0 0 rgba(0,0,0,1);font-family:inherit;font-size:0.875rem;line-height:1;">✕</button>'
      + '</div>';
    cartItemsEl.appendChild(el);
  }

  var totalQty = cart.reduce(function(s, i) { return s + i.qty; }, 0);
  var totalPrice = cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
  document.getElementById('summary-count').textContent = totalQty;
  document.getElementById('summary-subtotal').textContent = formatRupiah(totalPrice);
  document.getElementById('summary-total').textContent = formatRupiah(totalPrice);
}

function changeQty(id, delta) {
  var cart = getCart();
  var item = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) { item = cart[i]; break; }
  }
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart.splice(cart.indexOf(item), 1);
  }
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  var cart = getCart().filter(function(i) { return i.id !== id; });
  saveCart(cart);
  renderCart();
}

function clearCart() {
  if (confirm('Yakin ingin mengosongkan keranjang?')) {
    saveCart([]);
    renderCart();
  }
}

function checkout() {
  var cart = getCart();
  if (cart.length === 0) return;
  window.location.href = 'Checkout.html';
}

function closeModal() {
  saveCart([]);
  document.getElementById('checkout-modal').classList.add('hidden');
  document.getElementById('checkout-modal').classList.remove('flex');
  window.location.href = 'toko.html';
}

renderCart();
