/* ==========================================
   BUDGETWISE GENZ - UTILITY FUNCTIONS
   Helper functions for calculations and formatting
   ========================================== */

const Utils = {
    // Format currency
    formatCurrency(amount, currency = '₹') {
        return `${currency}${Number(amount).toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        })}`;
    },

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-IN', options);
    },

    // Get relative time (e.g., "2 days ago")
    getRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    },

    // Get greeting based on time
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    },

    // Calculate percentage
    calculatePercentage(value, total) {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    },

    // Get color for category
    getCategoryColor(category) {
        const colors = {
            'Food': '#f59e0b',
            'Travel': '#3b82f6',
            'Shopping': '#ec4899',
            'Clothes': '#8b5cf6',
            'Entertainment': '#ef4444',
            'Utilities': '#10b981',
            'Health': '#06b6d4',
            'Other': '#6b7280'
        };
        return colors[category] || colors['Other'];
    },

    // Get emoji for category
    getCategoryEmoji(category) {
        const emojis = {
            'Food': '🍔',
            'Travel': '✈️',
            'Shopping': '🛍️',
            'Clothes': '👕',
            'Entertainment': '🎮',
            'Utilities': '💡',
            'Health': '⚕️',
            'Other': '📦'
        };
        return emojis[category] || emojis['Other'];
    },

    // Get last 7 days dates
    getLast7Days() {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    },

    // Get spending for last 7 days
    getWeeklySpending() {
        const dates = this.getLast7Days();
        const expenses = Store.getExpenses();

        return dates.map(date => {
            const dayExpenses = expenses.filter(e => e.date === date);
            return dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
        });
    },

    // Get current month dates
    getCurrentMonthDates() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return {
            start: firstDay.toISOString().split('T')[0],
            end: lastDay.toISOString().split('T')[0]
        };
    },

    // Generate random tip
    getRandomTip() {
        const tips = [
            "Track every expense, no matter how small!",
            "Set a monthly budget and stick to it.",
            "Save at least 20% of your income.",
            "Avoid impulse purchases - wait 24 hours.",
            "Invest in yourself and your education.",
            "Emergency fund should cover 6 months of expenses.",
            "Start investing early to benefit from compound interest.",
            "Differentiate between needs and wants.",
            "Automate your savings for consistency.",
            "Review your spending patterns monthly."
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Animate number counting
    animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    },

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      background: var(--gradient-primary);
      color: white;
      border-radius: 12px;
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      animation: slideUp 0.3s ease;
    `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};
