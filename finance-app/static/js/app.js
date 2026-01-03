// Global variables
let weeklyChart = null;
let assets = [];
let currentBalance = 0;
let notifications = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadWalletBalance();
    loadAssets();
    loadWeeklyExpenses();
    loadAIAdvice();
    initializeEnhancements();
    
    // Set default date to today
    document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
    
    // Setup form handlers
    setupFormHandlers();
    
    // Setup real-time updates
    setInterval(updateMarketData, 30000); // Update every 30 seconds
});

// Tab functionality
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Load tab-specific data
    if (tabName === 'expenses') {
        loadWeeklyExpenses();
    } else if (tabName === 'advisor') {
        loadAIAdvice();
    }
}

// Enhanced wallet functions
async function loadWalletBalance() {
    try {
        const response = await fetch('/api/wallet');
        const data = await response.json();
        const balance = data.balance || 0;
        const previousBalance = currentBalance;
        currentBalance = balance;
        
        document.getElementById('wallet-balance').textContent = `₹${balance.toFixed(2)}`;
        document.getElementById('main-balance').textContent = `₹${balance.toFixed(2)}`;
        
        // Show balance change
        if (previousBalance > 0) {
            const change = balance - previousBalance;
            const changeElement = document.getElementById('balance-change');
            if (change !== 0) {
                changeElement.textContent = `${change > 0 ? '+' : ''}₹${change.toFixed(2)} from last update`;
                changeElement.className = `balance-change ${change > 0 ? 'positive' : 'negative'}`;
            }
        }
    } catch (error) {
        console.error('Error loading wallet balance:', error);
        showNotification('Failed to load wallet balance', 'error');
    }
}

function quickAdd(amount) {
    showNotification(`₹${amount} added to wallet!`, 'success');
    currentBalance += amount;
    document.getElementById('wallet-balance').textContent = `₹${currentBalance.toFixed(2)}`;
    document.getElementById('main-balance').textContent = `₹${currentBalance.toFixed(2)}`;
    
    const changeElement = document.getElementById('balance-change');
    changeElement.textContent = `+₹${amount} just added`;
    changeElement.className = 'balance-change positive';
}

function addMoney() {
    const amount = prompt('Enter amount to add:');
    if (amount && !isNaN(amount) && amount > 0) {
        quickAdd(parseFloat(amount));
    }
}

function withdrawMoney() {
    const amount = prompt('Enter amount to withdraw:');
    if (amount && !isNaN(amount) && amount > 0) {
        if (parseFloat(amount) <= currentBalance) {
            currentBalance -= parseFloat(amount);
            document.getElementById('wallet-balance').textContent = `₹${currentBalance.toFixed(2)}`;
            document.getElementById('main-balance').textContent = `₹${currentBalance.toFixed(2)}`;
            
            const changeElement = document.getElementById('balance-change');
            changeElement.textContent = `-₹${amount} withdrawn`;
            changeElement.className = 'balance-change negative';
            
            showNotification(`₹${amount} withdrawn successfully!`, 'success');
        } else {
            showNotification('Insufficient balance!', 'error');
        }
    }
}

// Enhanced trading functions
async function loadAssets() {
    try {
        showSkeleton('assets-list');
        const response = await fetch('/api/assets');
        assets = await response.json();
        
        displayAssets();
        populateAssetSelect();
    } catch (error) {
        console.error('Error loading assets:', error);
        showNotification('Failed to load market data', 'error');
    }
}

function displayAssets() {
    const assetsList = document.getElementById('assets-list');
    assetsList.innerHTML = '';
    
    assets.forEach(asset => {
        const changePercent = (Math.random() - 0.5) * 10; // Mock price change
        const assetDiv = document.createElement('div');
        assetDiv.className = 'asset-item';
        assetDiv.innerHTML = `
            <div class="asset-info">
                <div class="asset-symbol">${asset.symbol}</div>
                <div class="asset-name">${asset.name}</div>
                <div class="asset-type">${asset.type.toUpperCase()}</div>
            </div>
            <div>
                <div class="asset-price">₹${asset.price.toFixed(2)}</div>
                <div class="asset-change ${changePercent >= 0 ? 'status-positive' : 'status-negative'}">
                    ${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%
                </div>
            </div>
        `;
        assetDiv.addEventListener('click', () => selectAssetForTrade(asset));
        assetsList.appendChild(assetDiv);
    });
}

function populateAssetSelect() {
    const select = document.getElementById('asset-select');
    select.innerHTML = '<option value="">Select Asset</option>';
    
    assets.forEach(asset => {
        const option = document.createElement('option');
        option.value = asset.id;
        option.textContent = `${asset.symbol} - ₹${asset.price.toFixed(2)}`;
        select.appendChild(option);
    });
}

function selectAssetForTrade(asset) {
    document.getElementById('asset-select').value = asset.id;
    updateTradePreview();
    showTab('trading');
    showNotification(`Selected ${asset.symbol} for trading`, 'success');
}

function updateTradePreview() {
    const assetId = document.getElementById('asset-select').value;
    const quantity = document.getElementById('quantity').value;
    const tradeType = document.getElementById('trade-type').value;
    
    if (assetId && quantity) {
        const asset = assets.find(a => a.id == assetId);
        if (asset) {
            const cost = asset.price * parseFloat(quantity);
            document.getElementById('estimated-cost').textContent = `₹${cost.toFixed(2)}`;
            document.getElementById('trade-preview').style.display = 'block';
            
            // Check if user has enough balance for buy orders
            if (tradeType === 'buy' && cost > currentBalance) {
                document.getElementById('estimated-cost').style.color = 'var(--danger-color)';
            } else {
                document.getElementById('estimated-cost').style.color = 'var(--success-color)';
            }
        }
    } else {
        document.getElementById('trade-preview').style.display = 'none';
    }
}

// Enhanced expense functions
async function loadWeeklyExpenses() {
    try {
        const response = await fetch('/api/expenses/weekly');
        const data = await response.json();
        
        createWeeklyChart(data);
        updateExpenseSummary(data);
        loadSavingsInsights();
    } catch (error) {
        console.error('Error loading weekly expenses:', error);
        showNotification('Failed to load expense data', 'error');
    }
}

function updateExpenseSummary(data) {
    const total = Object.values(data).reduce((sum, amount) => sum + amount, 0);
    const dailyAvg = total / 7;
    
    document.getElementById('week-total').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('daily-avg').textContent = `₹${dailyAvg.toFixed(2)}`;
    
    // Update savings progress (mock calculation)
    const savingsGoal = 5000;
    const currentSavings = Math.max(0, currentBalance - total);
    const progressPercent = Math.min(100, (currentSavings / savingsGoal) * 100);
    
    document.getElementById('savings-progress').style.width = `${progressPercent}%`;
    document.querySelector('.goal-info').innerHTML = `
        <span>₹${currentSavings.toFixed(0)} / ₹${savingsGoal}</span>
        <span>${progressPercent.toFixed(0)}%</span>
    `;
}

function createWeeklyChart(data) {
    const ctx = document.getElementById('weekly-chart').getContext('2d');
    
    if (weeklyChart) {
        weeklyChart.destroy();
    }
    
    const categories = Object.keys(data);
    const amounts = Object.values(data);
    
    weeklyChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                label: 'Weekly Expenses (₹)',
                data: amounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            }
        }
    });
}

async function loadSavingsInsights() {
    try {
        const response = await fetch('/api/expenses/suggestions');
        const suggestions = await response.json();
        
        const insightsDiv = document.getElementById('savings-insights');
        insightsDiv.innerHTML = '';
        
        suggestions.forEach((suggestion, index) => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'advice-item';
            suggestionDiv.innerHTML = `
                <div class="advice-priority">💡 Insight ${index + 1}</div>
                <div>${suggestion}</div>
                <div class="advice-impact">Impact: ${['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]}</div>
            `;
            insightsDiv.appendChild(suggestionDiv);
        });
    } catch (error) {
        console.error('Error loading savings insights:', error);
    }
}

// AI Advisor functions
async function loadAIAdvice() {
    try {
        const response = await fetch('/api/ai-advisor');
        const data = await response.json();
        
        displayMarketAdvice(data.market_advice);
        displayFinanceAdvice(data.finance_advice);
    } catch (error) {
        console.error('Error loading AI advice:', error);
    }
}

function displayMarketAdvice(advice) {
    const marketDiv = document.getElementById('market-advice');
    marketDiv.innerHTML = '';
    
    advice.forEach(item => {
        const adviceDiv = document.createElement('div');
        adviceDiv.className = `advice-item ${item.action.toLowerCase()}`;
        adviceDiv.innerHTML = `
            <strong>
                ${item.symbol}
                <span class="advice-action">${item.action}</span>
            </strong>
            <div>${item.reason}</div>
            <div class="advice-confidence">Confidence: ${Math.floor(Math.random() * 30 + 70)}%</div>
        `;
        marketDiv.appendChild(adviceDiv);
    });
}

function displayFinanceAdvice(advice) {
    const financeDiv = document.getElementById('finance-advice');
    financeDiv.innerHTML = '';
    
    advice.forEach((item, index) => {
        const adviceDiv = document.createElement('div');
        adviceDiv.className = 'advice-item';
        adviceDiv.innerHTML = `
            <div class="advice-priority">Priority ${index + 1}</div>
            <div>${item}</div>
            <div class="advice-impact">Impact: ${['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]}</div>
        `;
        financeDiv.appendChild(adviceDiv);
    });
}

// Enhanced form handlers
function setupFormHandlers() {
    // Trade form with enhanced features
    document.getElementById('trade-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Processing...';
        submitBtn.disabled = true;
        
        const assetId = document.getElementById('asset-select').value;
        const tradeType = document.getElementById('trade-type').value;
        const quantity = document.getElementById('quantity').value;
        
        if (!assetId || !quantity) {
            showNotification('Please fill all fields', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        try {
            const response = await fetch('/api/trade', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    asset_id: assetId,
                    type: tradeType,
                    quantity: parseFloat(quantity)
                })
            });
            
            const data = await response.json();
            if (data.success) {
                const asset = assets.find(a => a.id == assetId);
                showNotification(
                    `${tradeType.toUpperCase()} order executed! ${quantity} ${asset.symbol} at ₹${asset.price}`,
                    'success'
                );
                loadWalletBalance();
                this.reset();
                document.getElementById('trade-preview').style.display = 'none';
            } else {
                showNotification(data.message || 'Trade failed', 'error');
            }
        } catch (error) {
            showNotification('Trade execution failed', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Add real-time trade preview updates
    ['asset-select', 'quantity', 'trade-type'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateTradePreview);
        document.getElementById(id).addEventListener('input', updateTradePreview);
    });
    
    // Enhanced expense form
    document.getElementById('expense-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Adding...';
        submitBtn.disabled = true;
        
        const amount = document.getElementById('expense-amount').value;
        const category = document.getElementById('expense-category').value;
        const date = document.getElementById('expense-date').value;
        const description = document.getElementById('expense-notes').value;
        
        if (!amount || !category || !date) {
            showNotification('Please fill required fields', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    category: category,
                    date: date,
                    description: description
                })
            });
            
            const data = await response.json();
            if (data.success) {
                showNotification(`₹${amount} expense added to ${category}`, 'success');
                this.reset();
                document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
                loadWeeklyExpenses();
            } else {
                showNotification('Failed to add expense', 'error');
            }
        } catch (error) {
            showNotification('Failed to add expense', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// New enhancement functions
function initializeEnhancements() {
    // Add floating action button
    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.innerHTML = '+';
    fab.title = 'Quick Actions';
    fab.onclick = showQuickActions;
    document.body.appendChild(fab);
    
    // Initialize notifications container
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Initialize tooltips
    initializeTooltips();
}

function showQuickActions() {
    const actions = [
        { text: '💰 Add ₹1000', action: () => quickAdd(1000) },
        { text: '📊 View Expenses', action: () => showTab('expenses') },
        { text: '🤖 AI Advice', action: () => showTab('advisor') },
        { text: '💳 Trading', action: () => showTab('trading') }
    ];
    
    const menu = document.createElement('div');
    menu.className = 'quick-menu';
    menu.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1rem;
        z-index: 1001;
        min-width: 200px;
    `;
    
    actions.forEach(action => {
        const button = document.createElement('button');
        button.textContent = action.text;
        button.style.cssText = `
            width: 100%;
            margin: 0.25rem 0;
            padding: 0.75rem;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--text-primary);
            border-radius: 8px;
            cursor: pointer;
            transition: var(--transition);
        `;
        button.onclick = () => {
            action.action();
            document.body.removeChild(menu);
        };
        menu.appendChild(button);
    });
    
    // Close menu when clicking outside
    const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
            document.body.removeChild(menu);
            document.removeEventListener('click', closeMenu);
        }
    };
    
    document.body.appendChild(menu);
    setTimeout(() => document.addEventListener('click', closeMenu), 100);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                showTab('trading');
                break;
            case '2':
                e.preventDefault();
                showTab('wallet');
                break;
            case '3':
                e.preventDefault();
                showTab('expenses');
                break;
            case '4':
                e.preventDefault();
                showTab('advisor');
                break;
        }
    }
}

function initializeTooltips() {
    // Add tooltips to various elements
    const tooltipElements = [
        { selector: '#wallet-balance', text: 'Your current wallet balance' },
        { selector: '.fab', text: 'Quick actions menu (Ctrl+Space)' },
        { selector: '.asset-item', text: 'Click to select for trading' }
    ];
    
    tooltipElements.forEach(({ selector, text }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.setAttribute('data-tooltip', text);
            el.classList.add('tooltip');
        });
    });
}

function showSkeleton(elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = `
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
    `;
}

function updateMarketData() {
    // Simulate real-time market updates
    assets.forEach(asset => {
        const change = (Math.random() - 0.5) * 0.02; // ±1% change
        asset.price *= (1 + change);
        asset.price = Math.max(0.01, asset.price); // Prevent negative prices
    });
    
    displayAssets();
    populateAssetSelect();
}

// Utility functions
function formatCurrency(amount) {
    return `₹${amount.toFixed(2)}`;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        formatDate,
        formatNumber
    };
}