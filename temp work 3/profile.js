/* ==========================================
   BUDGETWISE GENZ - PROFILE
   ========================================== */

function initProfile() {
    loadProfile();
    loadStats();
}

function loadProfile() {
    const profile = Store.getUserProfile();

    document.getElementById('userName').value = profile.name || '';
    document.getElementById('userEmail').value = profile.email || '';
    document.getElementById('monthlyBudget').value = profile.monthlyBudget || '';
}

function saveProfile() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const monthlyBudget = parseFloat(document.getElementById('monthlyBudget').value) || 0;

    Store.updateUserProfile({
        name: name || 'User',
        email: email,
        monthlyBudget: monthlyBudget
    });

    Utils.showToast('✅ Profile saved successfully!');
}

function loadStats() {
    const profile = Store.getUserProfile();
    const expenses = Store.getExpenses();
    const learningProgress = Store.getLearningProgress();

    // Member since
    const joinDate = new Date(profile.joinDate);
    document.getElementById('memberSince').textContent =
        joinDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });

    // Total tracked
    const total = Store.getTotalSpent();
    document.getElementById('totalTracked').textContent = Utils.formatCurrency(total);

    // Total entries
    document.getElementById('totalEntries').textContent = expenses.length;

    // Learning level
    document.getElementById('learningLevel').textContent = learningProgress.level || 1;
}

function exportData() {
    const data = {
        expenses: Store.getExpenses(),
        learning: Store.getLearningProgress(),
        achievements: Store.getAchievements(),
        profile: Store.getUserProfile(),
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `budgetwise-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    Utils.showToast('📤 Data exported successfully!');
}

function clearAllData() {
    const confirmation = prompt('Type "DELETE ALL" to confirm clearing all data:');

    if (confirmation === 'DELETE ALL') {
        Store.clearAll();
        Utils.showToast('🗑️ All data cleared');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        Utils.showToast('Cancelled - Data is safe');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initProfile);
