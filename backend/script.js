// Menunggu sampai seluruh elemen HTML selesai dimuat oleh browser
document.addEventListener("DOMContentLoaded", function () {
  console.log("Halaman Beranda (index.html) berhasil dimuat!");

  // --- 1. Fitur Menutup Banner Promosi ---
  // Mencari elemen banner promosi berdasarkan class background-nya
  const promoBanner = document.querySelector(".bg-indigo-600");

  if (promoBanner) {
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
});