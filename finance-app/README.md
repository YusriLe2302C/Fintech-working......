# FinanceHub - Full-Stack Trading & Personal Finance App

A comprehensive web application combining stock trading, cryptocurrency, commodities trading, digital payments, and expense tracking with AI-powered financial advice. Features a modern dark theme with glassmorphism design and enhanced user experience.

## ✨ New Features & Enhancements

### 🎨 Modern Dark Theme
- **Glassmorphism Design**: Beautiful glass-like cards with blur effects
- **Gradient Accents**: Vibrant color gradients throughout the interface
- **Smooth Animations**: Fluid transitions and hover effects
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: High contrast mode and reduced motion support

### 🚀 Enhanced User Experience
- **Real-time Updates**: Live market data and balance updates
- **Smart Notifications**: Toast notifications for all actions
- **Keyboard Shortcuts**: Quick navigation (Ctrl+1-4)
- **Floating Action Button**: Quick access to common actions
- **Loading States**: Skeleton screens and loading indicators
- **Trade Preview**: Real-time cost calculation before trading
- **Quick Add Buttons**: Fast wallet top-up options

### 📊 Enhanced Analytics
- **Doughnut Charts**: Beautiful expense visualization
- **Progress Bars**: Savings goal tracking
- **Financial Health Score**: Overall financial wellness indicator
- **Smart Insights**: AI-powered spending analysis
- **Real-time Balance Changes**: Live balance update indicators

### 🎯 Interactive Features
- **Click-to-Trade**: Click assets to select for trading
- **Quick Actions Menu**: Floating button with common actions
- **Tooltips**: Helpful hints throughout the interface
- **Form Validation**: Real-time input validation
- **Auto-save**: Automatic form data preservation

## Features

### 🏦 Trading Platform
- **Multi-Asset Trading**: Stocks, Cryptocurrency, Commodities
- **Paper Trading**: Risk-free trading simulation
- **Real-time Market Data**: Live price updates
- **Portfolio Management**: Track all your trades

### 💳 Digital Wallet & Payments
- **In-app Wallet**: Add/withdraw money (mock implementation)
- **Transaction History**: Complete payment records
- **PhonePe-style Flow**: Intuitive payment experience

### 📊 Expense Tracking
- **Category-wise Expenses**: Food, Transport, Subscriptions, Shopping, Trading fees, Miscellaneous
- **Weekly Analytics**: Visual charts using Chart.js
- **Smart Insights**: Spending pattern analysis
- **Savings Recommendations**: AI-powered suggestions

### 🤖 AI Financial Advisor
- **Market Advisor**: Buy/Hold/Sell recommendations with reasoning
- **Personal Finance Advisor**: Expense analysis and savings tips
- **Smart Alerts**: Overspending warnings and optimization suggestions

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Responsive design with modern styling
- **JavaScript**: Interactive functionality
- **Chart.js**: Data visualization

### Backend
- **Flask**: Python web framework
- **SQLite**: Database for development
- **REST APIs**: Clean API architecture

### Database Schema
```sql
users (id, username, email, password_hash, created_at)
wallets (id, user_id, balance)
assets (id, symbol, name, type, current_price)
trades (id, user_id, asset_id, type, quantity, price, total, timestamp)
transactions (id, user_id, type, amount, description, timestamp)
expenses (id, user_id, category, amount, date, description)
savings_goals (id, user_id, target_amount, current_amount, target_date)
```

## Installation & Setup

### Prerequisites
- Python 3.7+
- pip (Python package manager)

### Quick Start

1. **Clone/Download the project**
   ```bash
   cd finance-app
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Access the app**
   - Open your browser and go to: `http://localhost:5000`
   - Create a new account or use demo credentials

## Usage Guide

### Getting Started
1. **Sign Up**: Create a new account with username, email, and password
2. **Initial Wallet**: You'll start with ₹10,000 in your wallet
3. **Explore Features**: Navigate through different tabs

### Trading
1. Go to **Trading** tab
2. View available assets (stocks, crypto, commodities)
3. Select asset, trade type (buy/sell), and quantity
4. Execute trade (paper trading only)

### Expense Tracking
1. Go to **Expense Tracker** tab
2. Add expenses with category, amount, date, and notes
3. View weekly expense charts
4. Check savings insights and recommendations

### AI Advisor
1. Go to **AI Advisor** tab
2. View market recommendations for different assets
3. Get personalized finance advice based on your spending

### Wallet Management
1. Go to **Wallet & Payments** tab
2. View current balance
3. Add/withdraw money (mock functionality)
4. View transaction history

## API Endpoints

### Authentication
- `POST /login` - User login
- `POST /signup` - User registration
- `GET /logout` - User logout

### Wallet & Trading
- `GET /api/wallet` - Get wallet balance
- `GET /api/assets` - Get all tradeable assets
- `POST /api/trade` - Execute a trade

### Expenses
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Add new expense
- `GET /api/expenses/weekly` - Get weekly expense data
- `GET /api/expenses/suggestions` - Get savings suggestions

### AI Advisor
- `GET /api/ai-advisor` - Get AI recommendations

## Sample Data

The app comes pre-loaded with:
- **7 Assets**: AAPL, GOOGL, TSLA, BTC, ETH, GOLD, OIL
- **Mock Prices**: Realistic market prices
- **Demo Account**: ₹10,000 starting balance

## Key Features Explained

### AI Advisor Logic
- **Market Analysis**: Provides buy/hold/sell recommendations
- **Expense Analysis**: Compares current vs previous week spending
- **Smart Suggestions**: Identifies overspending patterns
- **Savings Optimization**: Recommends budget adjustments

### Expense Categories
- **Food**: Restaurant, groceries, delivery
- **Transport**: Fuel, public transport, ride-sharing
- **Subscriptions**: Netflix, Spotify, gym memberships
- **Shopping**: Clothing, electronics, miscellaneous
- **Trading fees**: Brokerage, transaction charges
- **Miscellaneous**: Other expenses

### Trading Logic
- **Paper Trading**: No real money involved
- **Balance Updates**: Wallet reflects trade impacts
- **Trade History**: Complete record of all transactions
- **Multi-Asset Support**: Stocks, crypto, commodities

## Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Easy navigation on mobile devices
- **Progressive Enhancement**: Works on all modern browsers

## Security Features
- **Password Hashing**: Secure password storage
- **Session Management**: User authentication
- **Input Validation**: Prevents malicious inputs
- **SQL Injection Protection**: Parameterized queries

## Future Enhancements
- Real market data integration
- Advanced charting tools
- Social trading features
- Investment portfolio analysis
- Tax calculation tools
- Bank account integration

## Troubleshooting

### Common Issues
1. **Database not found**: Run the app once to auto-create database
2. **Port already in use**: Change port in app.py or kill existing process
3. **Module not found**: Ensure all requirements are installed

### Development Mode
- Debug mode is enabled by default
- Auto-reload on file changes
- Detailed error messages

## Contributing
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License
This project is for educational purposes. Feel free to use and modify.

---

**Built with ❤️ for modern financial management**