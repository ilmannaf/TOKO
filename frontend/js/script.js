// Menunggu sampai seluruh elemen HTML selesai dimuat oleh browser
document.addEventListener("DOMContentLoaded", function () {
  console.log("Halaman Beranda (index.html) berhasil dimuat!");

  // --- 1. Fitur Menutup Banner Promosi ---
  // Catatan: Pastikan kamu punya elemen banner khusus dengan class ini. 
  // Jika tidak, querySelector ini bisa tidak sengaja menargetkan tombol Login atau Footer.
  const promoBanner = document.querySelector(".bg-indigo-600");

  if (promoBanner && promoBanner.tagName.toLowerCase() !== "footer" && promoBanner.tagName.toLowerCase() !== "a") {
    // Mencari elemen paragraf (p) di dalam banner
    const promoText = promoBanner.querySelector("p");

    if (promoText) {
      // Membuat elemen tombol "X" (close) menggunakan JavaScript
      const closeBtn = document.createElement("span");
      closeBtn.innerHTML = " &times;"; // Kode HTML untuk simbol silang (X)
      closeBtn.className = "cursor-pointer ml-4 font-bold text-lg hover:text-gray-200 transition-colors";
      closeBtn.title = "Tutup promo";

      // Memasukkan tombol "X" ke sebelah kanan teks promo
      promoText.appendChild(closeBtn);

      // Menambahkan interaksi klik untuk menghilangkan banner
      closeBtn.addEventListener("click", function () {
        // Memberikan efek transisi menghilang perlahan (opsional)
        promoBanner.style.transition = "opacity 0.3s ease";
        promoBanner.style.opacity = "0";
        
        // Setelah transisi selesai, hilangkan elemen sepenuhnya
        setTimeout(() => {
          promoBanner.style.display = "none";
        }, 300);
      });
    }
  }

  // =========================================================
  // --- 2. Fitur Gamifikasi Pohon Digital (Eco-Points) ---
  // =========================================================
  
  // Simulasi data user (Nantinya ini ditarik dari database / API backend)
  const userName = "ECO"; 

  // Mengambil data dari localStorage agar tidak hilang saat pindah halaman
  let ecoData = JSON.parse(localStorage.getItem("ecoData"));
  
  // Jika pengguna baru (belum ada data di localStorage), setel ke Level 1
  if (!ecoData) {
    ecoData = {
      points: 0,       // Total keseluruhan poin
      carbon: 0.0,     // Total jejak karbon yang dihemat (kg)
      xp: 0,           // XP saat ini untuk naik level
      level: 1,        // Level pohon
      nextLevelXp: 500 // Target XP untuk naik ke level 2
    };
    localStorage.setItem("ecoData", JSON.stringify(ecoData));
  }

  // Fungsi untuk me-render data ke elemen HTML di index.html
  function renderEcoDashboard() {
    const treeEmojiEl = document.getElementById("tree-emoji");
    const treeLevelTextEl = document.getElementById("tree-level-text");
    const xpBarEl = document.getElementById("xp-bar");
    const xpTextEl = document.getElementById("xp-text");
    const totalPointsEl = document.getElementById("total-points");
    const carbonSavedEl = document.getElementById("carbon-saved");

    // Pastikan elemen dashboard ada di halaman ini
    if (treeEmojiEl && totalPointsEl) {
      
      // Logika perubahan visual pohon berdasarkan level
      let emoji = "🌱";
      let sebutan = "Tunas Harapan";
      
      if (ecoData.level === 2) { emoji = "🌿"; sebutan = "Bibit Muda"; }
      else if (ecoData.level === 3) { emoji = "🪴"; sebutan = "Tanaman Hijau"; }
      else if (ecoData.level === 4) { emoji = "🌲"; sebutan = "Pohon Rindang"; }
      else if (ecoData.level >= 5) { emoji = "🌳"; sebutan = "Pohon Kehidupan"; }

      // Kalkulasi persentase *progress bar* XP
      let xpPercentage = (ecoData.xp / ecoData.nextLevelXp) * 100;
      if (xpPercentage > 100) xpPercentage = 100; // Maksimal 100%

      // Menyuntikkan data ke dalam DOM
      treeEmojiEl.textContent = emoji;
      treeLevelTextEl.textContent = `Level ${ecoData.level}: ${sebutan} milik ${userName}`;
      xpBarEl.style.width = `${xpPercentage}%`;
      xpTextEl.textContent = `${ecoData.xp} / ${ecoData.nextLevelXp} XP menuju Level ${ecoData.level + 1}`;
      
      // Format angka agar lebih rapi (misal: 1.000)
      totalPointsEl.textContent = ecoData.points.toLocaleString("id-ID");
      totalPointsEl.textContent += " Pts";
      
      // Format desimal karbon (1 angka di belakang koma)
      carbonSavedEl.textContent = ecoData.carbon.toFixed(1);
    }
  }

  // Panggil fungsi render saat halaman selesai dimuat
  renderEcoDashboard();
});