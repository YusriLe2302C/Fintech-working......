/* ==========================================
   BUDGETWISE GENZ - DATA STORE
   LocalStorage Management
   ========================================== */

const Store = {
  // Get all expenses
  getExpenses() {
    const data = localStorage.getItem('budgetwise_expenses');
    return data ? JSON.parse(data) : [];
  },

  // Add new expense
  addExpense(expense) {
    const expenses = this.getExpenses();
    const newExpense = {
      id: Date.now(),
      ...expense,
      date: expense.date || new Date().toISOString().split('T')[0]
    };
    expenses.push(newExpense);
    localStorage.setItem('budgetwise_expenses', JSON.stringify(expenses));
    return newExpense;
  },

  // Delete expense
  deleteExpense(id) {
    const expenses = this.getExpenses().filter(e => e.id !== id);
    localStorage.setItem('budgetwise_expenses', JSON.stringify(expenses));
  },

  // Get expense by ID
  getExpenseById(id) {
    return this.getExpenses().find(e => e.id === id);
  },

  // Update expense
  updateExpense(id, updates) {
    const expenses = this.getExpenses();
    const index = expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates };
      localStorage.setItem('budgetwise_expenses', JSON.stringify(expenses));
      return expenses[index];
    }
    return null;
  },

  // Get total spent
  getTotalSpent() {
    return this.getExpenses().reduce((sum, e) => sum + Number(e.amount), 0);
  },

  // Get spending by category
  getSpendingByCategory() {
    const expenses = this.getExpenses();
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      const cat = expense.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(expense.amount);
    });
    
    return categoryTotals;
  },

  // Get expenses by date range
  getExpensesByDateRange(startDate, endDate) {
    return this.getExpenses().filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });
  },

  // Learning Progress
  getLearningProgress() {
    const data = localStorage.getItem('budgetwise_learning');
    return data ? JSON.parse(data) : {
      completedLessons: [],
      currentStreak: 0,
      lastVisit: null,
      totalPoints: 0,
      level: 1
    };
  },

  updateLearningProgress(updates) {
    const progress = this.getLearningProgress();
    const updated = { ...progress, ...updates };
    localStorage.setItem('budgetwise_learning', JSON.stringify(updated));
    return updated;
  },

  completeLesson(lessonId) {
    const progress = this.getLearningProgress();
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.totalPoints += 10;
      
      // Check streak
      const today = new Date().toDateString();
      const lastVisit = progress.lastVisit ? new Date(progress.lastVisit).toDateString() : null;
      
      if (lastVisit !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastVisit === yesterday.toDateString()) {
          progress.currentStreak++;
        } else if (lastVisit !== today) {
          progress.currentStreak = 1;
        }
      }
      
      progress.lastVisit = new Date().toISOString();
      
      // Level up logic
      progress.level = Math.floor(progress.totalPoints / 50) + 1;
      
      localStorage.setItem('budgetwise_learning', JSON.stringify(progress));
    }
    return progress;
  },

  // Achievements
  getAchievements() {
    const data = localStorage.getItem('budgetwise_achievements');
    return data ? JSON.parse(data) : {
      unlocked: [],
      notifications: []
    };
  },

  unlockAchievement(achievementId) {
    const achievements = this.getAchievements();
    if (!achievements.unlocked.includes(achievementId)) {
      achievements.unlocked.push(achievementId);
      achievements.notifications.push({
        id: achievementId,
        timestamp: Date.now()
      });
      localStorage.setItem('budgetwise_achievements', JSON.stringify(achievements));
    }
    return achievements;
  },

  // User Profile
  getUserProfile() {
    const data = localStorage.getItem('budgetwise_profile');
    return data ? JSON.parse(data) : {
      name: 'User',
      email: '',
      joinDate: new Date().toISOString(),
      monthlyBudget: 0,
      currency: '₹'
    };
  },

  updateUserProfile(updates) {
    const profile = this.getUserProfile();
    const updated = { ...profile, ...updates };
    localStorage.setItem('budgetwise_profile', JSON.stringify(updated));
    return updated;
  },

  // Theme
  getTheme() {
    return localStorage.getItem('budgetwise_theme') || 'dark';
  },

  setTheme(theme) {
    localStorage.setItem('budgetwise_theme', theme);
  },

  // Clear all data (for testing)
  clearAll() {
    localStorage.removeItem('budgetwise_expenses');
    localStorage.removeItem('budgetwise_learning');
    localStorage.removeItem('budgetwise_achievements');
    localStorage.removeItem('budgetwise_profile');
  }
};
