/* ==========================================
   BUDGETWISE GENZ - ROUTER
   Navigation and authentication
   ========================================== */

function login(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;

  // Save user info
  Store.updateUserProfile({ email });

  // Smooth transition
  document.body.style.opacity = '0';
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 300);
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    document.body.style.opacity = '0';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 300);
  }
}

function navigateTo(page) {
  document.body.style.opacity = '0';
  setTimeout(() => {
    window.location.href = page;
  }, 300);
}

// Fade in on page load
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.transition = 'opacity 0.3s ease';
  document.body.style.opacity = '1';
});
