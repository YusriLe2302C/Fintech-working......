/* ==========================================
   BUDGETWISE GENZ - AI INSIGHTS
   Smart recommendations based on spending patterns
   ========================================== */

function initInsights() {
    generateInsights();
    generateTips();
}

function generateInsights() {
    const container = document.getElementById('insightsContainer');
    const expenses = Store.getExpenses();

    if (expenses.length === 0) {
        container.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem;">
        <h3 style="margin-bottom: 1rem;">📊 Not enough data yet</h3>
        <p style="color: var(--text-secondary);">
          Start tracking your expenses to receive personalized insights!
        </p>
      </div>
    `;
        return;
    }

    const insights = [];
    const categoryTotals = Store.getSpendingByCategory();
    const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

    // Insight 1: Highest spending category
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0) {
        const [topCat, topAmount] = sortedCategories[0];
        const percentage = ((topAmount / total) * 100).toFixed(1);

        insights.push({
            icon: '🎯',
            title: 'Your Top Spending Category',
            message: `You've spent ${Utils.formatCurrency(topAmount)} on ${topCat}, which is ${percentage}% of your total expenses. Consider if there are areas where you could reduce spending.`,
            type: 'info',
            actionable: true
        });
    }

    // Insight 2: Spending frequency
    const monthDates = Utils.getCurrentMonthDates();
    const monthExpenses = Store.getExpensesByDateRange(monthDates.start, monthDates.end);
    const daysInMonth = new Date().getDate();
    const avgDaily = monthExpenses.length > 0 ?
        monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0) / daysInMonth : 0;

    if (avgDaily > 0) {
        const projectedMonth = avgDaily * 30;
        insights.push({
            icon: '📈',
            title: 'Monthly Projection',
            message: `Based on your current spending pattern, you're on track to spend ${Utils.formatCurrency(projectedMonth)} this month. Your average daily spending is ${Utils.formatCurrency(avgDaily)}.`,
            type: 'warning',
            actionable: false
        });
    }

    // Insight 3: Savings opportunity
    if (sortedCategories.length > 1) {
        const [secondCat, secondAmount] = sortedCategories[1];
        const savingsPotential = secondAmount * 0.2; // 20% reduction

        insights.push({
            icon: '💰',
            title: 'Savings Opportunity',
            message: `By reducing your ${secondCat} expenses by just 20%, you could save ${Utils.formatCurrency(savingsPotential)} per month. That's ${Utils.formatCurrency(savingsPotential * 12)} per year!`,
            type: 'success',
            actionable: true
        });
    }

    // Insight 4: Spending consistency
    const last7Days = Utils.getWeeklySpending();
    const avgLast7 = last7Days.reduce((a, b) => a + b, 0) / 7;
    const variation = Math.max(...last7Days) - Math.min(...last7Days);

    if (variation > avgLast7 * 2) {
        insights.push({
            icon: '⚠️',
            title: 'Inconsistent Spending Pattern',
            message: `Your daily spending varies significantly. Creating a budget and sticking to it can help you build better financial habits and reduce impulse purchases.`,
            type: 'warning',
            actionable: true
        });
    }

    // Insight 5: Positive reinforcement
    if (expenses.length >= 10) {
        insights.push({
            icon: '🌟',
            title: 'Great Progress!',
            message: `You've been consistently tracking your expenses! This self-awareness is the first step toward financial freedom. Keep up the momentum!`,
            type: 'success',
            actionable: false
        });
    }

    // Render insights
    container.innerHTML = insights.map(insight => {
        const typeColors = {
            info: 'var(--gradient-info)',
            warning: 'var(--gradient-warning)',
            success: 'var(--gradient-success)'
        };

        return `
      <div class="card mb-2" style="border-left: 4px solid ${typeColors[insight.type] || 'var(--accent-purple)'};">
        <div style="display: flex; gap: 1rem;">
          <div style="font-size: 2.5rem;">${insight.icon}</div>
          <div style="flex: 1;">
            <h3 style="margin-bottom: 0.5rem;">${insight.title}</h3>
            <p style="color: var(--text-secondary); line-height: 1.6;">
              ${insight.message}
            </p>
            ${insight.actionable ? `
              <button class="btn-primary" style="margin-top: 1rem; padding: 0.5rem 1rem; font-size: 0.875rem;" 
                      onclick="Utils.showToast('Great! Keep monitoring your progress')">
                Take Action
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    }).join('');
}

function generateTips() {
    const container = document.getElementById('tipsContainer');

    const tips = [
        {
            icon: '🎯',
            title: '50/30/20 Rule',
            text: 'Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.'
        },
        {
            icon: '💡',
            title: 'Track Every Rupee',
            text: 'Small expenses add up. Tracking everything helps you identify patterns and opportunities to save.'
        },
        {
            icon: '🔄',
            title: 'Automate Savings',
            text: 'Set up automatic transfers to savings accounts. Pay yourself first before spending on anything else.'
        },
        {
            icon: '📊',
            title: 'Review Weekly',
            text: 'Spend 10 minutes each week reviewing your expenses. This keeps you accountable and aware.'
        },
        {
            icon: '🎓',
            title: 'Invest in Learning',
            text: 'Financial education is the best investment. Check out our Learn section for valuable money wisdom.'
        },
        {
            icon: '🚫',
            title: '24-Hour Rule',
            text: 'Wait 24 hours before making non-essential purchases. This reduces impulse buying.'
        }
    ];

    container.innerHTML = tips.map(tip => `
    <div style="display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--border-color);">
      <div style="font-size: 1.75rem;">${tip.icon}</div>
      <div>
        <h4 style="margin-bottom: 0.25rem; font-size: 1rem;">${tip.title}</h4>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 0;">
          ${tip.text}
        </p>
      </div>
    </div>
  `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initInsights);
