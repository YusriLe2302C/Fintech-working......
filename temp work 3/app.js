let expenses = [];

function addExpenseData(amount, category) {
  expenses.push({
    amount: Number(amount),
    category,
    date: new Date()
  });
}
