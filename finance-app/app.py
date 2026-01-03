from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import json
import os
from datetime import datetime, timedelta
import random

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

# Database initialization
def init_db():
    # Create database directory if it doesn't exist
    os.makedirs('database', exist_ok=True)
    
    conn = sqlite3.connect('database/finance.db')
    c = conn.cursor()
    
    # Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    
    # Wallets table
    c.execute('''CREATE TABLE IF NOT EXISTS wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        balance REAL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )''')
    
    # Assets table
    c.execute('''CREATE TABLE IF NOT EXISTS assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        current_price REAL
    )''')
    
    # Trades table
    c.execute('''CREATE TABLE IF NOT EXISTS trades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        asset_id INTEGER,
        type TEXT NOT NULL,
        quantity REAL NOT NULL,
        price REAL NOT NULL,
        total REAL NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (asset_id) REFERENCES assets (id)
    )''')
    
    # Transactions table
    c.execute('''CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )''')
    
    # Expenses table
    c.execute('''CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )''')
    
    # Savings goals table
    c.execute('''CREATE TABLE IF NOT EXISTS savings_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        target_amount REAL NOT NULL,
        current_amount REAL DEFAULT 0,
        target_date DATE,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )''')
    
    # Insert sample assets
    sample_assets = [
        ('AAPL', 'Apple Inc.', 'stock', 150.00),
        ('GOOGL', 'Alphabet Inc.', 'stock', 2500.00),
        ('TSLA', 'Tesla Inc.', 'stock', 800.00),
        ('BTC', 'Bitcoin', 'crypto', 45000.00),
        ('ETH', 'Ethereum', 'crypto', 3000.00),
        ('GOLD', 'Gold', 'commodity', 1800.00),
        ('OIL', 'Crude Oil', 'commodity', 70.00)
    ]
    
    c.executemany('INSERT OR IGNORE INTO assets (symbol, name, type, current_price) VALUES (?, ?, ?, ?)', sample_assets)
    
    conn.commit()
    conn.close()

# Routes
@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']
        
        conn = sqlite3.connect('database/finance.db')
        c = conn.cursor()
        c.execute('SELECT id, password_hash FROM users WHERE username = ?', (username,))
        user = c.fetchone()
        conn.close()
        
        if user and check_password_hash(user[1], password):
            session['user_id'] = user[0]
            return jsonify({'success': True})
        return jsonify({'success': False, 'message': 'Invalid credentials'})
    
    return render_template('login.html')

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']
    
    conn = sqlite3.connect('database/finance.db')
    c = conn.cursor()
    
    try:
        password_hash = generate_password_hash(password)
        c.execute('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', 
                 (username, email, password_hash))
        user_id = c.lastrowid
        c.execute('INSERT INTO wallets (user_id, balance) VALUES (?, ?)', (user_id, 10000.0))
        conn.commit()
        session['user_id'] = user_id
        return jsonify({'success': True})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Username or email already exists'})
    finally:
        conn.close()

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data['email']
    
    conn = sqlite3.connect('database/finance.db')
    c = conn.cursor()
    c.execute('SELECT id, username FROM users WHERE email = ?', (email,))
    user = c.fetchone()
    
    if user:
        # Generate simple reset token (in production, use secure tokens)
        reset_token = str(random.randint(100000, 999999))
        # Store token temporarily (in production, use proper token storage)
        session[f'reset_token_{user[0]}'] = reset_token
        conn.close()
        return jsonify({'success': True, 'token': reset_token, 'message': f'Reset code: {reset_token}'})
    
    conn.close()
    return jsonify({'success': False, 'message': 'Email not found'})

@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data['email']
    token = data['token']
    new_password = data['password']
    
    conn = sqlite3.connect('database/finance.db')
    c = conn.cursor()
    c.execute('SELECT id FROM users WHERE email = ?', (email,))
    user = c.fetchone()
    
    if user and session.get(f'reset_token_{user[0]}') == token:
        password_hash = generate_password_hash(new_password)
        c.execute('UPDATE users SET password_hash = ? WHERE id = ?', (password_hash, user[0]))
        conn.commit()
        session.pop(f'reset_token_{user[0]}', None)
        conn.close()
        return jsonify({'success': True, 'message': 'Password reset successfully'})

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))

@app.route('/api/wallet')
def get_wallet():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    conn = sqlite3.connect('database/finance.db')
    c = conn.cursor()
    c.execute('SELECT balance FROM wallets WHERE user_id = ?', (session['user_id'],))
    wallet = c.fetchone()
    conn.close()
    
    return jsonify({'balance': wallet[0] if wallet else 0})

@app.route('/api/assets')
def get_assets():
    conn = sqlite3.connect('database/finance.db')
    c = conn.cursor()
    c.execute('SELECT * FROM assets')
    assets = c.fetchall()
    conn.close()
    
    return jsonify([{
        'id': asset[0],
        'symbol': asset[1],
        'name': asset[2],
        'type': asset[3],
        'price': asset[4]
    } for asset in assets])

@app.route('/api/trade', methods=['POST'])
def trade():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    data = request.get_json()
    asset_id = data['asset_id']
    trade_type = data['type']  # 'buy' or 'sell'
    quantity = float(data['quantity'])
    
    conn = sqlite3.connect('database/finance.db')
    c = conn.cursor()
    
    # Get asset price
    c.execute('SELECT current_price FROM assets WHERE id = ?', (asset_id,))
    price = c.fetchone()[0]
    total = price * quantity
    
    # Get wallet balance
    c.execute('SELECT balance FROM wallets WHERE user_id = ?', (session['user_id'],))
    balance = c.fetchone()[0]
    
    if trade_type == 'buy' and balance < total:
        conn.close()
        return jsonify({'success': False, 'message': 'Insufficient funds'})
    
    # Update wallet
    new_balance = balance - total if trade_type == 'buy' else balance + total
    c.execute('UPDATE wallets SET balance = ? WHERE user_id = ?', (new_balance, session['user_id']))
    
    # Record trade
    c.execute('INSERT INTO trades (user_id, asset_id, type, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?)',
             (session['user_id'], asset_id, trade_type, quantity, price, total))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'new_balance': new_balance})

@app.route('/api/expenses', methods=['GET', 'POST'])
def expenses():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    if request.method == 'POST':
        data = request.get_json()
        conn = sqlite3.connect('database/finance.db')
        c = conn.cursor()
        c.execute('INSERT INTO expenses (user_id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)',
                 (session['user_id'], data['category'], data['amount'], data['date'], data['description']))
        conn.commit()
        conn.close()
        return jsonify({'success': True})
    
    conn = sqlite3.connect('database/finance.db')
    c = conn.cursor()
    c.execute('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC', (session['user_id'],))
    expenses = c.fetchall()
    conn.close()
    
    return jsonify([{
        'id': exp[0],
        'category': exp[2],
        'amount': exp[3],
        'date': exp[4],
        'description': exp[5]
    } for exp in expenses])

@app.route('/api/expenses/weekly')
def weekly_expenses():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    conn = sqlite3.connect('database/finance.db')
    c = conn.cursor()
    
    # Get expenses from last 7 days
    week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    c.execute('''SELECT category, SUM(amount) FROM expenses 
                 WHERE user_id = ? AND date >= ? 
                 GROUP BY category''', (session['user_id'], week_ago))
    
    weekly_data = c.fetchall()
    conn.close()
    
    categories = ['Food', 'Transport', 'Subscriptions', 'Shopping', 'Trading fees', 'Miscellaneous']
    result = {cat: 0 for cat in categories}
    
    for category, amount in weekly_data:
        if category in result:
            result[category] = amount
    
    return jsonify(result)

@app.route('/api/expenses/suggestions')
def expense_suggestions():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    conn = sqlite3.connect('database/finance.db')
    c = conn.cursor()
    
    # Get current week and last week expenses
    current_week = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    last_week = (datetime.now() - timedelta(days=14)).strftime('%Y-%m-%d')
    
    c.execute('''SELECT category, SUM(amount) FROM expenses 
                 WHERE user_id = ? AND date >= ? 
                 GROUP BY category''', (session['user_id'], current_week))
    current_expenses = dict(c.fetchall())
    
    c.execute('''SELECT category, SUM(amount) FROM expenses 
                 WHERE user_id = ? AND date >= ? AND date < ? 
                 GROUP BY category''', (session['user_id'], last_week, current_week))
    last_expenses = dict(c.fetchall())
    
    conn.close()
    
    suggestions = []
    for category in current_expenses:
        current = current_expenses[category]
        last = last_expenses.get(category, 0)
        if current > last * 1.2:  # 20% increase
            increase = ((current - last) / last * 100) if last > 0 else 100
            suggestions.append(f"You spent {increase:.0f}% more on {category} this week than last week.")
    
    # Add general suggestions
    suggestions.extend([
        "Reducing subscriptions by ₹300 can increase your monthly savings by 12%.",
        "Set aside 20% of wallet balance as savings.",
        "Consider cooking at home to reduce food expenses."
    ])
    
    return jsonify(suggestions)

@app.route('/api/ai-advisor')
def ai_advisor():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    # Mock AI advisor responses
    market_advice = [
        {"symbol": "AAPL", "action": "BUY", "reason": "Strong quarterly earnings expected"},
        {"symbol": "BTC", "action": "HOLD", "reason": "Market volatility, wait for stabilization"},
        {"symbol": "TSLA", "action": "SELL", "reason": "Overvalued, consider taking profits"}
    ]
    
    finance_advice = [
        "Your food expenses are 25% above average. Consider meal planning.",
        "You have ₹2000 in unused subscription services this month.",
        "Increase your emergency fund to 6 months of expenses."
    ]
    
    return jsonify({
        'market_advice': market_advice,
        'finance_advice': finance_advice
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True)