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
          // Based on the user's role, redirect to the appropriate dashboard
          if (data.role === 'admin') {
              window.location.href = 'admin-dashboard.html'; // Redirect to admin dashboard
          } else {
              window.location.href = 'user-dashboard.html'; // Redirect to user dashboard
          }
      } else {
          alert(data.message); // Show error message from the server
      }
  } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred. Please try again.');
  }
});
