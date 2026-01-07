/* ==========================================
   BUDGETWISE GENZ - ACHIEVEMENTS
   ========================================== */

function initAchievements() {
    renderAchievements();
}

function renderAchievements() {
    const container = document.getElementById('achievementsContainer');
    const userAchievements = Store.getAchievements();
    const unlocked = userAchievements.unlocked || [];

    const allAchievements = LearningData.achievements;

    // Update stats
    document.getElementById('unlockedCount').textContent = unlocked.length;
    document.getElementById('totalCount').textContent = allAchievements.length;
    const percent = allAchievements.length > 0 ?
        Math.round((unlocked.length / allAchievements.length) * 100) : 0;
    document.getElementById('progressPercent').textContent = percent + '%';

    container.innerHTML = allAchievements.map(achievement => {
        const isUnlocked = unlocked.includes(achievement.id);

        return `
      <div class="card ${isUnlocked ? '' : 'locked'}" 
           style="text-align: center; padding: 2rem; ${isUnlocked ? '' : 'opacity: 0.5;'}">
        <div style="font-size: 4rem; margin-bottom: 1rem; ${isUnlocked ? '' : 'filter: grayscale(100%);'}">
          ${achievement.icon}
        </div>
        <h3 style="margin-bottom: 0.5rem;">${achievement.name}</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">
          ${achievement.description}
        </p>
        ${isUnlocked ? `
          <div class="badge" style="margin-top: 1rem; display: inline-flex;">
            ✅ Unlocked
          </div>
        ` : `
          <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.875rem;">
            🔒 Locked
          </div>
        `}
      </div>
    `;
    }).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAchievements);
