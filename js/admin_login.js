import config from './config.js';

document.addEventListener('DOMContentLoaded', function() {
  const adminLoginForm = document.getElementById('adminLoginForm');
  
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        
        // Store admin session info
        localStorage.setItem('adminSession', JSON.stringify({
          token: data.token,
          username: data.username
        }));

        // Redirect to admin dashboard
        window.location.href = 'admin-dashboard.html';
      } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Login failed. Please check your credentials.');
      }
    });
  }
});
  