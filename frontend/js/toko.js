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

function addEcoHistory(productName, points, carbon) {
  var ecoData = JSON.parse(localStorage.getItem('ecoData') || '{"points":0,"carbon":0,"xp":0,"level":1,"nextLevelXp":500}');
  ecoData.points += points;
  ecoData.carbon += carbon;
  ecoData.xp += points;

  // Level up logic
  while (ecoData.xp >= ecoData.nextLevelXp) {
    ecoData.xp -= ecoData.nextLevelXp;
    ecoData.level += 1;
    ecoData.nextLevelXp = Math.floor(ecoData.nextLevelXp * 1.5);
  }

  localStorage.setItem('ecoData', JSON.stringify(ecoData));

  var history = JSON.parse(localStorage.getItem('ecoHistory') || '[]');
  history.push({ product: productName, points: points, carbon: carbon, date: new Date().toISOString() });
  localStorage.setItem('ecoHistory', JSON.stringify(history));
}

function addToCart(id, name, price, image) {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);

  fetch(API_BASE_URL + '/api/products/' + id)
    .then(res => res.json())
    .then(data => {
      const product = data.product;
      var ecoPts = product.eco_points || 0;
      var carbonSv = parseFloat(product.carbon_saved) || 0;

      if (existing) {
        existing.qty += 1;
        // Add eco for each additional qty
        addEcoHistory(name, ecoPts, carbonSv);
      } else {
        cart.push({ id, name, price, image, qty: 1, ecoPoints: ecoPts, carbonSaved: carbonSv });
        addEcoHistory(name, ecoPts, carbonSv);
      }
      saveCart(cart);
      updateCartCount();
      showToast(name, ecoPts);
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

function showToast(name, ecoPoints) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerHTML = '🛒 "' + name + '" ditambahkan!<br><span style="color:#34d399;font-size:0.75rem;font-weight:700;">+' + ecoPoints + ' Eco-Points 🌱</span>';
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    setTimeout(function() {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4');
    }, 2500);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
});
