// auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const authContainer = document.getElementById('auth-container');
    const transportContainer = document.getElementById('transport-container');
  
    // Login flow (for demonstration, simply show the transportation page)
    loginBtn.addEventListener('click', () => {
      const username = document.getElementById('login-username').value;
      const email = document.getElementById('login-email').value;
      if (username && email) {
        // Here, you would normally verify credentials
        authContainer.style.display = 'none';
        transportContainer.style.display = 'block';
      } else {
        alert('Please enter both username and email.');
      }
    });
  
    // Signup flow: store username and email in the booking collection
    signupBtn.addEventListener('click', () => {
      const username = document.getElementById('signup-username').value;
      const email = document.getElementById('signup-email').value;
      if (username && email) {
        fetch('http://localhost:5000/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email })
        })
        .then(response => response.json())
        .then(data => {
          console.log('Signup/Booking success:', data);
          // After successful signup, show the transportation page
          authContainer.style.display = 'none';
          transportContainer.style.display = 'block';
        })
        .catch(error => {
          console.error('Error during signup:', error);
        });
      } else {
        alert('Please enter both username and email.');
      }
    });
  });
  