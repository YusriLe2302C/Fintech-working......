/* ==========================================
   BUDGETWISE GENZ - ANALYSIS
   ========================================== */

let categoryChart = null;
let trendChart = null;

function initAnalysis() {
    loadSummaryStats();
    loadCategoryChart();
    loadTrendChart();
    loadCategoryBreakdown();
}

function loadSummaryStats() {
    const monthDates = Utils.getCurrentMonthDates();
    const monthExpenses = Store.getExpensesByDateRange(monthDates.start, monthDates.end);
    const monthTotal = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    document.getElementById('monthTotal').textContent = Utils.formatCurrency(monthTotal);

    // Average daily
    const daysInMonth = new Date().getDate();
    const avgDaily = monthTotal / daysInMonth;
    document.getElementById('avgDaily').textContent = Utils.formatCurrency(avgDaily);

    // Top category
    const categoryTotals = Store.getSpendingByCategory();
    const topCat = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    if (topCat) {
        document.getElementById('topCategory').textContent = `${Utils.getCategoryEmoji(topCat[0])} ${topCat[0]}`;
    }
}

function loadCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const categoryTotals = Store.getSpendingByCategory();
    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    if (categories.length === 0) {
        ctx.parentElement.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">No spending data available</p>';
        return;
    }

    const colors = categories.map(cat => Utils.getCategoryColor(cat));

    if (categoryChart) {
        categoryChart.destroy();
    }

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#0a0e1a'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#9ca3af',
                        padding: 15,
                        font: {
                            size: 12,
                            family: 'Inter'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    padding: 12,
                    borderColor: '#8b5cf6',
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${Utils.formatCurrency(context.parsed)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function loadTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    // Get last 30 days
    const dates = [];
    const amounts = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dates.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));

        const dayExpenses = Store.getExpenses().filter(e => e.date === dateStr);
        const dayTotal = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
        amounts.push(dayTotal);
    }

    if (trendChart) {
        trendChart.destroy();
    }

    trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Daily Spending',
                data: amounts,
                backgroundColor: 'rgba(139, 92, 246, 0.7)',
                borderColor: '#8b5cf6',
                borderWidth: 2,
                borderRadius: 6
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
                        color: '#9ca3af',
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

function loadCategoryBreakdown() {
    const container = document.getElementById('categoryBreakdown');
    const categoryTotals = Store.getSpendingByCategory();
    const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

    if (total === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No data to display</p>';
        return;
    }

    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

    container.innerHTML = sorted.map(([category, amount]) => {
        const percentage = ((amount / total) * 100).toFixed(1);

        return `
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">${Utils.getCategoryEmoji(category)}</span>
            <span style="font-weight: 600;">${category}</span>
          </div>
          <div>
            <span style="font-size: 1.25rem; font-weight: 700; color: var(--accent-purple);">
              ${Utils.formatCurrency(amount)}
            </span>
            <span style="color: var(--text-secondary); margin-left: 0.5rem;">
              ${percentage}%
            </span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%; background: ${Utils.getCategoryColor(category)};"></div>
        </div>
      </div>
    `;
    }).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAnalysis);
