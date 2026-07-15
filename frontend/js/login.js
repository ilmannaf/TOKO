document.addEventListener('DOMContentLoaded', () => {
  redirectIfLoggedIn();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const adminForm = document.getElementById('form-admin');
      if (adminForm && !adminForm.classList.contains('hidden')) {
        handleAdminLogin();
      } else {
        handleLogin();
      }
    }
  });
});

function showTab(tab) {
  const tabUser = document.getElementById('tab-user');
  const tabAdmin = document.getElementById('tab-admin');
  const formUser = document.getElementById('form-user');
  const formAdmin = document.getElementById('form-admin');
  const errorMsg = document.getElementById('error-msg');

  errorMsg.classList.add('hidden');

  if (tab === 'admin') {
    tabUser.className = 'flex-1 py-3 font-black uppercase text-sm bg-white border-r-2 border-black';
    tabAdmin.className = 'flex-1 py-3 font-black uppercase text-sm bg-yellow-300';
    formUser.classList.add('hidden');
    formAdmin.classList.remove('hidden');
  } else {
    tabAdmin.className = 'flex-1 py-3 font-black uppercase text-sm bg-white';
    tabUser.className = 'flex-1 py-3 font-black uppercase text-sm bg-yellow-300 border-r-2 border-black';
    formAdmin.classList.add('hidden');
    formUser.classList.remove('hidden');
  }
}

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

async function handleAdminLogin() {
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value;
  const errorMsg = document.getElementById('error-msg');
  const btn      = document.getElementById('btn-admin-login');

  errorMsg.classList.add('hidden');

  if (!username || !password) {
    errorMsg.textContent = 'Username dan password wajib diisi.';
    errorMsg.classList.remove('hidden');
    return;
  }

  btn.textContent = 'Memproses...';
  btn.disabled = true;

  try {
    const response = await fetch(`${API_AUTH}/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      window.location.href = 'admin/index.html';
    } else {
      errorMsg.textContent = data.message || 'Login gagal.';
      errorMsg.classList.remove('hidden');
    }
  } catch {
    errorMsg.textContent = 'Tidak dapat terhubung ke server. Pastikan backend berjalan.';
    errorMsg.classList.remove('hidden');
  } finally {
    btn.textContent = 'Masuk sebagai Admin';
    btn.disabled = false;
  }
}
