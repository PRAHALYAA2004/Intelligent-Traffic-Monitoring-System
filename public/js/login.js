document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = 'dashboard.html';
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred. Please try again.');
    }
  });