/* ==========================================
   BUDGETWISE GENZ - EXPENSES
   ========================================== */

let editingExpenseId = null;
let selectedCategory = null;

function openExpenseModal() {
  editingExpenseId = null;
  selectedCategory = null;
  document.getElementById('modalTitle').textContent = '💸 Add New Expense';
  document.getElementById('expenseAmount').value = '';
  document.getElementById('customCategory').value = '';
  document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];

  // Uncheck all checkboxes
  document.querySelectorAll('.checkbox-label input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
    cb.parentElement.classList.remove('checked');
  });

  document.getElementById('expenseModal').classList.remove('hidden');
}

function closeExpenseModal() {
  document.getElementById('expenseModal').classList.add('hidden');
}

function handleCategoryCheck(checkbox) {
  const label = checkbox.parentElement;

  if (checkbox.checked) {
    label.classList.add('checked');
    selectedCategory = checkbox.value;

    // Uncheck other checkboxes (single selection)
    document.querySelectorAll('.checkbox-label input[type="checkbox"]').forEach(cb => {
      if (cb !== checkbox) {
        cb.checked = false;
        cb.parentElement.classList.remove('checked');
      }
    });
  } else {
    label.classList.remove('checked');
    selectedCategory = null;
  }
}

function saveExpense() {
  const amount = document.getElementById('expenseAmount').value;
  const customCat = document.getElementById('customCategory').value.trim();
  const date = document.getElementById('expenseDate').value;

  if (!amount || amount <= 0) {
    Utils.showToast('Please enter a valid amount', 'warning');
    return;
  }

  // Use custom category if provided, otherwise use selected checkbox category
  let category = customCat || selectedCategory;

  if (!category) {
    Utils.showToast('Please select or enter a category', 'warning');
    return;
  }

  const expenseData = {
    amount: parseFloat(amount),
    category: category,
    date: date
  };

  if (editingExpenseId) {
    Store.updateExpense(editingExpenseId, expenseData);
    Utils.showToast('Expense updated successfully!');
  } else {
    Store.addExpense(expenseData);
    Utils.showToast('Expense added successfully!');
  }

  closeExpenseModal();
  renderExpenses();
}

function editExpense(id) {
  const expense = Store.getExpenseById(id);
  if (!expense) return;

  editingExpenseId = id;
  document.getElementById('modalTitle').textContent = '✏️ Edit Expense';
  document.getElementById('expenseAmount').value = expense.amount;
  document.getElementById('expenseDate').value = expense.date;

  // Check if it's a predefined category
  const predefinedCategories = ['Food', 'Travel', 'Shopping', 'Clothes', 'Entertainment', 'Utilities', 'Health'];

  if (predefinedCategories.includes(expense.category)) {
    selectedCategory = expense.category;
    document.querySelectorAll('.checkbox-label input[type="checkbox"]').forEach(cb => {
      if (cb.value === expense.category) {
        cb.checked = true;
        cb.parentElement.classList.add('checked');
      }
    });
    document.getElementById('customCategory').value = '';
  } else {
    // Custom category
    document.getElementById('customCategory').value = expense.category;
    selectedCategory = null;
    document.querySelectorAll('.checkbox-label input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
      cb.parentElement.classList.remove('checked');
    });
  }

  document.getElementById('expenseModal').classList.remove('hidden');
}

function deleteExpense(id) {
  if (confirm('Are you sure you want to delete this expense?')) {
    Store.deleteExpense(id);
    Utils.showToast('Expense deleted');
    renderExpenses();
  }
}

function renderExpenses() {
  const container = document.getElementById('expenseList');
  const searchQuery = document.getElementById('searchExpenses').value.toLowerCase();

  let expenses = Store.getExpenses();

  // Filter by search query
  if (searchQuery) {
    expenses = expenses.filter(e =>
      e.category.toLowerCase().includes(searchQuery) ||
      e.amount.toString().includes(searchQuery)
    );
  }

  // Sort by date (newest first)
  expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (expenses.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem;">
        <h3 style="margin-bottom: 1rem;">📊 No expenses found</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
          ${searchQuery ? 'Try a different search term' : 'Start tracking your expenses to gain insights!'}
        </p>
        ${!searchQuery ? '<button class="btn-primary" onclick="openExpenseModal()">+ Add Your First Expense</button>' : ''}
      </div>
    `;
    return;
  }

  // Group by date
  const groupedExpenses = {};
  expenses.forEach(expense => {
    const date = expense.date;
    if (!groupedExpenses[date]) {
      groupedExpenses[date] = [];
    }
    groupedExpenses[date].push(expense);
  });

  container.innerHTML = Object.keys(groupedExpenses).map(date => {
    const dayExpenses = groupedExpenses[date];
    const dayTotal = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return `
      <div class="card mb-2">
        <div class="flex-between mb-1">
          <h3>${Utils.formatDate(date)} <span style="font-weight: 400; color: var(--text-secondary);">(${Utils.getRelativeTime(date)})</span></h3>
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-purple);">
            ${Utils.formatCurrency(dayTotal)}
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${dayExpenses.map(expense => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.875rem; background: var(--bg-secondary); border-radius: 12px; border: 1px solid var(--border-color);">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 1.75rem;">${Utils.getCategoryEmoji(expense.category)}</span>
                <div>
                  <span class="category-badge category-${expense.category.toLowerCase()}">${expense.category}</span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="font-size: 1.25rem; font-weight: 700;">
                  ${Utils.formatCurrency(expense.amount)}
                </div>
                <button class="btn-icon btn-secondary" onclick="editExpense(${expense.id})" style="padding: 0.5rem;">✏️</button>
                <button class="btn-icon btn-secondary" onclick="deleteExpense(${expense.id})" style="padding: 0.5rem;">🗑️</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderExpenses();
});
