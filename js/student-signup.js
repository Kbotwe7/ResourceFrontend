import config from './config.js';

document.addEventListener('DOMContentLoaded', function() {
  const studentSignupForm = document.getElementById('studentSignupForm');
  
  if (studentSignupForm) {
    studentSignupForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const studentId = document.getElementById('studentId').value.trim();
      const email = document.getElementById('email').value.trim();
      const course = document.getElementById('course').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      // Validate passwords match
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      if (!course) {
        alert('Please select your course!');
        return;
      }

      try {
        const response = await fetch(`${config.API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: studentId,
            password: password,
            email: email,
            role: 'student',
            student_id: studentId,
            course: course
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create account');
        }

        const user = await response.json();
        
        // Store minimal user info in localStorage for session management
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role
        }));

        // Redirect to dashboard
        window.location.href = 'student-dashboard.html';
      } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to create account. Please try again.');
      }
    });
  }
}); 