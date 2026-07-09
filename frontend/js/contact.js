document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            alert('Harap isi semua kolom.');
            return;
        }

        const btn = contactForm.querySelector('button[type="submit"]');
        btn.textContent = 'Mengirim...';
        btn.disabled = true;

        try {
            const res = await fetch(`${BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Terima kasih! Pesan Anda telah terkirim. Tim kami akan merespons dalam 1x24 jam.');
                contactForm.reset();
            } else {
                alert('Gagal mengirim pesan. Silakan coba lagi.');
            }
        } catch {
            alert('Tidak dapat terhubung ke server. Pastikan backend berjalan.');
        } finally {
            btn.textContent = 'Kirim Pesan Sekarang';
            btn.disabled = false;
        }
    });
});
