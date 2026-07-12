document.addEventListener("DOMContentLoaded", function () {
  var promoBanner = document.querySelector(".bg-indigo-600");
  if (promoBanner && promoBanner.tagName.toLowerCase() !== "footer" && promoBanner.tagName.toLowerCase() !== "a") {
    var promoText = promoBanner.querySelector("p");
    if (promoText) {
      var closeBtn = document.createElement("span");
      closeBtn.innerHTML = " &times;";
      closeBtn.style.cssText = "cursor:pointer;margin-left:1rem;font-weight:900;font-size:1.25rem;";
      closeBtn.title = "Tutup promo";
      promoText.appendChild(closeBtn);
      closeBtn.addEventListener("click", function () {
        promoBanner.style.transition = "opacity 0.3s ease";
        promoBanner.style.opacity = "0";
        setTimeout(function () { promoBanner.style.display = "none"; }, 300);
      });
    }
  }

  var userName = "ECO";
  var ecoData = JSON.parse(localStorage.getItem("ecoData"));
  if (!ecoData) {
    ecoData = { points: 0, carbon: 0, xp: 0, level: 1, nextLevelXp: 500 };
    localStorage.setItem("ecoData", JSON.stringify(ecoData));
  }

  function renderEcoDashboard() {
    var treeEmojiEl = document.getElementById("tree-emoji");
    var treeLevelTextEl = document.getElementById("tree-level-text");
    var xpBarEl = document.getElementById("xp-bar");
    var xpTextEl = document.getElementById("xp-text");
    var totalPointsEl = document.getElementById("total-points");
    var carbonSavedEl = document.getElementById("carbon-saved");
    var historyList = document.getElementById("eco-history");

    if (treeEmojiEl && totalPointsEl) {
      var emoji = "🌱", sebutan = "Tunas Harapan";
      if (ecoData.level === 2) { emoji = "🌿"; sebutan = "Bibit Muda"; }
      else if (ecoData.level === 3) { emoji = "🪴"; sebutan = "Tanaman Hijau"; }
      else if (ecoData.level === 4) { emoji = "🌲"; sebutan = "Pohon Rindang"; }
      else if (ecoData.level >= 5) { emoji = "🌳"; sebutan = "Pohon Kehidupan"; }

      var xpPct = Math.min(100, (ecoData.xp / ecoData.nextLevelXp) * 100);
      treeEmojiEl.textContent = emoji;
      treeLevelTextEl.textContent = "Level " + ecoData.level + ": " + sebutan + " milik " + userName;
      xpBarEl.style.width = xpPct + "%";
      xpTextEl.textContent = ecoData.xp + " / " + ecoData.nextLevelXp + " XP menuju Level " + (ecoData.level + 1);
      totalPointsEl.textContent = Number(ecoData.points).toLocaleString("id-ID") + " Pts";
      carbonSavedEl.textContent = Number(ecoData.carbon).toFixed(1);
    }

    // Render history dari localStorage
    if (historyList) {
      var history = JSON.parse(localStorage.getItem("ecoHistory") || "[]");
      if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align:center;font-weight:700;color:#999;padding:1rem;">Belum ada aktivitas eco. Mulai belanja! 🛒</p>';
      } else {
        var h = '';
        for (var i = Math.max(0, history.length - 10); i < history.length; i++) {
          var entry = history[i];
          h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:2px solid #000;font-size:0.875rem;">'
            + '<div><span style="font-weight:900;">+' + entry.points + '</span> Pts <span style="opacity:0.5;">•</span> '
            + '<span style="font-weight:700;">+' + entry.carbon.toFixed(1) + 'kg CO₂</span>'
            + '<p style="font-size:0.7rem;opacity:0.5;font-weight:600;margin-top:2px;">' + entry.product + ' — ' + new Date(entry.date).toLocaleDateString("id-ID") + '</p>'
            + '</div>'
            + '<span style="font-size:1.25rem;">' + (entry.carbon > 1 ? '🌿' : '🌱') + '</span>'
          + '</div>';
        }
        historyList.innerHTML = h;
      }
    }
  }

  renderEcoDashboard();
});
