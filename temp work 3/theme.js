/* ==========================================
   BUDGETWISE GENZ - THEME MANAGEMENT
   ========================================== */

function initTheme() {
  const savedTheme = Store.getTheme();
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  document.body.className = theme === 'light' ? 'theme-light' : 'theme-dark';
  Store.setTheme(theme);
}

function toggleTheme() {
  const currentTheme = Store.getTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  Utils.showToast(`Switched to ${newTheme} mode`);
}

// Initialize theme on page load
if (typeof Store !== 'undefined') {
  initTheme();
}
