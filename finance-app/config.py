import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-in-production'
    DATABASE_PATH = 'database/finance.db'
    
    # Market data configuration
    MARKET_UPDATE_INTERVAL = 30  # seconds
    
    # AI Advisor settings
    SPENDING_THRESHOLD = 1.2  # 20% increase threshold
    SAVINGS_TARGET_PERCENTAGE = 20  # 20% of income
    
    # Trading settings
    INITIAL_WALLET_BALANCE = 10000.0
    MIN_TRADE_AMOUNT = 1.0
    MAX_TRADE_AMOUNT = 100000.0