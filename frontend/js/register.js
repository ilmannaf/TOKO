document.addEventListener('DOMContentLoaded', () => {
  redirectIfLoggedIn();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleRegister();
  });
});

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

function checkPasswordStrength(password) {
  const bar  = document.getElementById('strength-bar');
  const text = document.getElementById('strength-text');

  if (password.length === 0) {
    bar.style.width = '0';
    text.textContent = '';
    return;
  }

  let strength = 0;
  if (password.length >= 6)  strength++;
  if (password.length >= 10) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const levels = [
    { width: '20%',  color: 'bg-red-500',    label: 'Sangat Lemah' },
    { width: '40%',  color: 'bg-orange-400',  label: 'Lemah' },
    { width: '60%',  color: 'bg-yellow-400',  label: 'Cukup' },
    { width: '80%',  color: 'bg-blue-400',    label: 'Kuat' },
    { width: '100%', color: 'bg-green-500',   label: 'Sangat Kuat' },
  ];

  const level = levels[Math.min(strength - 1, 4)];
  bar.className  = `h-1.5 rounded-full mb-1 transition-all duration-300 ${level.color}`;
  bar.style.width = level.width;
  text.textContent = level.label;
  text.className = `text-xs mb-4 ${level.color.replace('bg-', 'text-')}`;
}

async function handleRegister() {
  const nama            = document.getElementById('nama').value.trim();
  const email           = document.getElementById('email').value.trim();
  const password        = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const errorMsg        = document.getElementById('error-msg');
  const successMsg      = document.getElementById('success-msg');
  const btn             = document.getElementById('btn-register');

  errorMsg.classList.add('hidden');
  successMsg.classList.add('hidden');

  if (!nama || !email || !password || !confirmPassword) {
    errorMsg.textContent = 'Semua kolom wajib diisi.';
    errorMsg.classList.remove('hidden');
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = 'Password minimal 6 karakter.';
    errorMsg.classList.remove('hidden');
    return;
  }

  if (password !== confirmPassword) {
    errorMsg.textContent = 'Password dan konfirmasi password tidak sama.';
    errorMsg.classList.remove('hidden');
    return;
  }

  btn.textContent = 'Mendaftar...';
  btn.disabled = true;

  try {
    const response = await fetch(`${API_AUTH}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, email, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      successMsg.textContent = `Selamat datang, ${data.user.nama}! Mengalihkan...`;
      successMsg.classList.remove('hidden');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      errorMsg.textContent = data.message || 'Registrasi gagal.';
      errorMsg.classList.remove('hidden');
    }
  } catch {
    errorMsg.textContent = 'Tidak dapat terhubung ke server. Pastikan backend berjalan.';
    errorMsg.classList.remove('hidden');
  } finally {
    btn.textContent = 'Daftar Sekarang';
    btn.disabled = false;
  }
}
