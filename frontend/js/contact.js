// JS/contact.js

// Memastikan semua elemen HTML dimuat sebelum script dijalankan
document.addEventListener('DOMContentLoaded', function() {
    
    const contactForm = document.getElementById('contact-form');

    // Mengecek apakah elemen form kontak ada di halaman
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Mencegah halaman termuat ulang (reload) saat tombol submit ditekan
            event.preventDefault(); 
            
            // Memunculkan pesan sukses
            alert('Terima kasih! Pesan Anda telah terkirim. Tim kami akan merespons dalam 1x24 jam.');
            
            // Mengosongkan form secara otomatis setelah dikirim
            this.reset(); 
        });
    }
    
});