import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { FirebaseProvider, useAuth } from './components/FirebaseProvider';
import { ErrorBoundary, handleFirestoreError } from './lib/errorHandlers';
import { 
  Home, 
  User, 
  Settings, 
  LogOut, 
  LogIn, 
  Gamepad2, 
  Wallet, 
  History, 
  ShieldCheck,
  Menu,
  X,
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  Gift,
  MessageCircle,
  RefreshCw,
  Trophy,
  Calendar,
  Zap,
  Star,
  Flame,
  Crown,
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Dices,
  Gamepad,
  FileText,
  Bell,
  BarChart3,
  CheckCircle2,
  CreditCard,
  ChevronDown,
  Search,
  Image,
  Upload,
  ChevronLeft,
  Maximize2,
  Minus,
  Info,
  MessageSquare,
  Send,
  Video,
  Monitor
} from 'lucide-react';
import { rtdb, auth } from './firebase';
import { UserProfile, Transaction, TransactionStatus, OperationType } from './types';
import { 
  ref, 
  set, 
  push, 
  onValue, 
  get, 
  update, 
  increment, 
  remove,
  query, 
  orderByChild, 
  limitToLast,
  equalTo 
} from 'firebase/database';
import { signOut, updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, sendPasswordResetEmail } from 'firebase/auth';

// --- Components ---

const Marquee = () => (
  <div className="marquee-container">
    <div className="marquee-content">
      हाम्रो Himalaya 777 गेम संसारमा स्वागत छ! नेपालको सबैभन्दा लोकप्रिय गेमिङ्ग प्लेटफर्ममा सामेल हुनुहोस् र आफ्नो जित्ने मौका समात्नुहोस्! 😊
    </div>
  </div>
);

const JackpotDisplay = () => {
  const [jackpot, setJackpot] = React.useState(297514829);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 100));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-red-600 to-red-900 p-4 rounded-xl border-4 border-himalaya-gold shadow-[0_0_20px_rgba(251,191,36,0.3)] text-center my-4">
      <div className="text-himalaya-gold font-black text-xl italic tracking-widest mb-2 uppercase">JACKPOT</div>
      <div className="flex justify-center gap-1">
        {jackpot.toString().split('').map((num, i) => (
          <div key={i} className="bg-white text-black font-black text-2xl md:text-4xl w-8 md:w-12 h-10 md:h-14 flex items-center justify-center rounded-md border-2 border-gray-300 shadow-inner">
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};
const SLOT_GAMES = [
  { id: 1, name: "Fortune Gems Legend", image: "https://picsum.photos/seed/gems7/400/400" },
  { id: 2, name: "3 Coin Wild Tiger", image: "https://picsum.photos/seed/tiger9/400/400" },
  { id: 3, name: "Coin of Lightning", image: "https://picsum.photos/seed/elec/400/400" },
  { id: 4, name: "10 Sparkling Crown", image: "https://picsum.photos/seed/king/400/400" },
  { id: 5, name: "SUPER MAHJONG 2", image: "https://picsum.photos/seed/tile/400/400" },
  { id: 6, name: "Party Ape", image: "https://picsum.photos/seed/monkey3/400/400" },
  { id: 7, name: "3 Super Ace", image: "https://picsum.photos/seed/cards/400/400" },
  { id: 8, name: "Fortune Hook Antarctic", image: "https://picsum.photos/seed/icefish/400/400" },
  { id: 9, name: "Lucky Jaguar 500", image: "https://picsum.photos/seed/jaguar2/400/400" },
  { id: 10, name: "Boxing King Match", image: "https://picsum.photos/seed/box/400/400" },
  { id: 11, name: "Money Pot Deluxe", image: "https://picsum.photos/seed/goldpot/400/400" },
  { id: 12, name: "3 Lucky Baozhu", image: "https://picsum.photos/seed/china8/400/400" },
  { id: 13, name: "Clover Coins 3x3", image: "https://picsum.photos/seed/clover9/400/400" },
  { id: 14, name: "3 Witch's Lamp", image: "https://picsum.photos/seed/witch5/400/400" },
  { id: 15, name: "20 Blazing Clover", image: "https://picsum.photos/seed/fire9/400/400" },
  { id: 16, name: "Joker Coins Expanded", image: "https://picsum.photos/seed/joker9/400/400" },
  { id: 17, name: "The Pig House", image: "https://picsum.photos/seed/piggy/400/400" },
  { id: 18, name: "Legacy of Egypt", image: "https://picsum.photos/seed/egypt9/400/400" },
  { id: 19, name: "Nightfall Hunting", image: "https://picsum.photos/seed/night/400/400" },
  { id: 20, name: "Treasure Quest", image: "https://picsum.photos/seed/quest/400/400" },
  { id: 21, name: "Neko Fortune", image: "https://picsum.photos/seed/neko9/400/400" },
  { id: 22, name: "Wild Racer", image: "https://picsum.photos/seed/racing/400/400" },
  { id: 23, name: "Pirate Queen 2", image: "https://picsum.photos/seed/ship/400/400" },
  { id: 24, name: "Agent Ace", image: "https://picsum.photos/seed/spy/400/400" },
  { id: 25, name: "Medusa", image: "https://picsum.photos/seed/snake/400/400" },
  { id: 26, name: "Thor X", image: "https://picsum.photos/seed/thor9/400/400" },
  { id: 27, name: "Gold Rush", image: "https://picsum.photos/seed/mine/400/400" },
  { id: 28, name: "Aztec Priestess", image: "https://picsum.photos/seed/maya/400/400" },
  { id: 29, name: "Sin City", image: "https://picsum.photos/seed/vegas/400/400" },
  { id: 30, name: "Fortune Monkey", image: "https://picsum.photos/seed/chimp/400/400" },
];

const LIVE_GAMES = [
  { id: 101, name: "Evolution Baccarat", image: "https://picsum.photos/seed/baccarat/400/400", provider: "EVO" },
  { id: 102, name: "Lightning Roulette", image: "https://picsum.photos/seed/roulette/400/400", provider: "EVO" },
  { id: 103, name: "Crazy Time", image: "https://picsum.photos/seed/crazy/400/400", provider: "EVO" },
  { id: 104, name: "Sexy Baccarat", image: "https://picsum.photos/seed/sexy/400/400", provider: "AE" },
  { id: 105, name: "Dragon Tiger", image: "https://picsum.photos/seed/dragon/400/400", provider: "SA" },
  { id: 106, name: "Sic Bo Deluxe", image: "https://picsum.photos/seed/sicbo/400/400", provider: "DG" },
  { id: 107, name: "Mega Ball", image: "https://picsum.photos/seed/ball/400/400", provider: "EVO" },
  { id: 108, name: "Dream Catcher", image: "https://picsum.photos/seed/dream/400/400", provider: "EVO" },
  { id: 109, name: "Fan Tan", image: "https://picsum.photos/seed/fantan/400/400", provider: "EVO" },
  { id: 110, name: "Bull Bull", image: "https://picsum.photos/seed/bull/400/400", provider: "AG" },
  { id: 111, name: "Poker Hold'em", image: "https://picsum.photos/seed/poker/400/400", provider: "EVO" },
  { id: 112, name: "Super 6 Baccarat", image: "https://picsum.photos/seed/baccarat2/400/400", provider: "SA" },
  { id: 113, name: "Speed Roulette", image: "https://picsum.photos/seed/roulette2/400/400", provider: "EVO" },
  { id: 114, name: "Monopoly Live", image: "https://picsum.photos/seed/monopoly/400/400", provider: "EVO" },
  { id: 115, name: "Mega Wheel", image: "https://picsum.photos/seed/wheel/400/400", provider: "PP" },
  { id: 116, name: "Andar Bahar", image: "https://picsum.photos/seed/andar/400/400", provider: "EZ" },
  { id: 117, name: "Teen Patti", image: "https://picsum.photos/seed/teen/400/400", provider: "EZ" },
  { id: 118, name: "No Commission Baccarat", image: "https://picsum.photos/seed/baccarat3/400/400", provider: "DG" },
  { id: 119, name: "Auto Roulette", image: "https://picsum.photos/seed/roulette3/400/400", provider: "EVO" },
  { id: 120, name: "Fish Prawn Crab", image: "https://picsum.photos/seed/crab/400/400", provider: "KING" },
];

const HomePage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [liveDeposits, setLiveDeposits] = React.useState<Transaction[]>([]);
  const [liveWithdrawals, setLiveWithdrawals] = React.useState<Transaction[]>([]);
  const [publicMessages, setPublicMessages] = React.useState<any[]>([]);
  const [newPublicMsg, setNewPublicMsg] = React.useState('');

  React.useEffect(() => {
    if (profile?.role === 'admin') {
      navigate('/admin');
    }
  }, [profile, navigate]);

  React.useEffect(() => {
    // Only fetch public approved transactions
    const transRef = ref(rtdb, 'transactions');
    const liveQuery = query(transRef, orderByChild('status'), equalTo('approved'), limitToLast(20));
    
    const unsubscribe = onValue(liveQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allTrans: Transaction[] = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        
        setLiveDeposits(allTrans.filter(t => t.type === 'deposit').slice(-10));
        setLiveWithdrawals(allTrans.filter(t => t.type === 'withdrawal').slice(-10));
      }
    }, (err) => {
      if (err.message?.toLowerCase().includes('permission_denied') || err.message?.toLowerCase().includes('permission denied')) return;
      console.error("Live Activity Listener Error:", err);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const chatRef = ref(rtdb, 'public_chat');
    const chatQuery = query(chatRef, limitToLast(20));
    const unsubscribe = onValue(chatQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const msgs = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setPublicMessages(msgs);
      }
    }, (err) => {
       if (err.message?.toLowerCase().includes('permission_denied') || err.message?.toLowerCase().includes('permission denied')) return;
       console.error("Public Chat Listener Error:", err);
    });
    return () => unsubscribe();
  }, []);

  const combinedActivity = React.useMemo(() => {
    const activities = [
      ...liveDeposits.map(t => ({ ...t, activityType: 'deposit' })),
      ...liveWithdrawals.map(t => ({ ...t, activityType: 'withdrawal' })),
      ...publicMessages.map(m => ({ ...m, activityType: 'message' }))
    ];
    return activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 15);
  }, [liveDeposits, liveWithdrawals, publicMessages]);

  const sendPublicMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !newPublicMsg.trim()) return;
    
    try {
      const chatRef = push(ref(rtdb, 'public_chat'));
      await set(chatRef, {
        userId: profile.uid,
        userName: profile.displayName,
        text: newPublicMsg,
        createdAt: new Date().toISOString()
      });
      setNewPublicMsg('');
    } catch (err) {
      console.error(err);
    }
  };

  const [selectedCategory, setSelectedCategory] = React.useState<string>('SLOT');
  const [activeGame, setActiveGame] = React.useState<any>(null);
  const [gameLinks, setGameLinks] = React.useState({ slot: '', live: '', casino: '', sport: '', fish: '', fast: '', event: '' });

  React.useEffect(() => {
    const glRef = ref(rtdb, 'settings/gameLinks');
    const unsub = onValue(glRef, (snap) => {
      if (snap.exists()) setGameLinks(p => ({ ...p, ...snap.val() }));
    });
    return () => unsub();
  }, []);

  const [notice, setNotice] = React.useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const claimBonus = async () => {
    if (!profile) return;
    
    // Check if balance is finished (<= 0)
    if (profile.balance > 0) {
      alert('तपाईंसँग अझै ब्यालेन्स छ। बोनस दाबी गर्न ब्यालेन्स ० हुनुपर्छ।');
      return;
    }

    // Check if already claimed today
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastBonusClaimedAt?.startsWith(today)) {
      alert('तपाईंले आजको बोनस दाबी गरिसक्नुभएको छ!');
      return;
    }

    // Check if user has at least one approved deposit
    const transRef = ref(rtdb, 'transactions');
    const transSnap = await get(query(transRef, orderByChild('userId'), equalTo(profile.uid)));
    let hasDeposit = false;
    if (transSnap.exists()) {
      transSnap.forEach(child => {
        if (child.val().type === 'deposit' && child.val().status === 'approved') {
          hasDeposit = true;
        }
      });
    }

    if (!hasDeposit) {
      alert('बोनस दाबी गर्न कम्तिमा एउटा डिपोजिट सफल भएको हुनुपर्छ!');
      return;
    }

    // Calculate streak
    let newStreak = (profile.bonusStreak || 0) + 1;
    if (newStreak > 7) newStreak = 1;

    // Bonus ranges
    let min = 20, max = 100;
    if (newStreak === 2) { min = 30; max = 100; }
    else if (newStreak === 3) { min = 20; max = 50; }
    else if (newStreak === 4) { min = 40; max = 100; }
    else if (newStreak >= 5) { min = 50; max = 150; }

    const bonusAmount = 100; // Fixed 100 as requested
    const bonusTurnoverTarget = bonusAmount * 20; // 20x turnover requirement

    try {
      // Update balance, streak, and turnover target
      await update(ref(rtdb, `users/${profile.uid}`), {
        balance: increment(bonusAmount),
        bonusStreak: newStreak,
        lastBonusClaimedAt: new Date().toISOString(),
        turnover: 0,
        turnoverTarget: bonusTurnoverTarget
      });

      // Record as a transaction for admin to see
      const bonusTransRef = push(ref(rtdb, 'transactions'));
      await set(bonusTransRef, {
        userId: profile.uid,
        userName: profile.displayName,
        type: 'bonus',
        amount: bonusAmount,
        status: 'approved',
        description: `Daily Bonus Day ${newStreak}`,
        createdAt: new Date().toISOString()
      });

      // Send Notification
      const notifRef = push(ref(rtdb, `notifications/${profile.uid}`));
      await set(notifRef, {
        message: `बधाई छ! तपाईंले NPR ${bonusAmount} बोनस प्राप्त गर्नुभयो।`,
        type: 'approved',
        amount: bonusAmount,
        createdAt: new Date().toISOString(),
        read: false
      });

      // Send Auto Admin Message in Chat
      const chatMsgRef = push(ref(rtdb, `chats/${profile.uid}/messages`));
      await set(chatMsgRef, {
        text: `बधाई छ ${profile.displayName}! तपाईंले आजको NPR ${bonusAmount} बोनस सफलतापूर्वक दाबी गर्नुभयो। अब तपाईं गेम खेल्न सक्नुहुन्छ।`,
        sender: 'admin',
        senderName: 'Admin Support',
        createdAt: new Date().toISOString()
      });

      alert(`बधाई छ! तपाईंले Day ${newStreak} को लागि NPR ${bonusAmount} बोनस प्राप्त गर्नुभयो!`);
    } catch (err) {
      console.error(err);
      alert('बोनस दाबी गर्न असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।');
    }
  };

  const playGame = async (amount: number) => {
    if (!profile) return;
    if (profile.balance < amount) {
      alert('तपाईंसँग पर्याप्त ब्यालेन्स छैन। कृपया डिपोजिट गर्नुहोस्।');
      return;
    }

    try {
      const newBalance = profile.balance - amount;
      const updates: any = {
        balance: increment(-amount),
        turnover: increment(amount)
      };

      // If balance is finished (sakiyo), reset turnover to 0
      if (newBalance <= 0) {
        updates.turnover = 0;
        updates.turnoverTarget = 0;
      }

      // Check for special bonus: 3000 turnover -> 200 bonus
      const currentTurnover = (profile.turnover || 0) + amount;
      if (currentTurnover >= 3000 && (profile.turnover || 0) < 3000) {
        updates.balance = increment(200);
        
        // Record bonus transaction
        const bonusTransRef = push(ref(rtdb, 'transactions'));
        await set(bonusTransRef, {
          userId: profile.uid,
          userName: profile.displayName,
          type: 'bonus',
          amount: 200,
          status: 'approved',
          description: '3000 Turnover Achievement Bonus',
          createdAt: new Date().toISOString()
        });
      }

      await update(ref(rtdb, `users/${profile.uid}`), updates);
    } catch (err) {
      console.error(err);
    }
  };

  if (profile?.role === 'admin') return null;

  return (
    <div className="space-y-4 pb-24">
      {/* Banner Carousel (Simplified) */}
      <div className="relative h-40 md:h-64 rounded-2xl overflow-hidden border-2 border-himalaya-gold/30">
        <img 
          src="https://picsum.photos/seed/casino/1200/600" 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1 rounded-full ${i === 1 ? 'w-8 bg-himalaya-gold' : 'w-2 bg-white/50'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* User Welcome Box */}
      {profile && (
        <div className="glass-panel p-4 border-2 border-himalaya-gold/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-himalaya-gold overflow-hidden bg-himalaya-dark flex items-center justify-center">
              <User size={32} className="text-himalaya-gold" />
            </div>
            <div>
              <div className="text-sm text-gray-400">स्वागत छ, <span className="text-himalaya-gold font-bold">{profile.displayName}</span></div>
              <div className="text-xs text-gray-500">प्रयोगकर्ता नाम: {profile.uid.slice(0, 8).toUpperCase()}</div>
              <div className="text-xs text-gray-500">{profile.bankName || 'Khalti'} ({profile.phoneNumber || profile.email.split('@')[0]})</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="text-[10px] text-himalaya-red font-black uppercase tracking-widest mb-1">Total Balance</div>
            <div className="text-3xl font-black text-gray-900 tracking-tighter">NPR {Math.max(0, profile.balance).toFixed(2)}</div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => navigate('/wallet')} className="bg-himalaya-red text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-900/20 hover:scale-105 transition-all flex items-center gap-2">
                <Plus size={14} /> DEPOSIT
              </button>
              <button onClick={() => navigate('/wallet')} className="bg-himalaya-accent text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-900/20 hover:scale-105 transition-all flex items-center gap-2">
                <ArrowUpCircle size={14} /> WITHDRAW
              </button>
              <button onClick={() => window.location.reload()} className="bg-gray-100 text-gray-500 p-3 rounded-2xl hover:bg-gray-200 transition-all">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-4 border border-gray-100 bg-white shadow-xl rounded-[32px] overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              LIVE DEPOSITS
            </h3>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
            {combinedActivity.filter(a => a.activityType === 'deposit').length > 0 ? (
              combinedActivity.filter(a => a.activityType === 'deposit').map((activity: any, idx) => (
                <div key={activity.id || idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-100 animate-in slide-in-from-right duration-500">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                      <ArrowDownCircle size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight truncate w-24">
                        {activity.userName || 'Anonymous'}
                      </p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">SUCCESS</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-green-600">NPR {activity.amount.toLocaleString()}</p>
                    <p className="text-[7px] text-gray-400 font-bold uppercase">{new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-[8px] font-bold text-gray-300 uppercase tracking-widest">No recent deposits</p>
            )}
          </div>
        </div>

        <div className="glass-panel p-4 border border-gray-100 bg-white shadow-xl rounded-[32px] overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              LIVE WITHDRAWALS
            </h3>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
            {combinedActivity.filter(a => a.activityType === 'withdrawal').length > 0 ? (
              combinedActivity.filter(a => a.activityType === 'withdrawal').map((activity: any, idx) => (
                <div key={activity.id || idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-100 animate-in slide-in-from-right duration-500">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                      <ArrowUpCircle size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight truncate w-24">
                        {activity.userName || 'Anonymous'}
                      </p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">SUCCESS</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-orange-600">NPR {activity.amount.toLocaleString()}</p>
                    <p className="text-[7px] text-gray-400 font-bold uppercase">{new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-[8px] font-bold text-gray-300 uppercase tracking-widest">No recent withdrawals</p>
            )}
          </div>
        </div>
      </div>

      <JackpotDisplay />

      {/* Daily Check-In */}
      <div className="glass-panel p-4 border border-himalaya-gold/10">
        <h3 className="text-center text-himalaya-red font-black text-xl mb-4">Daily Check-In</h3>
        <div className="grid grid-cols-7 gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map(day => {
            const isCurrent = (profile?.bonusStreak || 0) + 1 === day;
            const isCompleted = (profile?.bonusStreak || 0) >= day;
            return (
              <div key={day} className={`flex flex-col items-center p-2 rounded-lg border transition-all ${isCurrent ? 'bg-himalaya-red/20 border-himalaya-red scale-110 z-10' : isCompleted ? 'bg-green-600/10 border-green-600/30' : 'bg-white/5 border-white/10 opacity-50'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${isCurrent ? 'bg-himalaya-red' : isCompleted ? 'bg-green-600' : 'bg-gray-700'}`}>
                  {isCompleted ? <CheckCircle2 size={12} className="text-white" /> : <Zap size={12} className="text-white" />}
                </div>
                <span className="text-[8px] text-gray-400">Day {day}</span>
              </div>
            );
          })}
        </div>
        <button 
          onClick={claimBonus}
          className="w-full mt-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-black rounded-xl uppercase text-sm shadow-lg shadow-green-900/40 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Claim Day {(profile?.bonusStreak || 0) % 7 + 1} Bonus
        </button>
        <p className="text-[8px] text-center text-gray-500 mt-2 uppercase font-bold tracking-widest italic">Deposit required to claim daily bonus</p>
      </div>

      {/* Notice System */}
      {notice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-black/90 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/10 backdrop-blur-xl">
          {notice}
        </div>
      )}

      {/* Game Categories */}
      <div className="grid grid-cols-6 gap-2">
        {[
          { name: 'EVENT', icon: Trophy },
          { name: 'SLOT', icon: Gamepad2 },
          { name: 'LIVE', icon: Video },
          { name: 'SPORT', icon: Zap },
          { name: 'FISH', icon: Flame },
          { name: 'FAST', icon: Crown },
        ].map((cat) => (
          <button 
            key={cat.name} 
            onClick={() => {
              setSelectedCategory(cat.name);
              if (cat.name === 'EVENT') showNotice('Events coming soon!');
              if (cat.name === 'SPORT') showNotice('Sports betting coming soon!');
              if (cat.name === 'FISH') showNotice('Fishing games coming soon!');
              if (cat.name === 'FAST') showNotice('Fast games coming soon!');
            }}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-all"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all ${selectedCategory === cat.name ? 'bg-himalaya-gold text-himalaya-dark border-himalaya-gold' : 'bg-himalaya-dark border-himalaya-gold/30 text-himalaya-gold group-hover:bg-himalaya-gold group-hover:text-himalaya-dark'}`}>
              <cat.icon size={18} />
            </div>
            <span className={`text-[7px] md:text-[8px] font-bold text-center ${selectedCategory === cat.name ? 'text-himalaya-gold' : 'text-gray-400'}`}>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Game List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-4 bg-himalaya-gold rounded-full" />
            {selectedCategory} GAMES
          </h3>
          <span className="text-[10px] text-gray-500 font-bold uppercase">
            {selectedCategory === 'SLOT' ? SLOT_GAMES.length : selectedCategory === 'LIVE' ? LIVE_GAMES.length : '0'} Games Available
          </span>
        </div>

        {selectedCategory === 'SLOT' || selectedCategory === 'LIVE' ? (
          <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6">
            {(selectedCategory === 'SLOT' ? SLOT_GAMES : LIVE_GAMES).map((game) => (
              <div key={game.id} className="flex flex-col gap-2 group">
                <button 
                  onClick={() => {
                    playSound('click');
                    if (!profile) {
                      showNotice('Please login to play!');
                      navigate('/login');
                      return;
                    }
                    
                    const catKey = selectedCategory.toLowerCase();
                    const extLink = (gameLinks as any)[catKey];
                    
                    if (extLink && extLink.trim() !== '') {
                      window.open(extLink, '_blank');
                      return;
                    }

                    if (selectedCategory === 'SLOT') {
                      setActiveGame(game);
                    } else {
                      showNotice(`${game.name} starting...`);
                    }
                  }}
                  className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl transition-all active:scale-95 bg-gradient-to-br from-gray-200 to-gray-400 group-hover:border-[#ffcc00] group-hover:shadow-[0_0_20px_rgba(255,204,0,0.3)]"
                >
                  <img 
                    src={game.image} 
                    alt={game.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {selectedCategory === 'LIVE' && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[6px] font-black px-1.5 py-0.5 rounded-sm animate-pulse">
                      <div className="w-1 h-1 bg-white rounded-full" />
                      LIVE
                    </div>
                  )}

                  {/* Corner Brand Logo Indicator */}
                  <div className="absolute top-1 right-1 flex flex-col items-end gap-0.5">
                     <div className="bg-[#b83125] text-white text-[5px] font-black px-1 rounded-sm border border-white/20">
                       {(game as any).provider || 'JILI'}
                     </div>
                  </div>
                </button>
                <div className="text-center px-1">
                  <p className="text-[9px] font-black text-white/90 uppercase tracking-tighter truncate group-hover:text-[#ffcc00] transition-colors">
                    {game.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 text-center border border-white/5">
            <Gamepad2 size={32} className="mx-auto text-gray-600 mb-2 opacity-20" />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Coming Soon</p>
            <p className="text-[10px] text-gray-600 mt-1">We are adding more {selectedCategory.toLowerCase()} games shortly.</p>
          </div>
        )}
      </div>

      {/* Full Screen Game Modal */}
      {activeGame && (
        <GameModal 
          game={activeGame} 
          profile={profile} 
          onClose={() => setActiveGame(null)} 
          playGame={playGame}
          showNotice={showNotice}
          externalLink={(gameLinks as any)[selectedCategory.toLowerCase()]}
        />
      )}
    </div>
  );
};

// Game Modal Component to handle both internal and external games
const GameModal = ({ game, profile, onClose, playGame, showNotice, externalLink }: { 
  game: any, 
  profile: any, 
  onClose: () => void, 
  playGame: (amount: number) => Promise<void>,
  showNotice: (msg: string) => void,
  externalLink?: string 
}) => {
  const isExternal = externalLink && externalLink.trim() !== '';

  return (
    <div className="fixed inset-0 z-[300] bg-black/95 flex flex-col animate-in fade-in zoom-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/50 border-b border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <img src={game.image} alt={game.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" referrerPolicy="no-referrer" />
          <div>
            <h2 className="text-white font-black text-xs uppercase tracking-widest">{game.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest">Active Table</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 rounded-full flex items-center justify-center transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Game Content */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        {isExternal ? (
          <iframe 
            src={externalLink} 
            className="w-full h-full border-0"
            allow="autoplay; fullscreen"
            title={game.name}
          />
        ) : (
          <SlotGameEngine 
            game={game} 
            profile={profile} 
            onClose={onClose} 
            playGame={playGame}
            showNotice={showNotice}
          />
        )}
      </div>

      {/* Footer / Balance Bar */}
      <div className="bg-black/90 p-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-himalaya-dark rounded-xl border border-himalaya-gold/20">
            <p className="text-gray-500 text-[6px] font-black uppercase mb-0.5">Your Balance</p>
            <p className="text-himalaya-gold font-black text-sm tracking-tighter">NPR {profile?.balance?.toLocaleString() || '0'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 bg-himalaya-gold rounded-full flex items-center justify-center animate-bounce">
             <Trophy size={12} className="text-himalaya-dark" />
           </div>
           <p className="text-[10px] text-gray-400 font-bold uppercase">Good Luck!</p>
        </div>
      </div>
    </div>
  );
};

// Audio Utility
const playSound = (type: 'spin' | 'stop' | 'win' | 'click' | 'jackpot' | 'loss') => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  switch(type) {
    case 'click':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'spin':
      // Running "music" sound - rising pitch, longer for spin sequence
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(350, now + 5);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 5);
      osc.start(now);
      osc.stop(now + 5);
      break;
    case 'stop':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    case 'loss':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.5);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
    case 'win':
      // celebratory upward chord
      const winNotes = [523.25, 659.25, 783.99, 1046.50];
      winNotes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, now + i * 0.1);
        g.gain.setValueAtTime(0.1, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
        o.start(now + i * 0.1);
        o.stop(now + i * 0.1 + 0.4);
      });
      break;
    case 'loss':
      // Disappointing downward slide
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
      break;
    case 'jackpot':
      // Energetic sequence
      const jpNotes = [880, 1108.73, 1318.51, 1760];
      jpNotes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'square';
        o.frequency.setValueAtTime(freq, now + i * 0.08);
        g.gain.setValueAtTime(0.05, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.005, now + i * 0.08 + 1);
        o.start(now + i * 0.08);
        o.stop(now + i * 0.08 + 1);
      });
      break;
  }
};

const SlotGameEngine = ({ game, profile, onClose, playGame, showNotice }: { game: any, profile: any, onClose: () => void, playGame: (amount: number) => Promise<void>, showNotice: (msg: string) => void }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [bet, setBet] = React.useState(100);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [winAmount, setWinAmount] = React.useState(0);
  const [lastWin, setLastWin] = React.useState(0);
  const [jackpot, setJackpot] = React.useState(1250489);

  const theme = React.useMemo(() => ({
    symbols: ["🍒", "🍋", "🍊", "🍇", "🔔", "⭐", "7️⃣", "💎", "🎰", "🍉", "🍒", "7️⃣"],
    bg: "bg-zinc-900",
    accent: "#ffcc00",
    border: "rgba(255,255,255,0.05)"
  }), []);

  const reelState = React.useRef({
    reels: [
      { offset: 0, speed: 0, symbols: [theme.symbols[0], theme.symbols[1], theme.symbols[2]], target: null as string | null, stopped: true },
      { offset: 0, speed: 0, symbols: [theme.symbols[3], theme.symbols[4], theme.symbols[5]], target: null as string | null, stopped: true },
      { offset: 0, speed: 0, symbols: [theme.symbols[6], theme.symbols[7], theme.symbols[8]], target: null as string | null, stopped: true },
    ],
    lastTime: 0,
  });

  const drawReels = (timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!reelState.current.lastTime) reelState.current.lastTime = timestamp;
    const deltaTime = Math.min(timestamp - reelState.current.lastTime, 32);
    reelState.current.lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const reelWidth = canvas.width / 3;
    const symbolHeight = canvas.height / 3;

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    reelState.current.reels.forEach((reel, i) => {
      if (!reel.stopped) {
        reel.offset += reel.speed * (deltaTime / 16);
        if (reel.offset >= symbolHeight) {
          reel.offset %= symbolHeight;
          reel.symbols.unshift(theme.symbols[Math.floor(Math.random() * theme.symbols.length)]);
          reel.symbols.pop();
          if (reel.target !== null) {
            reel.speed *= 0.95;
            if (reel.speed < 2) {
              reel.speed = 0; reel.offset = 0; reel.stopped = true;
              reel.symbols[1] = reel.target; reel.target = null;
              playSound('stop');
              if (i === 2) finalizeSpin();
            }
          }
        }
      }

      reel.symbols.forEach((sym, j) => {
        const x = i * reelWidth + reelWidth / 2;
        const y = (j - 1) * symbolHeight + reel.offset + symbolHeight / 2;
        ctx.font = 'bold 72px "Segoe UI Emoji", "Apple Color Emoji"';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (reel.speed > 10) { ctx.globalAlpha = 0.4; ctx.fillText(sym, x, y - 10); ctx.fillText(sym, x, y + 10); ctx.globalAlpha = 1.0; }
        ctx.shadowBlur = 15; ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.fillText(sym, x, y); ctx.shadowBlur = 0;
      });
      ctx.strokeStyle = '#222'; ctx.lineWidth = 4; ctx.strokeRect(i * reelWidth, 0, reelWidth, canvas.height);
    });

    const grad = ctx.createLinearGradient(0,0,0,canvas.height);
    grad.addColorStop(0, 'rgba(0,0,0,0.7)'); grad.addColorStop(0.15, 'rgba(0,0,0,0)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.06)'); grad.addColorStop(0.85, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(drawReels);
  };

  React.useEffect(() => {
    const aid = requestAnimationFrame(drawReels);
    const jpi = setInterval(() => setJackpot(p => p + Math.floor(Math.random()*20)), 3000);
    return () => { cancelAnimationFrame(aid); clearInterval(jpi); };
  }, []);

  const finalizeSpin = () => {
    const central = reelState.current.reels.map(r => r.symbols[1]);
    const counts: any = {}; central.forEach(s => counts[s] = (counts[s]||0) + 1);
    let prize = 0;
    const hasThree = Object.values(counts).some(c => c === 3);
    const hasTwo = Object.values(counts).some(c => c === 2);
    if (hasThree) { prize = bet * 20; if (central[0] === '7️⃣') prize = bet * 100; playSound('jackpot'); }
    else if (hasTwo) { prize = bet * 3; playSound('win'); }
    else { playSound('loss'); }
    if (prize > 0) { setWinAmount(prize); setLastWin(prize); playGame(-prize); }
    setIsSpinning(false);
  };

  const spin = async () => {
    if (isSpinning) return;
    if (profile.balance < bet) { playSound('loss'); showNotice("Insufficent Balance! Please Deposit to continue."); return; }
    setIsSpinning(true); setWinAmount(0); playSound('spin');
    await push(ref(rtdb, 'live_sessions'), { 
      uid: profile.uid, 
      userName: profile.displayName || profile.phoneNumber, 
      gameName: game.name, 
      gameImage: game.image,
      category: 'SLOT',
      bet: bet, 
      createdAt: new Date().toISOString() 
    });
    await playGame(bet);
    reelState.current.reels.forEach((r, i) => {
      r.speed = 22 + Math.random() * 8; r.stopped = false;
      setTimeout(() => {
        const rando = Math.random();
        if (rando > 0.95) r.target = '7️⃣'; else if (rando > 0.9) r.target = '💎'; else r.target = theme.symbols[Math.floor(Math.random() * theme.symbols.length)];
      }, 1500 + i * 800);
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg p-6">
      {/* Ornate Jackpot Head */}
      <div className="w-full bg-[#050505] p-6 rounded-[3rem] border-4 border-himalaya-gold shadow-[0_0_50px_rgba(255,204,0,0.2)] text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-himalaya-gold/5 animate-pulse" />
        <p className="text-[10px] font-black text-himalaya-gold uppercase tracking-[0.5em] mb-2 drop-shadow-lg">Super Retro Jackpot</p>
        <div className="text-4xl font-black text-white font-mono tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          {jackpot.toLocaleString()}
        </div>
      </div>

      {/* Main Cabinet Reels */}
      <div className="relative w-full aspect-[4/3] bg-zinc-800 rounded-[3.5rem] border-[16px] border-zinc-900 shadow-[inset_0_0_80px_rgba(0,0,0,1),0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden p-6 ring-4 ring-white/5">
        <canvas ref={canvasRef} width={400} height={300} className="w-full h-full rounded-2xl shadow-inner bg-black" />
        
        {winAmount > 0 && !isSpinning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md animate-in zoom-in duration-500 rounded-3xl">
            <div className="bg-himalaya-gold text-zinc-950 px-14 py-7 rounded-3xl border-4 border-white font-black text-6xl shadow-[0_0_100px_rgba(255,204,0,1)] animate-bounce italic tracking-tighter">
              BIG WIN!
            </div>
            <p className="text-white font-black text-6xl mt-8 font-mono drop-shadow-2xl italic tracking-widest text-shadow-glow">NPR {winAmount}</p>
          </div>
        )}
      </div>

      {/* Traditional Control Tray */}
      <div className="w-full grid grid-cols-4 gap-4 p-8 bg-gradient-to-b from-zinc-800 to-black rounded-[3rem] border-t-4 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
        <div className="bg-black/80 p-5 rounded-[2rem] border border-white/5 text-center flex flex-col justify-center shadow-inner">
          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">Stake</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setBet(b => Math.max(100, b-100))} className="text-himalaya-gold text-2xl font-black hover:text-white transition-colors">-</button>
            <span className="text-lg font-black text-white font-mono tabular-nums">{bet}</span>
            <button onClick={() => setBet(b => b+100)} className="text-himalaya-gold text-2xl font-black hover:text-white transition-colors">+</button>
          </div>
        </div>

        <button onClick={() => { setBet(100); spin(); }} className="bg-zinc-700 hover:bg-zinc-600 text-white font-black text-[10px] uppercase tracking-widest rounded-3xl shadow-xl transition-all active:translate-y-2">
          Min
        </button>

        <button onClick={() => { setBet(1000); spin(); }} className="bg-amber-900 hover:bg-amber-800 text-white font-black text-[10px] uppercase tracking-widest rounded-3xl shadow-xl transition-all active:translate-y-2">
          Max
        </button>

        <button 
          onClick={spin} disabled={isSpinning}
          className={`rounded-[2.5rem] font-black text-lg uppercase tracking-widest transition-all shadow-2xl ${isSpinning ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-himalaya-gold text-zinc-950 hover:scale-110 active:scale-90 shadow-himalaya-gold/60'}`}
        >
          {isSpinning ? '...' : 'SPIN'}
        </button>
      </div>

      <div className="w-full px-8 flex justify-between items-center text-[9px] font-black text-white/10 uppercase tracking-[0.5em] select-none">
         <div className="flex items-center gap-2">公平 PROVABLY FAIR</div>
         <div className="flex items-center gap-2">BANKROLL: {lastWin} <Trophy size={12} className="text-himalaya-gold/40" /></div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, profile, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
    cleanPhone = cleanPhone.replace('+', '');
    
    if (cleanPhone.length === 10 && (cleanPhone.startsWith('98') || cleanPhone.startsWith('97'))) {
      cleanPhone = '977' + cleanPhone;
    }

    const loginEmail = `${cleanPhone}@himalaya.com`;
    const loginPassword = password;

    try {
      if (isRegister) {
        try {
          const userCred = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
          await updateProfile(userCred.user, { displayName: name });
          
          const newProfile = {
            uid: userCred.user.uid,
            displayName: name,
            email: loginEmail,
            phoneNumber: cleanPhone,
            balance: 0,
            role: 'user',
            createdAt: new Date().toISOString()
          };
          await set(ref(rtdb, `users/${userCred.user.uid}`), newProfile);
          navigate('/');
        } catch (err: any) {
          if (err.code === 'auth/email-already-in-use') {
            setError('This phone number is already registered. Please login.');
            return;
          }
          throw err;
        }
      } else {
        try {
          const userCred = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
          // Check role for redirection
          try {
            const userSnap = await get(ref(rtdb, `users/${userCred.user.uid}`));
            if (userSnap.exists() && userSnap.val().role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          } catch (rtdbErr: any) {
            console.error("RTDB Profile Fetch Error:", rtdbErr);
            // If permission denied, we still navigate home as they are authenticated
            navigate('/');
          }
        } catch (err: any) {
          if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
            setError('Invalid phone number or password.');
            return;
          }
          throw err;
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-10 bg-white rounded-[40px] border border-gray-100 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="inline-block bg-himalaya-red p-3 rounded-2xl shadow-xl shadow-red-900/20">
            <span className="text-white font-black italic text-3xl tracking-tighter">HIMALAYA</span>
            <span className="text-himalaya-gold font-black text-4xl italic ml-1">777</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              {isRegister ? 'Join the ultimate slot experience' : 'Login to your account to continue'}
            </p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-himalaya-red text-[10px] rounded-2xl text-center font-black uppercase tracking-widest animate-bounce">
              {error}
            </div>
          )}
          
          {isRegister && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 outline-none focus:border-himalaya-red focus:bg-white transition-all font-bold shadow-inner" 
                placeholder="Enter your full name" 
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
            <input 
              type="tel" 
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 outline-none focus:border-himalaya-red focus:bg-white transition-all font-bold shadow-inner" 
              placeholder="98XXXXXXXX" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 outline-none focus:border-himalaya-red focus:bg-white transition-all font-bold shadow-inner" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-5 bg-himalaya-red text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-900/30 disabled:opacity-50 uppercase tracking-widest text-sm mt-4"
          >
            {loading ? 'Processing...' : (isRegister ? 'Register Now' : 'Login Account')}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-[10px] text-gray-400 font-black hover:text-himalaya-red transition-colors uppercase tracking-widest"
          >
            {isRegister ? 'Already have an account? Login' : 'New here? Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
};

const WalletPage = () => {
  const { profile } = useAuth();
  const [amount, setAmount] = React.useState('');
  const [type, setType] = React.useState<'deposit' | 'withdrawal'>('deposit');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [qrCode, setQrCode] = React.useState<string | null>(null);
  const [bankInfo, setBankInfo] = React.useState({ name: '', accountName: '', accountNumber: '' });
  const [receipt, setReceipt] = React.useState<string | null>(null);

  React.useEffect(() => {
    const settingsRef = ref(rtdb, 'settings');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const s = snapshot.val();
        setQrCode(s.depositQR || null);
        setBankInfo({
          name: s.bankName || '',
          accountName: s.accountName || '',
          accountNumber: s.accountNumber || ''
        });
      }
    }, (err) => {
      if (err.message?.toLowerCase().includes('permission_denied') || err.message?.toLowerCase().includes('permission denied')) return;
      console.error("Wallet Settings Listener Error:", err);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    const numAmount = Number(amount);
    if (numAmount < 100) {
      alert('न्यूनतम डिपोजिट NPR 100 हुनुपर्छ।');
      return;
    }

    if (type === 'withdrawal') {
      if (numAmount < 1000) {
        alert('न्यूनतम विड्रवल NPR 1000 हुनुपर्छ।');
        return;
      }
      
      const turnover = profile.turnover || 0;
      const target = profile.turnoverTarget || 0;
      if (turnover < target) {
        alert(`तपाईंको टर्नओभर पुगेको छैन। विड्रवलको लागि NPR ${target.toLocaleString()} टर्नओभर आवश्यक छ। हालको टर्नओभर: NPR ${turnover.toLocaleString()}`);
        return;
      }

      if (profile.balance < numAmount) {
        alert('तपाईंसँग पर्याप्त ब्यालेन्स छैन।');
        return;
      }
    }

    if (type === 'deposit' && !receipt) {
      alert('कृपया भुक्तानीको रसिद (Slip) अपलोड गर्नुहोस्।');
      return;
    }

    setLoading(true);
    try {
      const transRef = push(ref(rtdb, 'transactions'));
      const transData = {
        userId: profile.uid,
        userName: profile.displayName,
        type,
        amount: numAmount,
        status: 'pending',
        receiptUrl: receipt || '',
        createdAt: new Date().toISOString(),
        bankName: profile.bankName,
        bankAccountNumber: profile.bankAccountNumber,
        bankAccountName: profile.bankAccountName
      };
      await set(transRef, transData);

      // Auto Admin Message in Chat
      const chatMsgRef = push(ref(rtdb, `chats/${profile.uid}/messages`));
      await set(chatMsgRef, {
        text: `नमस्ते ${profile.displayName}, तपाईंको NPR ${numAmount} को ${type === 'deposit' ? 'डिपोजिट' : 'विड्रवल'} अनुरोध प्राप्त भएको छ। कृपया एडमिनको स्वीकृतिको लागि केही समय पर्खनुहोस्।`,
        sender: 'admin',
        senderName: 'Admin Support',
        createdAt: new Date().toISOString()
      });

      // If withdrawal, set balance and turnover to 0 as requested
      if (type === 'withdrawal') {
        await update(ref(rtdb, `users/${profile.uid}`), {
          balance: 0,
          turnover: 0,
          turnoverTarget: 0
        });
      }

      setSuccess(true);
      setAmount('');
      setReceipt(null);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (type === 'withdrawal' && profile) {
      const turnover = profile.turnover || 0;
      const target = profile.turnoverTarget || 0;
      if (turnover >= target && profile.balance >= 1000) {
        setAmount(profile.balance.toString());
      }
    }
  }, [type, profile]);

  return (
    <div className="max-w-md mx-auto space-y-6 pb-24">
      {/* Balance Card */}
      <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Available Balance</h3>
          <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">Active</div>
        </div>
        <div className="text-4xl font-black text-gray-900 tracking-tighter">NPR {Math.max(0, profile?.balance || 0).toLocaleString()}</div>
        
        <div className="space-y-4 pt-4 border-t border-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Turnover Progress</span>
            <span className="text-[10px] font-black text-himalaya-red uppercase tracking-widest">
              {profile?.turnover >= (profile?.turnoverTarget || 0) ? 'Completed' : `${profile?.turnover?.toLocaleString() || 0} / ${profile?.turnoverTarget?.toLocaleString() || 0}`}
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-inner">
            <div 
              className="h-full bg-himalaya-red transition-all duration-1000 shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
              style={{ width: `${Math.min(100, ((profile?.turnover || 0) / (profile?.turnoverTarget || 1)) * 100)}%` }} 
            />
          </div>
          <p className="text-[9px] text-gray-400 font-bold italic leading-relaxed">
            * विड्रवल गर्नको लागि टर्नओभर NPR {profile?.turnoverTarget?.toLocaleString() || 0} र १००० भन्दा माथि ब्यालेन्स हुनुपर्नेछ।
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 border border-gray-100 bg-white shadow-xl rounded-[32px]">
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setType('deposit')}
            className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${type === 'deposit' ? 'bg-himalaya-red text-white shadow-lg shadow-red-900/40' : 'bg-gray-100 text-gray-400'}`}
          >
            DEPOSIT
          </button>
          <button 
            onClick={() => setType('withdrawal')}
            className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${type === 'withdrawal' ? 'bg-himalaya-accent text-white shadow-lg shadow-orange-900/40' : 'bg-gray-100 text-gray-400'}`}
          >
            WITHDRAW
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="p-4 bg-green-100 border border-green-600 text-green-700 text-xs rounded-xl font-bold text-center">
              Request submitted successfully! Please wait for admin approval.
            </div>
          )}

          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Amount (NPR)</label>
              <button 
                type="button"
                onClick={() => setAmount('')}
                className="text-[8px] font-black text-himalaya-red uppercase tracking-widest hover:underline"
              >
                Clear
              </button>
            </div>
            <input 
              type="number" 
              required
              min={type === 'deposit' ? "100" : "1000"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              readOnly={type === 'withdrawal' && (profile?.turnover || 0) >= (profile?.turnoverTarget || 0)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-2xl font-black text-gray-900 outline-none focus:border-himalaya-gold transition-all" 
              placeholder="0.00" 
            />
            {type === 'withdrawal' && (profile?.turnover || 0) >= (profile?.turnoverTarget || 0) && (
              <p className="text-[8px] text-himalaya-red font-bold mt-1 uppercase">Note: Auto-withdrawing full balance as turnover is complete.</p>
            )}
          </div>

          {type === 'deposit' ? (
            <>
              {amount && Number(amount) >= 100 && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-himalaya-red uppercase">Scan QR to Pay</p>
                    {qrCode && (
                      <div className="bg-white p-2 rounded-xl inline-block shadow-xl border border-gray-100">
                        <img src={qrCode} alt="Deposit QR" className="w-48 h-48 object-contain" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    
                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-left space-y-3">
                      <p className="text-[10px] font-black text-himalaya-red uppercase border-b border-gray-100 pb-1">Bank Transfer Details</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[8px] text-gray-500 uppercase">Bank Name</p>
                          <p className="text-xs font-bold text-gray-900">{bankInfo.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-gray-500 uppercase">Account Name</p>
                          <p className="text-xs font-bold text-gray-900">{bankInfo.accountName || 'N/A'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[8px] text-gray-500 uppercase">Account Number</p>
                          <p className="text-sm font-black text-himalaya-red tracking-widest">{bankInfo.accountNumber || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Upload Payment Receipt</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden" 
                        id="receipt-upload"
                      />
                      <label 
                        htmlFor="receipt-upload"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-himalaya-red transition-all text-gray-400 font-bold text-xs"
                      >
                        {receipt ? <CheckCircle2 className="text-green-500" /> : <Upload size={18} />}
                        {receipt ? 'Receipt Selected' : 'Click to Upload Slip'}
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-gray-500">
                <span>Your Balance</span>
                <span className="text-gray-900 font-black">NPR {profile?.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-gray-500">
                <span>Turnover Progress</span>
                <span className={ (profile?.turnover || 0) >= 1000 ? 'text-green-600' : 'text-himalaya-red'}>
                  {profile?.turnover?.toLocaleString()} / 1,000
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase">Withdraw to Bank</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] text-gray-500 uppercase">Bank Name</p>
                    <p className="text-xs font-bold text-gray-900">{profile?.bankName}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-500 uppercase">Account Number</p>
                    <p className="text-xs font-bold text-gray-900">{profile?.bankAccountNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-black text-white transition-all shadow-xl uppercase tracking-widest ${type === 'deposit' ? 'bg-himalaya-red hover:bg-red-700 shadow-red-900/20' : 'bg-himalaya-accent hover:bg-orange-600 shadow-orange-900/20'} disabled:opacity-50`}
          >
            {loading ? 'Processing...' : `Submit ${type}`}
          </button>
        </form>
      </div>

      <div className="bg-gray-50 p-4 border border-gray-200 rounded-2xl">
        <h4 className="text-xs font-bold text-himalaya-red mb-2 uppercase tracking-widest">Important Note:</h4>
        <ul className="text-[10px] text-gray-500 space-y-1 list-disc pl-4 font-medium">
          <li>Minimum deposit is NPR 100.</li>
          <li>Minimum withdrawal is NPR 1000.</li>
          <li>Withdrawals are processed within 30 minutes.</li>
          <li>Turnover must be completed before withdrawal.</li>
        </ul>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [chats, setChats] = React.useState<any[]>([]);
  const [activeSessions, setActiveSessions] = React.useState<any[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<string | null>(null);
  const [adminMsg, setAdminMsg] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  
  const activeTab = (searchParams.get('tab') as any) || 'dashboard';
  const setActiveTab = (tab: string) => setSearchParams({ tab });

  const [transFilter, setTransFilter] = React.useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [userSearch, setUserSearch] = React.useState('');
  const [gameUrl, setGameUrl] = React.useState({ slot: '', live: '', casino: '', sport: '', fish: '', fast: '' });

  React.useEffect(() => {
    const glRef = ref(rtdb, 'settings/gameLinks');
    const unsub = onValue(glRef, (snap) => {
      if (snap.exists()) setGameUrl(p => ({ ...p, ...snap.val() }));
    });
    return () => unsub();
  }, []);

  const saveGameUrl = async () => {
    try {
      await update(ref(rtdb, 'settings/gameLinks'), gameUrl);
      alert('Game links saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save game links');
    }
  };
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string | null>(null);
  const [bankName, setBankName] = React.useState('');
  const [accountName, setAccountName] = React.useState('');
  const [accountNumber, setAccountNumber] = React.useState('');
  const [savingSettings, setSavingSettings] = React.useState(false);

  const fetchData = async () => {
    // Data is now handled by onValue listeners for real-time performance
    setLoading(false);
  };

  React.useEffect(() => {
    if (profile?.role !== 'admin') return;

    const transRef = ref(rtdb, 'transactions');
    const usersRef = ref(rtdb, 'users');
    const chatsRef = ref(rtdb, 'chats');
    const settingsRef = ref(rtdb, 'settings');

    const unsubTrans = onValue(query(transRef, orderByChild('createdAt'), limitToLast(100)), (snap) => {
      if (snap.exists()) {
        const list: Transaction[] = [];
        snap.forEach(child => {
          list.push({ id: child.key as string, ...child.val() });
        });
        setTransactions(list.reverse());
      }
      setLoading(false);
    });

    const unsubUsers = onValue(usersRef, (snap) => {
      if (snap.exists()) setUsers(Object.values(snap.val()));
    });

    const unsubChats = onValue(chatsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setChats(Object.keys(data).map(uid => ({ uid, ...data[uid] })));
      }
    });

    const unsubSettings = onValue(settingsRef, (snap) => {
      if (snap.exists()) {
        const s = snap.val();
        setQrCodeUrl(s.depositQR || null);
        setBankName(s.bankName || '');
        setAccountName(s.accountName || '');
        setAccountNumber(s.accountNumber || '');
      }
    });

    const sessionsRef = ref(rtdb, 'live_sessions');
    const unsubSessions = onValue(query(sessionsRef, limitToLast(20)), (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setActiveSessions(Object.values(data).reverse());
      }
      else setActiveSessions([]);
    });

    return () => {
      unsubTrans();
      unsubUsers();
      unsubChats();
      unsubSettings();
      unsubSessions();
    };
  }, [profile]);

  const [processingTrans, setProcessingTrans] = React.useState<Record<string, boolean>>({});

  const handleStatusUpdate = async (id: string, userId: string, type: string, amount: number, status: TransactionStatus) => {
    if (processingTrans[id]) return;
    
    try {
      setProcessingTrans(prev => ({ ...prev, [id]: true }));
      
      const currentRef = ref(rtdb, `transactions/${id}`);
      const snap = await get(currentRef);
      if (!snap.exists() || snap.val().status !== 'pending') {
        setProcessingTrans(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        return;
      }

      await update(currentRef, { status, updatedAt: new Date().toISOString() });
      
      if (status === 'approved') {
        const userRef = ref(rtdb, `users/${userId}`);
        const userSnap = await get(userRef);
        if (!userSnap.exists()) throw new Error("User not found");
        
        const updates: any = { 
          balance: increment(type === 'deposit' ? amount : -amount) 
        };
        
        if (type === 'deposit') {
          updates.totalDeposited = increment(amount);
          updates.turnover = 0;
          updates.turnoverTarget = amount; 
        }
        
        await update(userRef, updates);

        // Record manual adjustment log for approved withdrawal/deposit
        const logRef = push(ref(rtdb, 'logs/transactions'));
        await set(logRef, {
          id,
          userId,
          type,
          amount,
          status,
          processedAt: new Date().toISOString()
        });

        // Send a message to user's chat from admin
        const chatRef = ref(rtdb, `chats/${userId}/messages`);
        await push(chatRef, {
          text: `बधाई छ! तपाईंको NPR ${amount.toLocaleString()} ${type === 'deposit' ? 'डिपोजिट' : 'विड्रवल'} सफल भयो। ${type === 'deposit' ? 'तपाईंको खातामा रकम थपिएको छ।' : 'रकम तपाईंको बैंक खातामा पठाइएको छ।'}`,
          sender: 'admin',
          senderName: 'Admin Support',
          createdAt: new Date().toISOString(),
          isAdmin: true
        });
      } else if (status === 'rejected') {
        // Send a message to user's chat from admin for rejection
        const chatRef = ref(rtdb, `chats/${userId}/messages`);
        await push(chatRef, {
          text: `माफ गर्नुहोस्! तपाईंको NPR ${amount.toLocaleString()} ${type === 'deposit' ? 'डिपोजिट' : 'विड्रवल'} अस्वीकृत भयो। कृपया विवरणहरू पुन: जाँच गर्नुहोस् वा सपोर्टमा सम्पर्क गर्नुहोस्।`,
          sender: 'admin',
          senderName: 'Admin Support',
          createdAt: new Date().toISOString(),
          isAdmin: true
        });
      }

      // Send Notification (SMS Simulation)
      const notifRef = push(ref(rtdb, `notifications/${userId}`));
      let message = '';
      if (status === 'approved') {
        message = type === 'deposit' 
          ? `बधाई छ! तपाईंको NPR ${amount.toLocaleString()} डिपोजिट सफल भयो। तपाईंको खातामा रकम थपिएको छ।`
          : `तपाईंको NPR ${amount.toLocaleString()} विड्रवल सफल भयो। कृपया आफ्नो खाता चेक गर्नुहोस्।`;
      } else {
        message = `माफ गर्नुहोस्! तपाईंको NPR ${amount.toLocaleString()} ${type === 'deposit' ? 'डिपोजिट' : 'विड्रवल'} अस्वीकृत भयो। विवरण मिलेन।`;
      }
      
      await set(notifRef, {
        message,
        type: status,
        amount,
        createdAt: new Date().toISOString(),
        read: false
      });

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await update(ref(rtdb, `users/${userId}`), { role: newRole });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const sendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat || !adminMsg.trim()) return;

    try {
      const chatRef = ref(rtdb, `chats/${selectedChat}/messages`);
      await push(chatRef, {
        text: adminMsg,
        sender: 'admin',
        senderName: 'Admin Support',
        timestamp: new Date().toISOString(),
        isAdmin: true
      });
      setAdminMsg('');
    } catch (err) {
      console.error(err);
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      await update(ref(rtdb, 'settings'), {
        depositQR: qrCodeUrl,
        bankName,
        accountName,
        accountNumber,
        updatedAt: new Date().toISOString()
      });
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const renderGameControl = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <Home size={12} />
        <span>/</span>
        <span>Game Control</span>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-8 space-y-8">
        <div className="border-b border-gray-100 pb-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Game Source Management</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Configure external game providers and links</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['slot', 'live', 'casino', 'sport', 'fish', 'fast'] as const).map((cat) => (
            <div key={cat} className="space-y-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-fuchsia-600">
                  {cat === 'slot' ? <Gamepad2 size={24} /> : cat === 'live' ? <Video size={24} /> : cat === 'casino' ? <Dices size={24} /> : cat === 'sport' ? <Zap size={24} /> : cat === 'fish' ? <Flame size={24} /> : <Crown size={24} />}
                </div>
                <h3 className="font-black text-gray-900 uppercase tracking-tight">{cat.toUpperCase()} Games Link</h3>
              </div>
              <input 
                type="text"
                value={(gameUrl as any)[cat]}
                onChange={(e) => setGameUrl(prev => ({ ...prev, [cat]: e.target.value }))}
                placeholder={`Enter ${cat} game source URL...`}
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-fuchsia-500 transition-all font-mono"
              />
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest italic">Users will be directed to this URL for {cat} category.</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button 
            onClick={saveGameUrl}
            className="flex items-center gap-2 px-10 py-4 bg-fuchsia-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-fuchsia-900/20 hover:bg-fuchsia-700 hover:scale-105 active:scale-95 transition-all"
          >
            <ShieldCheck size={20} /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <Home size={12} />
        <span>/</span>
        <span>Dashboard</span>
      </div>
      
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">System Health</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Real-time infrastructure monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Server: Online</span>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 text-white rounded-2xl text-xs font-black hover:bg-fuchsia-700 transition-all shadow-xl shadow-fuchsia-900/20 uppercase tracking-widest">
            <RefreshCw size={16} /> Update Metrics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Deposits', value: transactions.filter(t => t.type === 'deposit' && t.status === 'approved').reduce((acc, t) => acc + t.amount, 0), color: 'text-green-600', icon: ArrowDownCircle, bg: 'bg-green-50' },
          { label: 'Total Withdrawals', value: transactions.filter(t => t.type === 'withdrawal' && t.status === 'approved').reduce((acc, t) => acc + t.amount, 0), color: 'text-red-600', icon: ArrowUpCircle, bg: 'bg-red-50' },
          { label: 'Active Sessions', value: activeSessions.length, color: 'text-fuchsia-600', icon: Zap, bg: 'bg-fuchsia-50' },
          { label: 'Total Players', value: users.length, color: 'text-blue-600', icon: Users, bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl flex items-center justify-between group hover:border-fuchsia-500 transition-all">
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">{stat.label}</div>
              <div className={`text-2xl font-black ${stat.color} tracking-tighter`}>
                {typeof stat.value === 'number' && stat.label.includes('Total') && !stat.label.includes('Players') ? `NPR ${stat.value.toLocaleString()}` : stat.value}
              </div>
            </div>
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Game Monitoring */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-[#111] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden min-h-[400px]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black">
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-xs">Live Monitoring</h3>
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Active Game Sessions</p>
              </div>
              <div className="px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full">
                <span className="text-[8px] font-black text-fuchsia-500 uppercase tracking-widest animate-pulse">● Live</span>
              </div>
            </div>
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {activeSessions.length > 0 ? activeSessions.map((session, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                      <Zap size={14} className="text-fuchsia-500 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img src={session.gameImage || 'https://picsum.photos/seed/game/100/100'} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-white uppercase tracking-tight truncate">{session.userName || 'Unknown'}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-[7px] font-black text-fuchsia-400 bg-fuchsia-400/10 px-1 rounded uppercase">{session.category || 'GAME'}</span>
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest truncate">{session.gameName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-white/40 uppercase mb-0.5 tracking-widest">Bet</p>
                       <p className="text-xs font-black text-fuchsia-400">NPR {session.bet}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20">
                  <Monitor size={32} className="mx-auto text-gray-800 mb-4 opacity-50" />
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">Waiting for sessions...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Recent Activity Log</h3>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Global transaction flow</p>
            </div>
            <button onClick={() => setActiveTab('transactions')} className="text-fuchsia-600 text-[10px] font-black hover:underline uppercase tracking-widest border border-fuchsia-100 px-4 py-2 rounded-xl">View Archive</button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {transactions.slice(0, 8).map(t => (
                <div key={t.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all border-l-4" style={{ borderLeftColor: t.type === 'deposit' ? '#22c55e' : '#ef4444' }}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${t.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {t.type === 'deposit' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{t.type === 'deposit' ? 'Deposit' : 'Withdrawal'}</p>
                      <p className="text-[10px] text-gray-500 font-bold">Client: {t.userName || t.userId.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900 tracking-tighter">NPR {t.amount.toLocaleString()}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mt-1 ${t.status === 'approved' ? 'bg-green-100 text-green-600' : t.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{t.status}</p>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-xs font-bold uppercase tracking-widest italic">No log data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <Home size={12} />
        <span>/</span>
        <span>Transactions</span>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Transaction Management</h1>
        <div className="flex gap-2 bg-white p-1 rounded-2xl border border-gray-200 shadow-sm">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button 
              key={f}
              onClick={() => setTransFilter(f as any)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${transFilter === f ? 'bg-himalaya-red text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">User</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions
                .filter(t => transFilter === 'all' || t.status === transFilter)
                .map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 font-mono text-[10px] text-gray-400">{t.id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{users.find(u => u.uid === t.userId)?.displayName || 'Unknown'}</p>
                        <p className="text-[10px] text-fuchsia-600 font-bold">{users.find(u => u.uid === t.userId)?.phoneNumber || 'No Phone'}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{t.userId.slice(0, 8)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded w-fit tracking-widest ${
                          t.type === 'deposit' ? 'bg-green-100 text-green-600' : 
                          t.type === 'bonus' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-himalaya-red'
                        }`}>
                          {t.type}
                        </span>
                        {t.receiptUrl && (
                          <div className="relative group/img">
                            <img 
                              src={t.receiptUrl} 
                              alt="Receipt" 
                              className="w-12 h-12 object-cover rounded-xl border border-gray-200 cursor-pointer hover:scale-150 transition-transform z-10 shadow-lg"
                              onClick={() => window.open(t.receiptUrl, '_blank')}
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute -top-8 left-0 bg-black text-white text-[8px] px-2 py-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity font-black uppercase whitespace-nowrap">Click to Expand</div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-black text-gray-900 text-lg tracking-tighter">NPR {t.amount.toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        t.status === 'approved' ? 'bg-green-100 text-green-600' : 
                        t.status === 'rejected' ? 'bg-red-100 text-himalaya-red' : 
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[10px] text-gray-400 font-bold uppercase">{new Date(t.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-5">
                      {t.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleStatusUpdate(t.id, t.userId, t.type, t.amount, 'approved')} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-green-900/20">
                            <ShieldCheck size={18} />
                          </button>
                          <button onClick={() => handleStatusUpdate(t.id, t.userId, t.type, t.amount, 'rejected')} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white p-3 rounded-xl transition-all shadow-lg shadow-fuchsia-900/20">
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const adjustBalance = async (userId: string, amount: number) => {
    try {
      // Use increment accurately
      await update(ref(rtdb, `users/${userId}`), {
        balance: increment(amount)
      });
      
      // Record manual adjustment with unique ID to avoid duplicates if possible
      const transRef = push(ref(rtdb, 'transactions'));
      await set(transRef, {
        userId,
        userName: users.find(u => u.uid === userId)?.displayName || 'User',
        type: amount > 0 ? 'deposit' : 'withdrawal',
        amount: Math.abs(amount),
        status: 'approved',
        description: `Manual Admin Adjustment: ${amount > 0 ? 'Added' : 'Removed'} balance`,
        createdAt: new Date().toISOString(),
        isManual: true
      });
    } catch (err) {
      console.error("Adjust Balance Error:", err);
      alert('Failed to adjust balance. Check permissions.');
    }
  };

  const renderPlayers = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <Home size={12} />
        <span>/</span>
        <span>Players</span>
        <span>/</span>
        <span>All Players</span>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Player Management</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 text-white rounded-2xl text-xs font-black hover:bg-fuchsia-700 transition-all shadow-xl shadow-fuchsia-900/20 uppercase tracking-widest">
          <Plus size={16} /> Add New Player
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search players by name or phone..." 
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-himalaya-red transition-all font-bold"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-fuchsia-600 transition-all">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-5">Name & Contact</th>
                <th className="px-6 py-5">Bank Details</th>
                <th className="px-6 py-5">Balance</th>
                <th className="px-6 py-5">Turnover</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5">Joined</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users
                .filter(u => 
                  u.displayName.toLowerCase().includes(userSearch.toLowerCase()) || 
                  u.phoneNumber?.includes(userSearch) ||
                  u.uid.includes(userSearch)
                )
                .map((u) => (
                <tr key={u.uid} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{u.displayName}</span>
                      <span className="text-[10px] text-fuchsia-600 font-bold">{u.phoneNumber}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{u.uid.slice(0, 12)}...</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-900 uppercase">{u.bankName || 'N/A'}</span>
                      <span className="text-[10px] text-gray-500">{u.bankAccountNumber || 'N/A'}</span>
                      <span className="text-[10px] text-gray-500 italic">{u.bankAccountName || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-green-600 tracking-tighter">NPR {Math.max(0, u.balance).toLocaleString()}</span>
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => {
                            const amt = prompt(`Add balance for ${u.displayName}:`);
                            if (amt && !isNaN(Number(amt))) adjustBalance(u.uid, Math.abs(Number(amt)));
                          }} 
                          className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase hover:bg-green-100 transition-colors border border-green-200"
                        >
                          <Plus size={10} /> Add
                        </button>
                        <button 
                          onClick={() => {
                            const amt = prompt(`Remove balance from ${u.displayName}:`);
                            if (amt && !isNaN(Number(amt))) adjustBalance(u.uid, -Math.abs(Number(amt)));
                          }} 
                          className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase hover:bg-red-100 transition-colors border border-red-200"
                        >
                          <Minus size={10} /> Remove
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-700">NPR {u.turnover?.toLocaleString() || 0}</span>
                      <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Target: NPR {u.totalDeposited?.toLocaleString() || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[10px] text-gray-400 font-bold uppercase">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleUserRole(u.uid, u.role)}
                        className={`p-3 rounded-xl transition-all ${u.role === 'admin' ? 'text-fuchsia-600 bg-fuchsia-50' : 'text-blue-600 bg-blue-50'}`}
                        title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      >
                        <ShieldCheck size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {users.length} players</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50" disabled>Prev</button>
            <button className="px-4 py-2 bg-fuchsia-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-fuchsia-900/20">1</button>
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-white transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChats = () => (
    <div className="space-y-8 h-[calc(100vh-180px)] animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <Home size={12} />
        <span>/</span>
        <span>Support Chats</span>
      </div>

      <div className="flex h-full gap-8 bg-gray-50 p-6 rounded-[40px]">
        {/* Chat List */}
        <div className="w-96 bg-white rounded-3xl border border-gray-100 shadow-xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm text-center">Support Requests</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {chats.map(chat => (
              <button 
                key={chat.uid}
                onClick={() => setSelectedChat(chat.uid)}
                className={`w-full p-5 rounded-[24px] text-left transition-all border-2 ${selectedChat === chat.uid ? 'bg-fuchsia-600 text-white border-fuchsia-400 shadow-xl shadow-fuchsia-900/20' : 'bg-white text-gray-600 border-gray-50 hover:border-fuchsia-100 group'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedChat === chat.uid ? 'bg-white text-fuchsia-600' : 'bg-fuchsia-50 text-fuchsia-600 group-hover:bg-fuchsia-600 group-hover:text-white transition-colors'}`}>
                    {users.find(u => u.uid === chat.uid)?.displayName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black uppercase tracking-tight truncate">{users.find(u => u.uid === chat.uid)?.displayName || 'Unknown User'}</p>
                    <p className={`text-[9px] font-bold ${selectedChat === chat.uid ? 'text-white/70' : 'text-gray-400'}`}>{chat.uid.slice(0, 12)}</p>
                  </div>
                </div>
              </button>
            ))}
            {chats.length === 0 && (
              <div className="text-center py-20">
                <MessageCircle size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No active requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-xl flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-fuchsia-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                    {users.find(u => u.uid === selectedChat)?.displayName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg">{users.find(u => u.uid === selectedChat)?.displayName}</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Direct Terminal Access</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-fuchsia-600 transition-all border border-gray-100">
                     <Users size={18} />
                   </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 custom-scrollbar">
                {Object.values(chats.find(c => c.uid === selectedChat)?.messages || {}).map((msg: any, i: number) => (
                  <div key={i} className={`flex flex-col ${msg.isAdmin ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[75%] p-5 rounded-[28px] text-sm font-bold shadow-sm ${msg.isAdmin ? 'bg-fuchsia-600 text-white rounded-tr-none shadow-fuchsia-900/10' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                      {msg.text}
                      <p className={`text-[8px] mt-3 font-black uppercase tracking-widest opacity-50 ${msg.isAdmin ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendAdminMessage} className="p-6 border-t border-gray-100 bg-white flex gap-4">
                <input 
                  type="text"
                  value={adminMsg}
                  onChange={(e) => setAdminMsg(e.target.value)}
                  placeholder="Type message to player..."
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-gray-900 outline-none focus:border-fuchsia-600 focus:bg-white transition-all font-bold shadow-inner"
                />
                <button type="submit" className="w-16 h-16 bg-fuchsia-600 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-fuchsia-900/20">
                  <Send size={24} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-6">
              <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center">
                <MessageCircle size={64} className="opacity-10" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black uppercase tracking-widest opacity-40">Command Center</p>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mt-2">Select a session to interface</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <Home size={12} />
        <span>/</span>
        <span>Settings</span>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-8 space-y-8">
        <div className="flex justify-between items-center border-b border-gray-100 pb-6">
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Core Configuration</h3>
          <button 
            onClick={saveSettings}
            disabled={savingSettings}
            className="px-8 py-4 bg-fuchsia-600 text-white rounded-2xl font-black hover:bg-fuchsia-700 transition-all shadow-xl shadow-fuchsia-900/20 disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest text-xs"
          >
            {savingSettings ? <RefreshCw className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
            {savingSettings ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deposit QR Code</label>
              <div className="flex flex-col gap-4">
                {qrCodeUrl && (
                  <div className="w-48 h-48 bg-gray-50 rounded-2xl border border-gray-100 p-2 shadow-inner">
                    <img src={qrCodeUrl} alt="QR" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setQrCodeUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-red-50 file:text-himalaya-red hover:file:bg-red-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h4 className="text-[10px] font-black text-himalaya-red uppercase tracking-widest border-b border-gray-200 pb-2">Admin Bank Details</h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase">Bank Name</label>
                  <input 
                    type="text" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-fuchsia-600 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase">Account Name</label>
                  <input 
                    type="text" 
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-fuchsia-600 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-gray-400 uppercase">Account Number</label>
                  <input 
                    type="text" 
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-fuchsia-600 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Security & Access</h4>
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Maintenance Mode</p>
                    <p className="text-[10px] text-gray-500 font-bold">Disable all user access for maintenance</p>
                  </div>
                  <button className="w-12 h-6 bg-gray-200 rounded-full relative transition-all">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Auto-Approval</p>
                    <p className="text-[10px] text-gray-500 font-bold">Automatically approve small deposits</p>
                  </div>
                  <button className="w-12 h-6 bg-himalaya-red rounded-full relative transition-all">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGames = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
        <Home size={12} />
        <span>/</span>
        <span>Game Control</span>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Slot Game Control</h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manage Payouts & RTP</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SLOT_GAMES.map(game => (
          <div key={game.id} className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col group hover:border-himalaya-red transition-all">
            <div className="p-4 border-b border-gray-50 flex items-center gap-4 bg-gray-50/50">
              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md">
                <img src={game.image} alt={game.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-black text-gray-900 uppercase leading-tight">{game.name}</h4>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">ID: {game.id}</p>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-1">
              <GameSettingInput gameId={game.id} field="jpMultiplier" label="Jackpot Multiplier" icon="💎" defaultValue={25} />
              <GameSettingInput gameId={game.id} field="megaMultiplier" label="Mega Win Multiplier" icon="✨" defaultValue={10} />
              <GameSettingInput gameId={game.id} field="winMultiplier" label="Standard Win Multiplier" icon="🎉" defaultValue={2} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-full">
      <nav className="flex items-center gap-1 overflow-x-auto pb-8 custom-scrollbar mb-8">
        {[
          { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard },
          { id: 'transactions', label: 'Financials', icon: ArrowLeftRight },
          { id: 'users', label: 'Registry', icon: Users },
          { id: 'chats', label: 'Terminal', icon: MessageSquare },
          { id: 'game-control', label: 'Source Control', icon: Gamepad2 },
          { id: 'games', label: 'Playbook', icon: Dices },
          { id: 'settings', label: 'Core Config', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-[#111] text-fuchsia-500 border border-fuchsia-500/30 shadow-[0_0_30px_rgba(217,70,239,0.2)] scale-105 z-10' 
                : 'text-gray-400 hover:text-fuchsia-500 hover:bg-gray-100/50'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'game-control' && renderGameControl()}
        {activeTab === 'players' && renderPlayers()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'chats' && <div className="h-[calc(100vh-280px)]">{renderChats()}</div>}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'games' && renderGames()}
      </div>
    </div>
  );
};

const GameSettingInput = ({ gameId, field, label, icon, defaultValue }: { gameId: number, field: string, label: string, icon: string, defaultValue: number }) => {
  const [val, setVal] = React.useState<number>(defaultValue);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const settingRef = ref(rtdb, `gameSettings/${gameId}/${field}`);
    get(settingRef).then(snap => {
      if (snap.exists()) setVal(snap.val());
    });
  }, [gameId, field]);

  const updateVal = async (newVal: number) => {
    setVal(newVal);
    setSaving(true);
    await update(ref(rtdb, `gameSettings/${gameId}`), { [field]: newVal });
    setSaving(false);
  };

  return (
    <div className="space-y-1.5 group/input">
      <div className="flex justify-between items-center px-1">
        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
        {saving && <RefreshCw size={10} className="animate-spin text-himalaya-red" />}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-40 group-hover/input:opacity-100 transition-opacity">{icon}</span>
        <input 
          type="number" 
          value={val}
          min={1}
          onChange={(e) => updateVal(Number(e.target.value))}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-8 pr-4 py-2.5 text-xs font-black text-gray-900 outline-none focus:bg-white focus:border-himalaya-red transition-all"
        />
      </div>
    </div>
  );
};


const CountdownTimer = ({ createdAt }: { createdAt: string }) => {
  const [timeLeft, setTimeLeft] = React.useState<number>(0);

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const created = new Date(createdAt).getTime();
      const now = new Date().getTime();
      const diff = 4 * 60 * 1000 - (now - created);
      return Math.max(0, Math.floor(diff / 1000));
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt]);

  if (timeLeft <= 0) return <span className="text-orange-500">Processing...</span>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return (
    <span className="text-himalaya-gold font-mono">
      {minutes}:{seconds.toString().padStart(2, '0')}
    </span>
  );
};

const HistoryPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    const transRef = ref(rtdb, 'transactions');
    const transQ = query(transRef, orderByChild('userId'), equalTo(user.uid));
    
    const unsubscribe = onValue(transQ, (snapshot) => {
      if (snapshot.exists()) {
        const list: Transaction[] = [];
        snapshot.forEach((childSnap) => {
          list.push({
            id: childSnap.key as string,
            ...childSnap.val()
          });
        });
        // Sort by createdAt desc
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTransactions(list);
      } else {
        setTransactions([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("RTDB Error:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user]);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Transaction History</h2>
        <div className="text-[10px] font-bold text-himalaya-red bg-red-50 px-2 py-1 rounded border border-red-100">
          {transactions.length} Records
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Type</th>
                <th className="px-4 py-3 font-bold">Amount</th>
                <th className="px-4 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-[10px] text-gray-400">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      t.type === 'deposit' ? 'bg-green-100 text-green-600' : 
                      t.type === 'bonus' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-black text-xs text-gray-900">NPR {t.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-bold ${t.status === 'pending' ? 'text-orange-500' : t.status === 'approved' ? 'text-green-600' : 'text-himalaya-red'}`}>
                        {t.status.toUpperCase()}
                      </span>
                      {t.status === 'pending' && (
                        <div className="flex items-center gap-1 text-[8px] font-bold mt-0.5">
                          <span className="text-gray-400">EST:</span>
                          <CountdownTimer createdAt={t.createdAt} />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-400 text-xs italic">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [bankName, setBankName] = React.useState(profile?.bankName || '');
  const [bankAccountNumber, setBankAccountNumber] = React.useState(profile?.bankAccountNumber || '');
  const [bankAccountName, setBankAccountName] = React.useState(profile?.bankAccountName || '');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(!profile?.bankName);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    try {
      await update(ref(rtdb, `users/${profile.uid}`), {
        bankName,
        bankAccountNumber,
        bankAccountName,
      });
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-3xl border border-gray-200 shadow-xl">
        <div className="w-24 h-24 rounded-full border-4 border-himalaya-gold bg-gray-50 flex items-center justify-center text-himalaya-gold font-black text-4xl shadow-xl shadow-gray-200">
          {profile?.displayName?.charAt(0) || 'U'}
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{profile?.displayName}</h2>
          <p className="text-gray-500 font-bold">{profile?.role === 'admin' ? profile?.email : (profile?.phoneNumber || profile?.email?.split('@')[0])}</p>
          <div className="flex gap-2 mt-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-red-50 text-himalaya-red text-[10px] font-black rounded-full uppercase border border-red-100">
              {profile?.role}
            </span>
            <span className="px-3 py-1 bg-yellow-50 text-himalaya-gold text-[10px] font-black rounded-full uppercase border border-yellow-100">
              Verified Account
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Bank Information</h3>
              {/* Users cannot edit bank details once set. Admin can edit via Admin Panel if needed. */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Bank Name</p>
                <p className="text-gray-900 font-black text-lg">{profile?.bankName}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Account Number</p>
                <p className="text-gray-900 font-black text-lg">{profile?.bankAccountNumber}</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Holder Name</p>
                <p className="text-gray-900 font-black text-lg">{profile?.bankAccountName}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xl">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-4">Account Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg"><ShieldCheck className="text-green-600" size={20} /></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Two-Factor Authentication</p>
                    <p className="text-[10px] text-gray-500">Secure your account with 2FA</p>
                  </div>
                </div>
                <button className="text-himalaya-red font-bold text-xs">ENABLE</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-himalaya-red rounded-3xl p-6 text-white shadow-2xl shadow-red-900/40">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Account Balance</h3>
            <p className="text-4xl font-black tracking-tighter mb-4">NPR {Math.max(0, profile?.balance || 0).toLocaleString()}</p>
            <div className="flex gap-2">
              <button onClick={() => navigate('/wallet')} className="flex-1 bg-white text-himalaya-red py-3 rounded-xl font-black text-xs uppercase">Deposit</button>
              <button onClick={() => navigate('/wallet')} className="flex-1 bg-black/20 text-white py-3 rounded-xl font-black text-xs uppercase">Withdraw</button>
            </div>
          </div>

          <button 
            onClick={() => auth.signOut()}
            className="w-full py-4 bg-gray-50 text-red-600 rounded-2xl font-black hover:bg-red-50 transition-all border border-red-100 uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout Account
          </button>
        </div>
      </div>
    </div>
  );
};

const BonusPage = () => (
  <div className="space-y-8 pb-24 animate-in fade-in duration-500">
    <div className="flex flex-col gap-1">
      <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Bonuses & Promotions</h2>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Exclusive rewards for our loyal players</p>
    </div>
    <div className="grid gap-6">
      {[
        { title: '100% Welcome Bonus', desc: 'Double your first deposit up to NPR 10,000', code: 'WELCOME100', color: 'bg-red-50 text-himalaya-red' },
        { title: 'Daily Bonus', desc: 'Claim NPR 100 daily bonus (20x Turnover required)', code: 'DAILY100', color: 'bg-green-50 text-green-600' },
        { title: 'Turnover Achievement', desc: 'Reach 3,000 turnover to get NPR 200 instant bonus', code: 'TURNOVER3K', color: 'bg-purple-50 text-purple-600' },
        { title: 'Weekly Reload', desc: 'Get 20% extra on your first deposit of the week', code: 'WEEKLY20', color: 'bg-blue-50 text-blue-600' },
        { title: 'Refer a Friend', desc: 'Earn NPR 500 for every successful referral', code: 'REFERRAL', color: 'bg-orange-50 text-orange-600' },
      ].map(promo => (
        <div key={promo.title} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-2xl hover:scale-[1.02] transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${promo.color}`}>
              Limited Time
            </div>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">#PROMO</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">{promo.title}</h3>
          <p className="text-gray-500 text-sm font-bold mb-8 leading-relaxed">{promo.desc}</p>
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Promo Code</span>
              <span className="font-mono text-sm font-black text-himalaya-red">{promo.code}</span>
            </div>
            <button className="px-6 py-3 bg-himalaya-red text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-900/20 hover:bg-red-700 transition-all">Claim Now</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LiveChatPage = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = React.useState<any[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!profile) return;
    const chatRef = ref(rtdb, `chats/${profile.uid}/messages`);
    const chatQuery = query(chatRef, limitToLast(50));
    
    const unsubscribe = onValue(chatQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const msgs = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setMessages(msgs);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, [profile]);

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile) return;

    const chatRef = ref(rtdb, `chats/${profile.uid}/messages`);
    const msgData = {
      text: newMessage,
      sender: profile.uid,
      senderName: profile.displayName,
      timestamp: new Date().toISOString(),
      isAdmin: profile.role === 'admin'
    };

    await push(chatRef, msgData);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white p-6 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
            <MessageCircle className="text-himalaya-red" size={28} />
          </div>
          <div>
            <h3 className="text-gray-900 font-black text-xl uppercase tracking-tighter">Live Support</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Team Online - 24/7 Active</p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
          <ShieldCheck size={14} className="text-green-600" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">End-to-End Encrypted</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <MessageCircle size={80} className="text-gray-300" />
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Start a conversation with our team</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.sender === profile?.uid;
          const name = msg.senderName || 'User';
          return (
            <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              {!isMe && <span className="text-[10px] font-black text-himalaya-red uppercase mb-2 ml-2 tracking-widest">{name}</span>}
              <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-[28px] text-sm font-bold shadow-xl ${
                isMe 
                  ? 'bg-himalaya-red text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}>
                {msg.text}
                <div className={`text-[8px] opacity-50 mt-3 flex items-center gap-1 font-black uppercase ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && <CheckCircle2 size={10} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} className="p-6 bg-white border-t border-gray-100 flex gap-4">
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message to support..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 text-gray-900 outline-none focus:border-himalaya-red focus:bg-white transition-all font-bold text-sm shadow-inner"
        />
        <button type="submit" className="w-16 h-16 bg-himalaya-red text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-red-900/30">
          <Send size={28} />
        </button>
      </form>
    </div>
  );
};

const NotificationSystem = () => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!profile) return;
    const notifRef = ref(rtdb, `notifications/${profile.uid}`);
    const unsubscribe = onValue(notifRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        // Only show unread and recent (last 30 seconds) to simulate "SMS" popup
        const recent = list.filter(n => !n.read && (new Date().getTime() - new Date(n.createdAt).getTime() < 30000));
        setNotifications(recent);
      }
    }, (error) => {
      if (error.message?.toLowerCase().includes('permission_denied') || error.message?.toLowerCase().includes('permission denied')) return;
      console.error("Notifications Listener Error:", error);
    });
    return () => unsubscribe();
  }, [profile]);

  const markAsRead = async (id: string) => {
    if (!profile) return;
    await update(ref(rtdb, `notifications/${profile.uid}/${id}`), { read: true });
  };

  if (notifications.length === 0) return null;
  return null; // Remote floating notifications as requested - users prefer checking in chat/notifications history
};

const BankSetup = () => {
  const { profile } = useAuth();
  const [bankName, setBankName] = React.useState('');
  const [bankAccountNumber, setBankAccountNumber] = React.useState('');
  const [bankAccountName, setBankAccountName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    try {
      await update(ref(rtdb, `users/${profile.uid}`), {
        bankName,
        bankAccountNumber,
        bankAccountName,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-[100] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 border border-gray-100 shadow-2xl space-y-8 animate-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-himalaya-red rounded-[28px] flex items-center justify-center mx-auto shadow-2xl shadow-red-900/30">
            <Wallet className="text-white" size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">बैंक विवरण सेटअप</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">अगाडि बढ्नको लागि कृपया आफ्नो बैंक विवरण भर्नुहोस्</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Bank Name (Khalti/eSewa/Bank)</label>
            <input 
              type="text" 
              required
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 outline-none focus:border-himalaya-red focus:bg-white transition-all font-bold shadow-inner" 
              placeholder="e.g. Khalti" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Account Number / ID</label>
            <input 
              type="text" 
              required
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 outline-none focus:border-himalaya-red focus:bg-white transition-all font-bold shadow-inner" 
              placeholder="98XXXXXXXX" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Account Holder Name</label>
            <input 
              type="text" 
              required
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 outline-none focus:border-himalaya-red focus:bg-white transition-all font-bold shadow-inner" 
              placeholder="Full Name" 
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-5 bg-himalaya-red text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-2xl shadow-red-900/30 disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Layout ---
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [playersMenuOpen, setPlayersMenuOpen] = React.useState(false);
  const [casinoMenuOpen, setCasinoMenuOpen] = React.useState(false);

  // Mandatory Bank Info Check
  if (user && profile && !profile.bankName && profile.role !== 'admin') {
    return <BankSetup />;
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-himalaya-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isAdmin = profile?.role === 'admin';

  if (isAdmin) {
    const adminSidebarItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin?tab=dashboard' },
      { name: 'Admins', icon: ShieldCheck, path: '/admin?tab=users' },
      { 
        name: 'Players', 
        icon: Users, 
        path: '/admin?tab=users',
        subItems: [
          { name: 'All Players', path: '/admin?tab=users' },
          { name: 'Saved Filters', path: '/admin?tab=users' }
        ]
      },
      { name: 'Transactions', icon: ArrowLeftRight, path: '/admin?tab=transactions' },
      { name: 'Bets', icon: CreditCard, path: '/admin?tab=transactions' },
      { name: 'Bonuses', icon: Gift, path: '/admin?tab=transactions' },
      { 
        name: 'Casino', 
        icon: Dices, 
        path: '/admin?tab=dashboard',
        subItems: [
          { name: 'Games', path: '/admin?tab=dashboard' },
          { name: 'Providers', path: '/admin?tab=dashboard' }
        ]
      },
      { name: 'Documents', icon: FileText, path: '/admin?tab=dashboard' },
      { name: 'Notifications', icon: Bell, path: '/admin?tab=chats' },
      { name: 'Monthly Report', icon: BarChart3, path: '/admin?tab=dashboard' },
      { name: 'Verification', icon: CheckCircle2, path: '/admin?tab=users', badge: '4' },
      { name: 'Payments', icon: CreditCard, path: '/admin?tab=transactions' },
      { name: 'Game Control', icon: Gamepad2, path: '/admin?tab=games' },
      { name: 'Settings', icon: Settings, path: '/admin?tab=settings' },
    ];

    return (
      <div className="min-h-screen flex bg-gray-50">
        <NotificationSystem />
        {/* Admin Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-50">
          <div className="p-6 flex items-center gap-3 border-b border-gray-100 bg-gray-50">
            <div className="w-8 h-8 bg-himalaya-red rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl italic">H</span>
            </div>
            <span className="text-gray-900 font-bold text-xl tracking-tight uppercase">Himalaya Admin</span>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {adminSidebarItems.map((item) => (
              <div key={item.name}>
                <button 
                  onClick={() => {
                    if (item.subItems) {
                      if (item.name === 'Players') setPlayersMenuOpen(!playersMenuOpen);
                      if (item.name === 'Casino') setCasinoMenuOpen(!casinoMenuOpen);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-6 py-3 transition-colors ${item.badge ? 'relative' : ''} ${
                    (location.search === '' && item.path.includes('tab=dashboard')) || 
                    (location.search !== '' && location.search.includes(item.path.split('?')[1])) 
                      ? 'bg-red-50 text-himalaya-red border-r-4 border-himalaya-red' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={18} className={
                      (location.search === '' && item.path.includes('tab=dashboard')) || 
                      (location.search !== '' && location.search.includes(item.path.split('?')[1])) 
                        ? 'text-himalaya-red' 
                        : 'text-gray-400'
                    } />
                    <span className="text-sm font-bold uppercase tracking-wider">{item.name}</span>
                  </div>
                  {item.subItems && (
                    <ChevronDown size={14} className={`transition-transform ${((item.name === 'Players' && playersMenuOpen) || (item.name === 'Casino' && casinoMenuOpen)) ? 'rotate-180' : ''}`} />
                  )}
                  {item.badge && (
                    <span className="absolute left-4 top-2 bg-himalaya-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                      {item.badge}
                    </span>
                  )}
                </button>
                {item.subItems && ((item.name === 'Players' && playersMenuOpen) || (item.name === 'Casino' && casinoMenuOpen)) && (
                  <div className="bg-gray-50 py-2">
                    {item.subItems.map(sub => (
                      <button 
                        key={sub.name}
                        onClick={() => navigate(sub.path)}
                        className="w-full text-left pl-14 py-2 text-xs text-gray-500 hover:text-himalaya-red font-bold transition-colors uppercase"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={() => signOut(auth)}
              className="w-full flex items-center gap-4 px-4 py-2 text-gray-500 hover:text-himalaya-red font-bold transition-colors uppercase text-xs"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Admin Main Content */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          {/* Admin Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Menu size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={() => window.location.reload()}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw size={18} />
              </button>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{profile?.email}</span>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                  {profile?.displayName?.charAt(0)}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'My Wallet', icon: Wallet, path: '/wallet' },
    { name: 'History', icon: History, path: '/history' },
    { name: 'Bonuses', icon: Gift, path: '/bonus' },
    { name: 'Live Chat', icon: MessageCircle, path: '/chat' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-20 overflow-x-hidden bg-white">
      <NotificationSystem />
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-all"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar / Dashboard */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-[70] transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-himalaya-red p-1 rounded-lg">
              <span className="text-white font-black italic text-lg tracking-tighter">HIMALAYA</span>
            </div>
            <span className="text-gray-900 font-black text-xl italic">777</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {profile && (
            <div className="glass-panel p-4 mb-6 border border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-himalaya-gold flex items-center justify-center text-white font-black">
                  {profile.displayName.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 font-black text-sm">{profile.displayName}</p>
                  <p className="text-himalaya-red text-[10px] font-bold tracking-tighter">NPR {profile.balance.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {sidebarItems.map((item) => (
            <button 
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group border border-transparent ${location.pathname === item.path ? 'bg-himalaya-red/10 text-himalaya-red' : 'text-gray-500 hover:bg-gray-50 hover:text-himalaya-red'}`}
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-black text-xs uppercase tracking-widest">{item.name}</span>
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center justify-center gap-2 text-gray-400 font-black text-xs uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
          >
            <Menu size={28} />
          </button>
          
          <div className="flex items-center gap-3">
            {profile && (
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[8px] font-bold text-gray-500 uppercase">Balance</span>
                <span className="text-xs font-black text-himalaya-red">NPR {profile.balance.toFixed(2)}</span>
              </div>
            )}
            {user ? (
              <button 
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-gray-900 font-black"
              >
                {profile?.displayName?.charAt(0) || 'U'}
              </button>
            ) : (
              <Link to="/login" className="btn-primary py-2 px-6 text-xs">Login</Link>
            )}
          </div>
        </div>
        <Marquee />
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
        <div className="flex justify-around items-center h-16">
          {[
            { name: 'HOME', icon: Home, path: '/' },
            { name: 'WALLET', icon: Wallet, path: '/wallet' },
            { name: 'HISTORY', icon: History, path: '/history' },
            { name: 'CHAT', icon: MessageCircle, path: '/chat' },
            { name: 'PROFILE', icon: User, path: '/profile' },
          ].map((item) => (
            <button 
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`p-1 rounded-lg transition-colors ${location.pathname === item.path ? 'text-himalaya-red' : 'text-gray-400'}`}>
                <item.icon size={24} />
              </div>
              <span className={`text-[8px] font-bold uppercase ${location.pathname === item.path ? 'text-himalaya-red' : 'text-gray-400'}`}>{item.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/wallet" element={
                <ProtectedRoute>
                  <WalletPage />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/bonus" element={
                <ProtectedRoute>
                  <BonusPage />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <LiveChatPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AppLayout>
        </Router>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
