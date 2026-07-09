document.addEventListener('DOMContentLoaded', () => {
  redirectIfLoggedIn();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
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

async function handleLogin() {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');
  const btn      = document.getElementById('btn-login');

  errorMsg.classList.add('hidden');

  if (!email || !password) {
    errorMsg.textContent = 'Email dan password wajib diisi.';
    errorMsg.classList.remove('hidden');
    return;
  }

  btn.textContent = 'Memproses...';
  btn.disabled = true;

  try {
    const response = await fetch(`${API_AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'index.html';
    } else {
      errorMsg.textContent = data.message || 'Login gagal.';
      errorMsg.classList.remove('hidden');
    }
  } catch {
    errorMsg.textContent = 'Tidak dapat terhubung ke server. Pastikan backend berjalan.';
    errorMsg.classList.remove('hidden');
  } finally {
    btn.textContent = 'Masuk';
    btn.disabled = false;
  }
}
