/* ==========================================
   BUDGETWISE GENZ - DASHBOARD
   ========================================== */

let weeklyChart = null;

function initDashboard() {
  // Set greeting
  document.getElementById('greeting').textContent = Utils.getGreeting() + ' ✨';

  // Set tip of the day
  document.getElementById('tipOfDay').textContent = '💡 ' + Utils.getRandomTip();

  // Load stats
  loadStats();

  // Load chart
  loadWeeklyChart();

  // Load recent expenses
  loadRecentExpenses();
}

function loadStats() {
  // Total spent (all time)
  const totalSpent = Store.getTotalSpent();
  document.getElementById('totalSpent').textContent = Utils.formatCurrency(totalSpent);

  // This month spending
  const monthDates = Utils.getCurrentMonthDates();
  const monthExpenses = Store.getExpensesByDateRange(monthDates.start, monthDates.end);
  const monthTotal = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  document.getElementById('monthSpent').textContent = `${Utils.formatCurrency(monthTotal)} this month`;

  // Transaction count (this month)
  document.getElementById('transactionCount').textContent = monthExpenses.length;

  // Learning progress
  const learningProgress = Store.getLearningProgress();
  document.getElementById('learningStreak').textContent = learningProgress.currentStreak || 0;
  document.getElementById('totalPoints').textContent = learningProgress.totalPoints || 0;
  document.getElementById('levelText').textContent = `Level ${learningProgress.level || 1}`;
}

function loadWeeklyChart() {
  const ctx = document.getElementById('weeklyChart');
  if (!ctx) return;

  const weeklyData = Utils.getWeeklySpending();
  const labels = Utils.getLast7Days().map(date => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { weekday: 'short' });
  });

  if (weeklyChart) {
    weeklyChart.destroy();
  }

  weeklyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Daily Spending',
        data: weeklyData,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          padding: 12,
          borderColor: '#8b5cf6',
          borderWidth: 1,
          titleColor: '#fff',
          bodyColor: '#fff',
          callbacks: {
            label: function (context) {
              return Utils.formatCurrency(context.parsed.y);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: '#9ca3af',
            callback: function (value) {
              return '₹' + value;
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#9ca3af'
          }
        }
      }
    }
  });
}

function loadRecentExpenses() {
  const container = document.getElementById('recentExpenses');
  const expenses = Store.getExpenses().slice(-5).reverse();

  if (expenses.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No expenses yet. Start tracking your spending!</p>';
    return;
  }

  container.innerHTML = expenses.map(expense => `
    <div class="card" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem;">
          <span style="font-size: 1.5rem;">${Utils.getCategoryEmoji(expense.category)}</span>
          <span class="category-badge category-${expense.category.toLowerCase()}">${expense.category}</span>
        </div>
        <p style="font-size: 0.875rem; color: var(--text-secondary); margin-left: 2.25rem;">
          ${Utils.formatDate(expense.date)}
        </p>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-purple);">
          ${Utils.formatCurrency(expense.amount)}
        </div>
      </div>
    </div>
  `).join('');
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', initDashboard);
