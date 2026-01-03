import sqlite3
from datetime import datetime, timedelta
import random

def populate_sample_data():
    conn = sqlite3.connect('database/finance.db')
    c = conn.cursor()
    
    # Create a demo user
    demo_user_id = 1
    
    # Sample expenses for the last 2 weeks
    categories = ['Food', 'Transport', 'Subscriptions', 'Shopping', 'Trading fees', 'Miscellaneous']
    
    sample_expenses = []
    for i in range(14):  # Last 14 days
        date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
        
        # Add 1-3 random expenses per day
        for _ in range(random.randint(1, 3)):
            category = random.choice(categories)
            
            # Different amount ranges for different categories
            if category == 'Food':
                amount = random.uniform(50, 500)
            elif category == 'Transport':
                amount = random.uniform(20, 200)
            elif category == 'Subscriptions':
                amount = random.uniform(99, 999)
            elif category == 'Shopping':
                amount = random.uniform(200, 2000)
            elif category == 'Trading fees':
                amount = random.uniform(5, 50)
            else:  # Miscellaneous
                amount = random.uniform(25, 300)
            
            description = f"Sample {category.lower()} expense"
            sample_expenses.append((demo_user_id, category, round(amount, 2), date, description))
    
    # Insert sample expenses
    c.executemany('INSERT OR IGNORE INTO expenses (user_id, category, amount, date, description) VALUES (?, ?, ?, ?, ?)', 
                  sample_expenses)
    
    # Sample trades
    sample_trades = [
        (demo_user_id, 1, 'buy', 10, 150.00, 1500.00),  # AAPL
        (demo_user_id, 4, 'buy', 0.1, 45000.00, 4500.00),  # BTC
        (demo_user_id, 2, 'buy', 2, 2500.00, 5000.00),  # GOOGL
        (demo_user_id, 1, 'sell', 5, 155.00, 775.00),  # AAPL
    ]
    
    c.executemany('INSERT OR IGNORE INTO trades (user_id, asset_id, type, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?)', 
                  sample_trades)
    
    # Sample transactions
    sample_transactions = [
        (demo_user_id, 'deposit', 5000.00, 'Initial deposit'),
        (demo_user_id, 'trade', -1500.00, 'Bought AAPL'),
        (demo_user_id, 'trade', -4500.00, 'Bought BTC'),
        (demo_user_id, 'trade', 775.00, 'Sold AAPL'),
    ]
    
    c.executemany('INSERT OR IGNORE INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)', 
                  sample_transactions)
    
    conn.commit()
    conn.close()
    print("Sample data populated successfully!")

if __name__ == '__main__':
    populate_sample_data()