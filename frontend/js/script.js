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

  var ecoData = JSON.parse(localStorage.getItem("ecoData"));
  if (!ecoData) {
    ecoData = { points: 0, carbon: 0 };
    localStorage.setItem("ecoData", JSON.stringify(ecoData));
  }

  function renderEcoDashboard() {
    var totalPointsEl = document.getElementById("total-points");
    var carbonSavedEl = document.getElementById("carbon-saved");
    var historyList = document.getElementById("eco-history");

    if (totalPointsEl) {
      totalPointsEl.textContent = Number(ecoData.points).toLocaleString("id-ID") + " Pts";
      carbonSavedEl.textContent = Number(ecoData.carbon).toFixed(1);
    }

    // Hitung milestone selanjutnya
    var nextMilestone = (Math.floor(ecoData.points / 1000) + 1) * 1000;
    var progressPct = ecoData.points > 0 ? ((ecoData.points % 1000) / 1000 * 100) : 0;
    var milestoneEl = document.getElementById("milestone-progress");
    var milestoneTextEl = document.getElementById("milestone-text");
    if (milestoneEl) {
      milestoneEl.style.width = progressPct + "%";
    }
    if (milestoneTextEl) {
      milestoneTextEl.textContent = ecoData.points + " / " + nextMilestone + " Pts menuju diskon 30% berikutnya";
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
            + '<span style="font-size:1.25rem;">🌱</span>'
          + '</div>';
        }
        historyList.innerHTML = h;
      }
    }
  }

  renderEcoDashboard();
});
