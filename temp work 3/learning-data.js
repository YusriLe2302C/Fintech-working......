/* ==========================================
   BUDGETWISE GENZ - LEARNING CONTENT
   Financial wisdom from bestselling books
   ========================================== */

const LearningData = {
    modules: [
        {
            id: 1,
            title: "💡 Money Basics",
            description: "Foundation of financial literacy",
            icon: "📚",
            lessons: [
                {
                    id: 101,
                    title: "What is Money?",
                    content: `Money is a medium of exchange, a unit of account, and a store of value. Understanding money's true nature is the first step to mastering it.

**Key Concepts:**
• Money is a tool, not the end goal
• It represents your time and energy
• Its value changes over time (inflation)

**From Rich Dad Poor Dad:**
"The love of money is the root of all evil. The lack of money is the root of all evil."

**Action:** Track where your money comes from and where it goes for one week.`,
                    points: 10,
                    quiz: {
                        question: "What are the three main functions of money?",
                        options: [
                            "Buy, Sell, Trade",
                            "Medium of exchange, Unit of account, Store of value",
                            "Earn, Save, Spend",
                            "Cash, Credit, Crypto"
                        ],
                        correct: 1
                    }
                },
                {
                    id: 102,
                    title: "Assets vs Liabilities",
                    content: `**Rich Dad's Golden Rule:**
An asset puts money IN your pocket. A liability takes money OUT of your pocket.

**Assets:**
• Rental properties generating income
• Stocks paying dividends
• Businesses you own
• Bonds with interest

**Liabilities (disguised as assets):**
• Your car (depreciates, requires maintenance)
• Your home (if you live in it - costs taxes, maintenance)
• Latest gadgets and tech

**The Psychology of Money:**
"Spending money to show people how much money you have is the fastest way to have less money."

**Action:** List 3 things you own. Are they assets or liabilities?`,
                    points: 10,
                    quiz: {
                        question: "According to Rich Dad Poor Dad, which is an asset?",
                        options: [
                            "Your personal car",
                            "Rental property generating passive income",
                            "Latest iPhone",
                            "Designer clothes"
                        ],
                        correct: 1
                    }
                },
                {
                    id: 103,
                    title: "Pay Yourself First",
                    content: `**The Golden Rule of Wealth Building:**
Before paying bills or spending on anything, save a portion of your income first.

**The Strategy:**
1. Get paid
2. Immediately save 20% (or whatever you can)
3. Pay bills with what's left
4. Live on the remainder

**From The Richest Man in Babylon:**
"A part of all you earn is yours to keep. It should be not less than a tenth no matter how little you earn."

**Why it works:**
• Forces you to live below your means
• Makes saving automatic, not optional
• Compound interest works its magic

**Action:** Set up automatic transfer to savings when you get paid.`,
                    points: 10,
                    quiz: {
                        question: "What percentage should you save first according to wealth principles?",
                        options: [
                            "5%",
                            "At least 10-20%",
                            "50%",
                            "Whatever is left over"
                        ],
                        correct: 1
                    }
                }
            ]
        },
        {
            id: 2,
            title: "🧠 Psychology of Money",
            description: "Understanding your relationship with money",
            icon: "🎭",
            lessons: [
                {
                    id: 201,
                    title: "Compound Interest Magic",
                    content: `**Einstein called it "the 8th wonder of the world"**

Compound interest means earning interest on your interest. It's the most powerful force in building wealth.

**Example:**
₹10,000 invested at 10% annual return:
• After 10 years: ₹25,937
• After 20 years: ₹67,275
• After 30 years: ₹1,74,494

**The Psychology:**
Starting early matters more than investing more. Time is your biggest advantage.

**Morgan Housel's Wisdom:**
"Good investing isn't necessarily about earning the highest returns. It's about earning pretty good returns that you can stick with for a long period of time."

**Action:** Calculate your future wealth if you start saving today.`,
                    points: 15,
                    quiz: {
                        question: "What makes compound interest powerful?",
                        options: [
                            "High interest rates only",
                            "Earning interest on your interest over time",
                            "investing large amounts",
                            "Frequent withdrawals"
                        ],
                        correct: 1
                    }
                },
                {
                    id: 202,
                    title: "The Hedonic Treadmill",
                    content: `**Why more money doesn't equal more happiness**

The hedonic treadmill: As we earn more, we spend more, always returning to the same level of happiness.

**Salary ₹30k → Buy ₹20k phone
Salary ₹60k → Buy ₹40k phone
Salary ₹100k → Buy ₹70k phone**

Notice the pattern? Your lifestyle inflates with income.

**Psychology of Money:**
"Spending money to show people how much money you have is the fastest way to have less money."

**Breaking Free:**
• Define "enough"
• Practice gratitude
• Invest raises instead of spending them
• Find happiness in non-material things

**Action:** Next time you get a raise, save 50% of it before upgrading your lifestyle.`,
                    points: 15,
                    quiz: {
                        question: "What is lifestyle inflation?",
                        options: [
                            "When prices go up",
                            "Spending more as you earn more",
                            "When you save more",
                            "Economic recession"
                        ],
                        correct: 1
                    }
                }
            ]
        },
        {
            id: 3,
            title: "💰 Building Wealth",
            description: "Strategies for long-term financial freedom",
            icon: "🚀",
            lessons: [
                {
                    id: 301,
                    title: "The 4 Pillars of Wealth",
                    content: `**1. EARN MORE**
Increase your income through skills, side hustles, investments.

**2. SPEND LESS**
Live below your means. Every rupee saved is a rupee that can grow.

**3. INVEST WISELY**
Put your money to work. Don't let it sit idle.

**4. PROTECT YOUR WEALTH**
Insurance, emergency funds, diversification.

**Rich Dad's Formula:**
Income > Expenses = Surplus → Invest in Assets → Assets generate Income → Repeat

**Morgan Housel:**
"Wealth is what you don't see. It's the cars not purchased, the diamonds not bought, the renovations postponed."

**Action:** Which pillar needs your attention most right now?`,
                    points: 20,
                    quiz: {
                        question: "What is the definition of wealth according to Morgan Housel?",
                        options: [
                            "Having expensive things",
                            "What you don't see - money saved and invested",
                            "High salary",
                            "Luxury lifestyle"
                        ],
                        correct: 1
                    }
                },
                {
                    id: 302,
                    title: "Emergency Fund First",
                    content: `**Before investing anything, build your safety net**

**Emergency Fund = 6 months of living expenses**

**Why?**
• Job loss protection
• Medical emergencies
• Unexpected repairs
• Prevents debt spiral

**Where to keep it:**
• High-yield savings account
• Liquid mutual funds
• Fixed deposits (accessible)

**NOT in:**
• Stock market
• Locked-in investments
• Risky assets

**Psychology of Money:**
"The ability to do what you want, when you want, with who you want, for as long as you want, is priceless. It is the highest dividend money pays."

**Action:** Calculate your monthly expenses. Start building toward 6 months worth.`,
                    points: 20,
                    quiz: {
                        question: "How many months of expenses should an emergency fund cover?",
                        options: [
                            "1 month",
                            "3 months",
                            "6 months",
                            "12 months"
                        ],
                        correct: 2
                    }
                }
            ]
        },
        {
            id: 4,
            title: "📈 Smart Investing",
            description: "Making your money work for you",
            icon: "💎",
            lessons: [
                {
                    id: 401,
                    title: "Index Funds: The Simple Path",
                    content: `**For most people, index funds are the best investment**

**What are they?**
A basket of stocks representing the entire market (e.g., Nifty 50).

**Why they win:**
• Low fees (0.1% vs 2%)
• Automatic diversification
• Match market returns
• No stock-picking needed
• Time-tested strategy

**Warren Buffett's advice to his wife:**
"Put 90% in S&P 500 index fund, 10% in bonds."

**Psychology of Money:**
"The biggest risk is not taking enough risk. You cannot outperform by doing what everyone else is doing."

But paradoxically, index funds DO beat 90% of active investors over 20+ years!

**Action:** Research index funds available in your country (Nifty, Sensex).`,
                    points: 25,
                    quiz: {
                        question: "What is a key advantage of index funds?",
                        options: [
                            "Guaranteed returns",
                            "Low fees and diversification",
                            "No risk involved",
                            "Quick profits"
                        ],
                        correct: 1
                    }
                },
                {
                    id: 402,
                    title: "Time in Market > Timing the Market",
                    content: `**The most important investing principle**

**Trying to time the market:**
"I'll wait for the crash to invest"
"Let me sell before it goes down"
"I'll buy when it's at the bottom"

**Result:** You'll be wrong. Everyone is.

**Better strategy:**
Start investing NOW. Stay invested LONG-term.

**Historical truth:**
• Best 10 days in market generate 50% of all gains
• Missing these days = missing wealth
• You can't predict these days

**The Psychology of Money:**
"The single most important factor in investment success is not returns, but staying invested."

**Rupee Cost Averaging:**
Invest fixed amount monthly.
• Market up? You buy less
• Market down? You buy more
• Average cost smooths out volatility

**Action:** Start a monthly investment plan TODAY, no matter how small.`,
                    points: 25,
                    quiz: {
                        question: "What does 'Time in market beats timing the market' mean?",
                        options: [
                            "Day trading is best",
                            "Staying invested long-term beats trying to predict market movements",
                            "Market timing always works",
                            "Sell when market drops"
                        ],
                        correct: 1
                    }
                }
            ]
        }
    ],

    // Achievement definitions
    achievements: [
        { id: 'first_lesson', name: 'Getting Started', description: 'Complete your first lesson', icon: '🎯' },
        { id: 'week_streak', name: 'Week Warrior', description: 'Maintain 7-day learning streak', icon: '🔥' },
        { id: 'module_complete', name: 'Module Master', description: 'Complete an entire module', icon: '🏆' },
        { id: 'quiz_master', name: 'Quiz Champion', description: 'Get 10 quizzes correct', icon: '🎓' },
        { id: 'point_100', name: 'Century!', description: 'Earn 100 points', icon: '💯' },
        { id: 'all_lessons', name: 'Financial Guru', description: 'Complete all lessons', icon: '👑' }
    ]
};
