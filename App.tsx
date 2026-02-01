
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, 
  Wallet, 
  Bus, 
  HeartPulse, 
  TrendingUp, 
  Plus, 
  PieChart as PieChartIcon,
  Bell,
  Settings,
  CreditCard,
  MessageCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  User,
  Mail,
  ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategoryType, AppState, Transaction, CategoryState } from './types';
import StatsCard from './components/StatsCard';
import UpiModal from './components/UpiModal';
import { getFinancialInsights, getQuickTips } from './services/geminiService';

const INITIAL_STATE: AppState = {
  userName: "Student",
  totalBalance: 2450.00,
  emergencyFund: 1200,
  savingsGoal: 5000,
  categories: {
    [CategoryType.LIVING]: {
      id: CategoryType.LIVING,
      spent: 450,
      limit: 800,
      transactions: [
        { id: '1', date: '2023-11-20', amount: 300, description: 'Monthly Rent', category: CategoryType.LIVING, subCategory: 'Rent' },
        { id: '2', date: '2023-11-22', amount: 45, description: 'Grocery Run', category: CategoryType.LIVING, subCategory: 'Food' },
      ]
    },
    [CategoryType.TRANSPORT]: {
      id: CategoryType.TRANSPORT,
      spent: 120,
      limit: 200,
      transactions: [
        { id: '3', date: '2023-11-21', amount: 20, description: 'Uber to Campus', category: CategoryType.TRANSPORT, subCategory: 'Cab' },
        { id: '4', date: '2023-11-23', amount: 10, description: 'Bus Pass Top-up', category: CategoryType.TRANSPORT, subCategory: 'Bus' },
      ]
    },
    [CategoryType.FINANCE]: {
      id: CategoryType.FINANCE,
      spent: 50,
      limit: 150,
      transactions: [
        { id: '5', date: '2023-11-19', amount: 50, description: 'Investment App', category: CategoryType.FINANCE, subCategory: 'Savings' },
      ]
    },
    [CategoryType.EMERGENCY]: {
      id: CategoryType.EMERGENCY,
      spent: 0,
      limit: 1000,
      transactions: []
    }
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'app'>('landing');
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<'dashboard' | CategoryType>('dashboard');
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>("Welcome to fintrack! I'm calculating your financial insights...");
  const [quickTips, setQuickTips] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Auth Form State
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  const fetchInsights = useCallback(async (category: CategoryType) => {
    const insight = await getFinancialInsights(state, category);
    setAiInsight(insight);
  }, [state]);

  const fetchInitialData = useCallback(async () => {
    const tips = await getQuickTips();
    setQuickTips(tips);
    const initialInsight = await getFinancialInsights(state, CategoryType.LIVING);
    setAiInsight(initialInsight);
  }, [state]);

  useEffect(() => {
    if (view === 'app') {
      fetchInitialData();
    }
  }, [view, fetchInitialData]);

  const handlePayment = (amount: number, category: CategoryType, description: string, upiId: string) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      amount,
      description,
      category,
      upiId
    };

    setState(prev => {
      const updatedCategory = { ...prev.categories[category] };
      updatedCategory.spent += amount;
      updatedCategory.transactions = [newTransaction, ...updatedCategory.transactions];

      const newState = {
        ...prev,
        totalBalance: prev.totalBalance - amount,
        categories: {
          ...prev.categories,
          [category]: updatedCategory
        }
      };

      const progress = (updatedCategory.spent / updatedCategory.limit) * 100;
      if (progress >= 100) {
        setNotifications(n => [...n, `CRITICAL: You have exceeded your ${category} limit!`]);
      } else if (progress >= 80) {
        setNotifications(n => [...n, `Warning: You have used 80% of your ${category} budget.`]);
      }

      return newState;
    });
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'signup' && authName) {
      setState(prev => ({ ...prev, userName: authName }));
    } else if (view === 'login' && authEmail) {
      setState(prev => ({ ...prev, userName: authEmail.split('@')[0] }));
    }
    setView('app');
  };

  const getPieData = () => {
    const categoryStates = Object.values(state.categories) as CategoryState[];
    return categoryStates.map(cat => ({
      name: cat.id,
      value: cat.spent
    }));
  };

  const COLORS = ['#6366f1', '#f59e0b', '#ec4899', '#10b981'];

  const renderLanding = () => (
    <div className="min-h-screen bg-white">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">fintrack</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setView('login')} className="px-6 py-2.5 font-bold text-slate-600 hover:text-indigo-600 transition-all">Login</button>
          <button onClick={() => setView('signup')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Sign Up</button>
        </div>
      </nav>

      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-8 animate-bounce">
          <Zap className="w-4 h-4" />
          The #1 Student Financial App
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          Track Money,<br />
          <span className="text-indigo-600">Build Future.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
          Built specifically for students. Track expenses, set limits, and prepare for emergencies with fintrack's AI-powered insights.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button onClick={() => setView('signup')} className="w-full md:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group">
            Get Started with fintrack
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-slate-400 font-bold">No credit card required</p>
        </div>

        <div className="mt-20 relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-indigo-400 blur-[100px] opacity-20 -z-10 rounded-full"></div>
          <div className="glass-card rounded-[32px] p-8 md:p-12 shadow-2xl border-indigo-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><PieChartIcon className="w-5 h-5" /></div>
                    <span className="font-bold">Living Expenses</span>
                  </div>
                  <span className="font-black text-emerald-600">$450 / $800</span>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Bus className="w-5 h-5" /></div>
                    <span className="font-bold">Commute</span>
                  </div>
                  <span className="font-black text-amber-600">$120 / $200</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-2">Smart Dashboard</h3>
                <p className="text-slate-500 font-medium">Visualize your spending patterns and get real-time alerts before you overspend.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-16">Designed for Student Life</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform"><CreditCard className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold mb-4">Mock UPI Pay</h3>
              <p className="text-slate-500 font-medium">Simulate real-time spending with our integrated mock payment system.</p>
            </div>
            <div className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform"><ShieldCheck className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold mb-4">Emergency Readiness</h3>
              <p className="text-slate-500 font-medium">Build a safety net with specific tracking for medical and urgent costs.</p>
            </div>
            <div className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform"><MessageCircle className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold mb-4">AI Spending Tips</h3>
              <p className="text-slate-500 font-medium">Get personalized advice powered by Gemini to optimize your daily habits.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderAuth = (type: 'login' | 'signup') => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <button onClick={() => setView('landing')} className="inline-flex items-center gap-2 mb-6 hover:scale-105 transition-transform">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">fintrack</span>
          </button>
          <h2 className="text-3xl font-extrabold text-slate-900">{type === 'login' ? 'Welcome Back!' : 'Join fintrack'}</h2>
          <p className="text-slate-500 mt-2 font-semibold">
            {type === 'login' ? 'Continue managing your finances securely.' : 'Join thousands of students saving more.'}
          </p>
        </div>

        <form onSubmit={handleAuthSubmit} className="bg-white p-10 rounded-[40px] shadow-2xl shadow-indigo-100 border border-slate-100 space-y-6">
          {type === 'signup' && (
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  required
                  type="text" 
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Alex Johnson" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400" 
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                required
                type="email" 
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="student@university.edu" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                required
                type="password" 
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400" 
              />
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all">
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="text-center pt-2">
            <button type="button" onClick={() => setView(type === 'login' ? 'signup' : 'login')} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
              {type === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        </form>
        
        <p className="text-center mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Secured with fintrack encryption
        </p>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Hello, {state.userName} 👋</h1>
          <p className="text-slate-500 font-medium">Your monthly fintrack summary is ready.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsUpiModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <CreditCard className="w-5 h-5" />
            Mock UPI Pay
          </button>
          <button 
            onClick={() => {
              setView('landing');
              setAuthName('');
              setAuthEmail('');
              setAuthPassword('');
            }}
            className="p-3 border border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Logout"
          >
            <Lock className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          category={state.categories[CategoryType.LIVING]} 
          icon={Home} 
          color="bg-indigo-600" 
          onClick={() => { setActiveTab(CategoryType.LIVING); fetchInsights(CategoryType.LIVING); }} 
        />
        <StatsCard 
          category={state.categories[CategoryType.TRANSPORT]} 
          icon={Bus} 
          color="bg-amber-500" 
          onClick={() => { setActiveTab(CategoryType.TRANSPORT); fetchInsights(CategoryType.TRANSPORT); }} 
        />
        <StatsCard 
          category={state.categories[CategoryType.FINANCE]} 
          icon={TrendingUp} 
          color="bg-pink-500" 
          onClick={() => { setActiveTab(CategoryType.FINANCE); fetchInsights(CategoryType.FINANCE); }} 
        />
        <StatsCard 
          category={state.categories[CategoryType.EMERGENCY]} 
          icon={HeartPulse} 
          color="bg-emerald-500" 
          onClick={() => { setActiveTab(CategoryType.EMERGENCY); fetchInsights(CategoryType.EMERGENCY); }} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PieChartIcon className="w-6 h-6 text-indigo-600" />
              Spending Distribution
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getPieData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getPieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {(Object.values(state.categories) as CategoryState[]).flatMap(c => c.transactions).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${tx.category === CategoryType.LIVING ? 'bg-indigo-100 text-indigo-600' : tx.category === CategoryType.TRANSPORT ? 'bg-amber-100 text-amber-600' : tx.category === CategoryType.FINANCE ? 'bg-pink-100 text-pink-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {tx.category === CategoryType.LIVING ? <Home className="w-5 h-5" /> : tx.category === CategoryType.TRANSPORT ? <Bus className="w-5 h-5" /> : tx.category === CategoryType.FINANCE ? <TrendingUp className="w-5 h-5" /> : <HeartPulse className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{tx.description}</h4>
                      <p className="text-sm text-slate-400 font-medium">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">-${tx.amount.toFixed(2)}</span>
                </div>
              ))}
              {(Object.values(state.categories) as CategoryState[]).flatMap(c => c.transactions).length === 0 && (
                <p className="text-center text-slate-400 py-8 font-medium">No transactions yet. Start tracking!</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              fintrack AI Insight
            </h2>
            <p className="text-indigo-100 leading-relaxed font-medium">
              "{aiInsight}"
            </p>
            <div className="mt-6 pt-6 border-t border-indigo-500/30 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Smart Analysis</span>
              <button onClick={() => fetchInsights(CategoryType.LIVING)} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all font-bold">Refresh</button>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Student Savings Goals
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-500 uppercase tracking-tighter">New Laptop Fund</span>
                  <span className="text-indigo-600">$850 / $1200</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[70%] transition-all duration-1000"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-500 uppercase tracking-tighter">Summer Vacation</span>
                  <span className="text-emerald-600">$400 / $2000</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[20%] transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Student Tips</h2>
            <div className="space-y-4">
              {quickTips.map((tip, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-snug">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategoryDetail = (type: CategoryType) => {
    const cat = state.categories[type];
    const progress = (cat.spent / cat.limit) * 100;

    return (
      <div className="space-y-8 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:translate-x-[-4px] transition-transform"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex gap-2">
             <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all"><Settings className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-3xl p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8">
                {type === CategoryType.LIVING && <Home className="w-24 h-24 text-indigo-50/50" />}
                {type === CategoryType.TRANSPORT && <Bus className="w-24 h-24 text-amber-50/50" />}
                {type === CategoryType.FINANCE && <TrendingUp className="w-24 h-24 text-pink-50/50" />}
                {type === CategoryType.EMERGENCY && <HeartPulse className="w-24 h-24 text-emerald-50/50" />}
              </div>
              
              <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{type} Details</h1>
              <p className="text-slate-500 font-medium mb-8">Management for your monthly {type.toLowerCase()} costs.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Spent</p>
                  <p className="text-2xl font-bold text-slate-900">${cat.spent}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Limit</p>
                  <p className="text-2xl font-bold text-slate-900">${cat.limit}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Remaining</p>
                  <p className={`text-2xl font-bold ${progress >= 100 ? 'text-red-500' : 'text-emerald-500'}`}>
                    ${Math.max(0, cat.limit - cat.spent)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-slate-500">Budget Usage</span>
                  <span className={progress >= 100 ? 'text-red-500' : progress >= 80 ? 'text-amber-500' : 'text-indigo-600'}>
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${progress >= 100 ? 'bg-red-500' : progress >= 80 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Transaction History</h2>
                <button 
                  onClick={() => setIsUpiModalOpen(true)}
                  className="text-indigo-600 font-bold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>
              <div className="space-y-4">
                {cat.transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400 font-medium">No transactions logged for {type}.</p>
                  </div>
                ) : (
                  cat.transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-600 font-bold">
                          {tx.date.split('-')[2]}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{tx.description}</h4>
                          <p className="text-sm text-slate-400 font-medium">UPI: {tx.upiId || 'N/A'}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-slate-900">-${tx.amount.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 rounded-3xl p-8 text-white">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                fintrack Category Insight
              </h2>
              <p className="text-slate-300 leading-relaxed italic">
                "{aiInsight}"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">AI</div>
                <div>
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Powered by</p>
                  <p className="text-sm font-bold">fintrack AI Assistant</p>
                </div>
              </div>
            </div>

            {type === CategoryType.EMERGENCY && (
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Emergency Readiness</h2>
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-emerald-100 relative mb-4">
                    <span className="text-3xl font-bold text-emerald-600">82%</span>
                    <div className="absolute inset-0 rounded-full border-8 border-emerald-500 border-t-transparent animate-spin-slow"></div>
                  </div>
                  <p className="text-slate-600 font-medium">You're nearly ready for most small emergencies!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderApp = () => (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      <aside className="w-20 lg:w-72 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen sticky top-0 transition-all">
        <div className="p-8">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight hidden lg:block">fintrack</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <Home className="w-6 h-6 shrink-0" />
            <span className="hidden lg:block">Dashboard</span>
          </button>
          
          <div className="pt-4 pb-2 px-4">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden lg:block">Categories</span>
          </div>

          <button 
            onClick={() => { setActiveTab(CategoryType.LIVING); fetchInsights(CategoryType.LIVING); }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === CategoryType.LIVING ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <Home className="w-6 h-6 shrink-0" />
            <span className="hidden lg:block">Living</span>
          </button>
          <button 
            onClick={() => { setActiveTab(CategoryType.TRANSPORT); fetchInsights(CategoryType.TRANSPORT); }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === CategoryType.TRANSPORT ? 'bg-amber-50 text-amber-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <Bus className="w-6 h-6 shrink-0" />
            <span className="hidden lg:block">Transport</span>
          </button>
          <button 
            onClick={() => { setActiveTab(CategoryType.FINANCE); fetchInsights(CategoryType.FINANCE); }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === CategoryType.FINANCE ? 'bg-pink-50 text-pink-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <TrendingUp className="w-6 h-6 shrink-0" />
            <span className="hidden lg:block">Management</span>
          </button>
          <button 
            onClick={() => { setActiveTab(CategoryType.EMERGENCY); fetchInsights(CategoryType.EMERGENCY); }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === CategoryType.EMERGENCY ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <HeartPulse className="w-6 h-6 shrink-0" />
            <span className="hidden lg:block">Emergency</span>
          </button>
        </nav>

        <div className="p-4">
          <div className="bg-slate-50 rounded-2xl p-4 hidden lg:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-2">Total Balance</p>
            <p className="text-2xl font-black text-slate-800">${state.totalBalance.toFixed(2)}</p>
            <button className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-slate-200 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all">
              Top Up
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-h-screen">
        <header className="flex justify-between items-center mb-12 md:hidden">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="flex gap-4">
               <button className="p-2 text-slate-400"><Bell className="w-6 h-6" /></button>
               <div className="w-10 h-10 rounded-full bg-slate-200"></div>
            </div>
        </header>

        {activeTab === 'dashboard' ? renderDashboard() : renderCategoryDetail(activeTab as CategoryType)}

        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2">
          {notifications.map((notif, i) => (
            <div key={i} className="animate-in slide-in-from-right bg-white border-l-4 border-red-500 p-4 rounded-xl shadow-xl flex items-start gap-4 max-w-sm">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-800">{notif}</p>
                <button onClick={() => setNotifications(ns => ns.filter((_, idx) => idx !== i))} className="text-xs text-slate-400 hover:text-slate-600 font-bold mt-1">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <UpiModal 
        isOpen={isUpiModalOpen} 
        onClose={() => setIsUpiModalOpen(false)} 
        onPayment={handlePayment} 
      />
    </div>
  );

  return (
    <>
      {view === 'landing' && renderLanding()}
      {view === 'login' && renderAuth('login')}
      {view === 'signup' && renderAuth('signup')}
      {view === 'app' && renderApp()}
    </>
  );
};

export default App;
