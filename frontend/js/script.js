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

  var giftIcon = document.getElementById("eco-gift-icon");
  var giftWrap = document.getElementById("eco-gift-wrap");
  var sparkle = document.getElementById("eco-gift-sparkle");

  // Bounce animation terus
  if (giftIcon) {
        giftIcon.className = "modern-bounce";
  }

  // Cek pending claim dari checkout
  var pendingClaim = JSON.parse(localStorage.getItem("ecoPendingClaim") || "null");
  var isClaimable = false;

  function renderEcoDashboard() {
    var totalPointsEl = document.getElementById("total-points");
    var carbonSavedEl = document.getElementById("carbon-saved");
    var historyList = document.getElementById("eco-history");

    if (totalPointsEl) {
      totalPointsEl.textContent = Number(ecoData.points).toLocaleString("id-ID") + " Pts";
      carbonSavedEl.textContent = Number(ecoData.carbon).toFixed(1);
    }

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
          h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:0.875rem;">'
            + '<div><span style="font-weight:900;">+' + entry.points + '</span> Pts <span style="opacity:0.5;">•</span> '
            + '<span style="font-weight:700;">+' + entry.carbon.toFixed(1) + 'kg CO₂</span>'
            + '<p style="font-size:0.7rem;opacity:0.5;font-weight:600;margin-top:2px;">' + entry.product + ' — ' + new Date(entry.date).toLocaleDateString("id-ID") + '</p>'
            + '</div>'
            + '<span style="font-size:1.25rem;">🎁</span>'
          + '</div>';
        }
        historyList.innerHTML = h;
      }
    }

    // Cek apakah ada klaim yg bisa diklaim
    isClaimable = pendingClaim && pendingClaim.milestones && pendingClaim.milestones.length > 0;

    // Tambah badge "KLAIM!" kalo bisa klaim
    var claimBadge = document.getElementById("eco-claim-badge");
    if (isClaimable) {
      if (!claimBadge && giftWrap) {
        var badge = document.createElement("span");
        badge.id = "eco-claim-badge";
        badge.textContent = "KLAIM!";
        badge.style.cssText = "position:absolute;top:-16px;right:-16px;background:#FF6B9D;color:#fff;font-size:0.65rem;font-weight:900;padding:4px 8px;text-transform:uppercase;animation:modern-glow 1s ease-in-out infinite;";
        giftWrap.style.position = "relative";
        giftWrap.appendChild(badge);
      }
      // Ganti label progress
      if (milestoneTextEl) {
        milestoneTextEl.textContent = ecoData.points + " Pts — 🎁 Klik gift untuk klaim voucher!";
      }
    } else {
      if (claimBadge) claimBadge.remove();
    }

    // Glow effect pas bisa klaim
    var ecoCard = document.querySelector(".modern-eco-card");
    if (ecoCard) {
      if (isClaimable) {
        ecoCard.classList.add("modern-glow");
      } else {
        ecoCard.classList.remove("modern-glow");
      }
    }
  }

  renderEcoDashboard();

  // ==========================================
  // ANIMASI GIFT + NOTIFIKASI VOUCHER
  // ==========================================

  function showEcoToast(voucherData) {
    var toast = document.getElementById("eco-toast");
    if (!toast) return;
    var codes = voucherData.codes || [];
    var count = codes.length;

    toast.innerHTML = '<div style="display:flex;align-items:center;gap:12px;">'
      + '<span style="font-size:2rem;">🎉</span>'
      + '<div>'
        + '<p style="font-weight:900;font-size:1rem;text-transform:uppercase;">Voucher Diskon 30%!</p>'
        + '<p style="font-size:0.75rem;opacity:0.8;margin-top:4px;">Kode: <span style="font-weight:900;color:#FFE500;">' + codes.join(", ") + '</span></p>'
        + '<p style="font-size:0.65rem;opacity:0.6;margin-top:2px;">Gunakan di checkout berikutnya</p>'
      + '</div>'
      + '<button onclick="hideEcoToast()" style="margin-left:auto;background:none;border:none;color:#fff;font-size:1.5rem;font-weight:900;cursor:pointer;padding:0 4px;">&times;</button>'
    + '</div>';

    toast.style.display = "block";
    toast.className = "fixed top-24 right-4 z-[9999] modern-toast px-6 py-4 modern-toast-enter";
    toast.style.maxWidth = "420px";

    if (window.ecoToastTimer) clearTimeout(window.ecoToastTimer);
    window.ecoToastTimer = setTimeout(function () {
      hideEcoToast();
    }, 8000);
  }

  window.hideEcoToast = function () {
    var toast = document.getElementById("eco-toast");
    if (!toast) return;
    toast.className = "fixed top-24 right-4 z-[9999] modern-toast px-6 py-4 modern-toast-leave";
    setTimeout(function () {
      toast.style.display = "none";
      toast.className = "fixed top-24 right-4 z-[9999] modern-toast px-6 py-4 hidden";
    }, 350);
  };

  function triggerGiftOpen(voucherData) {
    if (!giftIcon || !giftWrap || !sparkle) return;

    // Hapus badge kalo ada
    var badge = document.getElementById("eco-claim-badge");
    if (badge) badge.remove();

    // Stop bounce, mulai open
    giftIcon.className = "modern-gift-open";
    giftIcon.style.transformOrigin = "center bottom";

    var ecoCard = document.querySelector(".modern-eco-card");
    if (ecoCard) ecoCard.classList.add("modern-glow");

    // Setelah animasi open selesai, sembunyiin gift & tampilin sparkle
    setTimeout(function () {
      giftIcon.style.display = "none";
      sparkle.style.display = "inline-block";
      sparkle.className = "modern-sparkle";

      // Tampilkan toast
      showEcoToast(voucherData);

      setTimeout(function () {
        sparkle.style.display = "none";
        sparkle.className = "";
        giftIcon.style.display = "inline-block";
    giftIcon.className = "modern-bounce";
      }, 2000);
    }, 1200);
  }

  async function claimVoucher() {
    var token = localStorage.getItem("token");
    if (!token) {
      showEcoToast({ codes: ["Login dulu!"] });
      return;
    }
    if (!pendingClaim || !pendingClaim.milestones || pendingClaim.milestones.length === 0) return;

    var milestones = pendingClaim.milestones;
    var claimedCodes = [];

    for (var i = 0; i < milestones.length; i++) {
      try {
        var res = await fetch(API_BASE_URL + "/api/auth/eco-claim", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({ milestone: milestones[i] })
        });
        var data = await res.json();
        if (data.success) {
          claimedCodes.push(data.voucher.kode);
        } else {
          console.log("Milestone " + milestones[i] + " sudah diklaim sebelumnya");
        }
      } catch (e) {
        console.error("Gagal klaim milestone " + milestones[i], e);
      }
    }

    // Hapus flag pending
    localStorage.removeItem("ecoPendingClaim");
    pendingClaim = null;

    if (claimedCodes.length > 0) {
      triggerGiftOpen({ codes: claimedCodes, count: claimedCodes.length });
      // Update milestone text
      var milestoneTextEl = document.getElementById("milestone-text");
      if (milestoneTextEl) {
        var nextMilestone = (Math.floor(ecoData.points / 1000) + 1) * 1000;
        milestoneTextEl.textContent = ecoData.points + " / " + nextMilestone + " Pts menuju diskon 30% berikutnya";
      }
    } else {
      // Semua udah pernah diklaim — tetep kasih animasi
      triggerGiftOpen({ codes: ["Sudah diklaim"] });
    }
  }

  // Klik gift → klaim voucher (kalo ada) atau scroll ke eco card
  if (giftWrap) {
    giftWrap.addEventListener("click", function () {
      if (isClaimable) {
        claimVoucher();
      } else {
        var ecoCard = document.querySelector(".modern-eco-card");
        if (ecoCard) {
          ecoCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
  }
});
