import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { GlassCard } from '../common/GlassCard';
import { DynamicIcon } from '../common/DynamicIcon';
import { CircularProgress } from '../common/CircularProgress';
import { GoldenVaultModal } from '../vault/GoldenVaultModal';
import { VaultOpeningModal } from '../vault/VaultOpeningModal';
import {
  Coins,
  Wallet,
  ShoppingBag,
  TrendingDown,
  Lock,
  Sparkles,
  Plus,
  ArrowUpRight,
  History,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Gift,
  KeyRound,
  Trash2,
  Hourglass,
  Flame,
  Award,
  Zap,
  Calendar,
  FastForward,
  RotateCw,
  Eye,
  HeartHandshake,
} from 'lucide-react';
import { getTodayKey, getPastDateKey } from '../../utils/defaultData';
import { GoldenVault, TimeCapsule } from '../../types';

export const EconomyView: React.FC = () => {
  const {
    economy,
    rewards,
    purchaseReward,
    purchaseHistory,
    expenses,
    transactions,
    logExpense,
    vaults,
    depositVault,
    withdrawVault,
    reinvestVault,
    extendVaultTerm,
    simulateAdvanceVault,
    capsules,
    createTimeCapsule,
    unlockTimeCapsule,
    deleteReward,
    difficultyConfig,
    todayScore,
    activeVaultForOpening,
    activeCapsuleForOpening,
    setActiveVaultForOpening,
    setActiveCapsuleForOpening,
    settings,
    openQuickAdd,
  } = useLifeOS();

  const isLight = settings.theme === 'white';
  const today = getTodayKey();

  // Sub-tabs in ECONOMY
  const [econTab, setEconTab] = useState<'wallet' | 'shop' | 'spending' | 'vault' | 'capsule'>('shop');

  // Vault creation modal
  const [vaultModalOpen, setVaultModalOpen] = useState(false);
  const [vaultModalMode, setVaultModalMode] = useState<'vault' | 'capsule'>('vault');

  // Spending Log Form
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(50);
  const [expenseCategory, setExpenseCategory] = useState('Personal Allowance');
  const [expenseReason, setExpenseReason] = useState('Weekend recreation');

  // Category filter for Reward Shop
  const [selectedShopCategory, setSelectedShopCategory] = useState<string>('All');
  const shopCategories = ['All', 'Food', 'Entertainment', 'Shopping', 'Learning', 'Travel', 'Luxury', 'Custom'];

  const filteredRewards = selectedShopCategory === 'All'
    ? rewards
    : rewards.filter(r => r.category === selectedShopCategory);

  const savingsRate = economy.lifetimeEarned > 0
    ? Math.max(0, Math.round(((economy.lifetimeEarned - economy.lifetimeSpent) / economy.lifetimeEarned) * 100))
    : 100;

  const handleOpenVaultCreator = (mode: 'vault' | 'capsule') => {
    setVaultModalMode(mode);
    setVaultModalOpen(true);
  };

  return (
    <div className="space-y-4 pb-24 max-w-2xl mx-auto px-4 pt-3" id="economy-hub">
      {/* Top Segmented Tabs for Economy */}
      <div className="flex items-center justify-between p-1 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-xl overflow-x-auto no-scrollbar">
        {[
          { id: 'shop', label: 'Reward Shop', icon: ShoppingBag },
          { id: 'wallet', label: 'Wallet & Stats', icon: Wallet },
          { id: 'vault', label: 'Golden Vault', icon: KeyRound },
          { id: 'capsule', label: 'Time Capsule', icon: Lock },
          { id: 'spending', label: 'Spending', icon: TrendingDown },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = econTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setEconTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md shadow-amber-500/20 font-extrabold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. REWARD SHOP (The Core Incentive Engine) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {econTab === 'shop' && (
        <div className="space-y-4">
          {/* Shop Hero Card with Balance */}
          <GlassCard variant="gold" className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> Available Spending Power
              </span>
              <div className="text-3xl font-extrabold font-mono text-amber-300">
                {economy.coins.toLocaleString()} <span className="text-sm font-sans text-amber-400/80">Coins</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Earned strictly through disciplined habit mastery.
              </p>
            </div>

            <button
              onClick={() => openQuickAdd('reward')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Reward</span>
            </button>
          </GlassCard>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {shopCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedShopCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedShopCategory === cat
                    ? 'bg-amber-500 text-black border-amber-400 font-bold'
                    : isLight
                    ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    : 'bg-black/30 text-zinc-400 border-white/[0.08] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Reward Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRewards.map(reward => {
              const adjustedCost = Math.round(reward.coinCost * difficultyConfig.rewardCostMultiplier);
              const canAfford = economy.coins >= adjustedCost;

              return (
                <GlassCard
                  key={reward.id}
                  className="flex flex-col justify-between p-4 space-y-3 relative overflow-hidden border"
                >
                  {reward.imageUrl && (
                    <div className="w-full h-28 rounded-xl overflow-hidden mb-1 relative bg-black/40">
                      <img
                        src={reward.imageUrl}
                        alt={reward.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-black/70 backdrop-blur-md text-amber-300">
                        {reward.category}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                          <DynamicIcon name={reward.icon || 'Gift'} className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-zinc-100">{reward.name}</h4>
                      </div>
                      <button
                        onClick={() => deleteReward(reward.id)}
                        className="text-zinc-600 hover:text-red-400 p-1"
                        title="Delete custom reward"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-sm font-extrabold font-mono text-amber-400">
                        <Coins className="w-4 h-4" />
                        <span>{adjustedCost} Coins</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Redeemed {reward.timesPurchased}x
                      </span>
                    </div>

                    <button
                      onClick={() => purchaseReward(reward.id)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-400 hover:to-yellow-300 hover:scale-105 active:scale-95'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Redeem Reward' : 'Need More Coins'}
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Lifetime Purchase History */}
          {purchaseHistory.length > 0 && (
            <GlassCard className="p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-amber-400" /> Reward Purchase History
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {purchaseHistory.length} Redemptions
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {purchaseHistory.map(log => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-black/20 border border-white/[0.04] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-zinc-200">{log.rewardName}</span>
                      <span className="text-[10px] text-zinc-500 block">{log.timestamp} • {log.category}</span>
                    </div>
                    <span className="font-mono font-bold text-rose-400">
                      -{log.coinCost} Coins
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. WALLET & FINANCIAL STATS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {econTab === 'wallet' && (
        <div className="space-y-4">
          <GlassCard variant="gold" className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Discipline Currency Balance
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 font-mono">
                Level {economy.level}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-zinc-400 block">Current Coins</span>
                <span className="text-3xl font-extrabold font-mono text-amber-300">
                  {economy.coins.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-zinc-400 block">Golden Tokens</span>
                <span className="text-3xl font-extrabold font-mono text-yellow-400 flex items-center gap-1.5">
                  <Award className="w-6 h-6" /> {economy.goldenTokens}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.08] text-center text-xs">
              <div className="p-2 rounded-xl bg-black/30">
                <span className="text-[10px] text-zinc-400 block">Lifetime Earned</span>
                <span className="font-mono font-bold text-emerald-400">+{economy.lifetimeEarned}</span>
              </div>
              <div className="p-2 rounded-xl bg-black/30">
                <span className="text-[10px] text-zinc-400 block">Lifetime Spent</span>
                <span className="font-mono font-bold text-rose-400">-{economy.lifetimeSpent}</span>
              </div>
              <div className="p-2 rounded-xl bg-black/30">
                <span className="text-[10px] text-zinc-400 block">Savings Rate</span>
                <span className="font-mono font-bold text-cyan-400">{savingsRate}%</span>
              </div>
            </div>
          </GlassCard>

          {/* Income vs Expense Visualization Bar */}
          <GlassCard className="p-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Economy Flow Ratio
            </span>
            <div className="h-4 w-full rounded-full bg-zinc-800 overflow-hidden flex">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${Math.min(100, (economy.lifetimeEarned / ((economy.lifetimeEarned + economy.lifetimeSpent) || 1)) * 100)}%` }}
                title="Earned"
              />
              <div
                className="h-full bg-rose-500"
                style={{ width: `${Math.min(100, (economy.lifetimeSpent / ((economy.lifetimeEarned + economy.lifetimeSpent) || 1)) * 100)}%` }}
                title="Spent"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="text-emerald-400">● Earned: {economy.lifetimeEarned}</span>
              <span className="text-rose-400">● Spent: {economy.lifetimeSpent}</span>
            </div>
          </GlassCard>

          {/* Recent Transactions (Last 5 Events) */}
          <GlassCard className="p-4 space-y-3" id="wallet-recent-transactions-card">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                    Recent Transactions
                  </h4>
                  <p className="text-[10px] text-zinc-400">
                    Last 5 coin-earning & spending activities
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/40 border border-white/[0.08] text-zinc-400">
                Last 5
              </span>
            </div>

            {(!transactions || transactions.length === 0) ? (
              <div className="py-6 text-center text-xs text-zinc-500 italic">
                No recent transactions recorded on Day 1. Complete habits or streak check-in to earn coins.
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 5).map(tx => {
                  const isEarn = tx.type === 'earn';
                  return (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded-xl bg-zinc-950/40 border border-white/[0.05] hover:border-white/[0.1] flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isEarn
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isEarn ? (
                            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <TrendingDown className="w-4 h-4 stroke-[2.5]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-zinc-200 block truncate">
                            {tx.label}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5">
                            <span className="font-mono">{tx.timestamp}</span>
                            <span>•</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-300 font-medium">
                              {tx.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-mono font-extrabold ${
                            isEarn ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isEarn ? `+${tx.amount}` : `-${tx.amount}`}
                        </span>
                        <span className="text-[10px] text-zinc-500 block font-sans">
                          Coins
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. GOLDEN TOKEN VAULT (Discipline Investments & Treasure Unsealing) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {econTab === 'vault' && (
        <div className="space-y-4">
          <GlassCard variant="gold" className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md shadow-amber-500/10">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-amber-300 tracking-tight">
                    Golden Token Discipline Vault
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Compound long-term sovereignty. Yields scale with your consistency.
                  </p>
                </div>
              </div>

              <button
                id="open-deposit-vault-modal-btn"
                onClick={() => handleOpenVaultCreator('vault')}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-extrabold text-xs tracking-wide shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Plus size={14} className="stroke-[3]" />
                New Deposit
              </button>
            </div>

            {/* Discipline Multiplier Status Ribbon */}
            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-neutral-300 font-medium">
                  Current Day Score: <strong className="text-amber-300">{todayScore.score} pts</strong>
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30 font-mono">
                {todayScore.score >= 90 ? '1.50x Multiplier (Max)' : todayScore.score >= 80 ? '1.25x Multiplier (High)' : '1.00x (Standard)'}
              </span>
            </div>
          </GlassCard>

          {/* Active Vaults List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Active Vault Certificates ({vaults.length})
              </span>
              <span className="text-[11px] text-amber-400 font-mono">
                {vaults.filter(v => v.status === 'matured').length} Ready to Unseal
              </span>
            </div>

            {vaults.length === 0 ? (
              <div className="p-8 rounded-2xl bg-black/30 border border-white/5 text-center space-y-3">
                <KeyRound size={28} className="mx-auto text-neutral-600" />
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  No active Golden Vaults locked. Forge your first sovereign certificate to begin compounding your discipline!
                </p>
                <button
                  onClick={() => handleOpenVaultCreator('vault')}
                  className="py-2 px-4 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all"
                >
                  Deposit Life Coins
                </button>
              </div>
            ) : (
              vaults.map(vault => {
                const isMatured = vault.status === 'matured' || vault.remainingDays <= 0;
                const safeTerm = vault.termDays && !isNaN(vault.termDays) && vault.termDays > 0 ? vault.termDays : 1;
                const safeRemaining = typeof vault.remainingDays === 'number' && !isNaN(vault.remainingDays) ? vault.remainingDays : 0;
                const progressPct = Math.min(100, Math.max(0, Math.round(((safeTerm - safeRemaining) / safeTerm) * 100)));

                return (
                  <GlassCard 
                    key={vault.id} 
                    className={`p-4 space-y-3 relative overflow-hidden transition-all ${
                      isMatured
                        ? 'border-amber-400/60 shadow-[0_0_24px_rgba(245,158,11,0.25)] bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-black/40'
                        : 'border-white/10'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${
                          isMatured
                            ? 'bg-amber-500 text-neutral-950 border-amber-300 animate-pulse'
                            : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                        }`}>
                          <KeyRound size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white tracking-tight">
                              {vault.name || `${vault.termDays}-Day Sovereign Certificate`}
                            </h4>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase border ${
                              isMatured
                                ? 'bg-amber-500 text-neutral-950 border-amber-400'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}>
                              {isMatured ? 'Matured ✨' : 'Growing 📈'}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            Maturity: {vault.maturityDate} • {vault.remainingDays > 0 ? `${vault.remainingDays} days remaining` : 'Matured & Sealed'}
                          </p>
                        </div>
                      </div>

                      {/* Fast-Forward Simulation Test Tool */}
                      <button
                        onClick={() => simulateAdvanceVault(vault.id, 7)}
                        className="py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-amber-300 text-[10px] font-mono border border-white/5 flex items-center gap-1 transition-colors"
                        title="Simulate +7 days of time passing to test maturity"
                      >
                        <FastForward size={11} />
                        +7d Sim
                      </button>
                    </div>

                    {/* Metric Cards Matrix */}
                    <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/[0.04] text-center text-xs">
                      <div>
                        <span className="text-[9px] text-neutral-400 block">Deposit</span>
                        <span className="font-mono font-bold text-neutral-200">{vault.depositCoins}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-400 block">Multiplier</span>
                        <span className="font-mono font-bold text-amber-400">{vault.currentMultiplier}x</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-400 block">Current Val</span>
                        <span className="font-mono font-bold text-emerald-400">{vault.currentValue}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-400 block">Expected Return</span>
                        <span className="font-mono font-black text-amber-300">+{vault.estimatedReturnCoins}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                        <span>Lock Progress</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          className={`h-full rounded-full ${
                            isMatured
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                              : 'bg-gradient-to-r from-amber-500 to-yellow-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Action Controls: Unseal Treasure Chest / Reinvest / Extend */}
                    <div className="flex items-center gap-2 pt-1">
                      {isMatured ? (
                        <button
                          onClick={() => setActiveVaultForOpening(vault)}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Sparkles size={14} className="stroke-[3]" />
                          Unseal Vault Treasure Chest
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveVaultForOpening(vault)}
                          className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Eye size={13} />
                          Inspect & Harvest Early
                        </button>
                      )}

                      <button
                        onClick={() => reinvestVault(vault.id)}
                        className="py-2 px-3 rounded-xl bg-black/40 border border-amber-500/30 text-amber-300 font-bold text-xs hover:bg-amber-500/10 flex items-center gap-1 transition-colors"
                        title="Reinvest principal + interest to compound rewards (+0.30x multiplier booster)"
                      >
                        <RotateCw size={12} />
                        Compound
                      </button>

                      <button
                        onClick={() => extendVaultTerm(vault.id, 30)}
                        className="py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-neutral-400 hover:text-white font-bold text-xs hover:bg-white/5 transition-colors"
                        title="Extend lock duration by 30 days"
                      >
                        +30d
                      </button>
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. TIME CAPSULE (Locked Personal Promises & Sealed Letters) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {econTab === 'capsule' && (
        <div className="space-y-4">
          <GlassCard variant="glow" className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-md shadow-indigo-500/10">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-indigo-300 tracking-tight">
                    Immutable Time Capsules
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Lock coins and sealed oaths to your future self.
                  </p>
                </div>
              </div>

              <button
                id="forge-time-capsule-btn"
                onClick={() => handleOpenVaultCreator('capsule')}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-indigo-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Plus size={14} className="stroke-[3]" />
                Forge Capsule
              </button>
            </div>
          </GlassCard>

          {/* List of Sealed & Opened Capsules */}
          <div className="space-y-3">
            {capsules.length === 0 ? (
              <div className="p-8 rounded-2xl bg-black/30 border border-white/5 text-center space-y-3">
                <HeartHandshake size={28} className="mx-auto text-neutral-600" />
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  No sealed time capsules yet. Create an oath to your future self with locked coin bounty.
                </p>
                <button
                  onClick={() => handleOpenVaultCreator('capsule')}
                  className="py-2 px-4 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 hover:bg-indigo-500/30 text-xs font-bold transition-all"
                >
                  Seal New Capsule
                </button>
              </div>
            ) : (
              capsules.map(cap => (
                <GlassCard 
                  key={cap.id} 
                  className={`p-4 space-y-3 border transition-all ${
                    cap.isUnlocked ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-indigo-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        cap.isUnlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100">{cap.title}</h4>
                        <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                          Target Date: {cap.targetDate}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      cap.isUnlocked ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {cap.isUnlocked ? 'Opened' : 'Sealed'}
                    </span>
                  </div>

                  {cap.photoUrl && (
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-black/40 border border-white/5">
                      <img src={cap.photoUrl} alt="Capsule visual" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <p className="text-xs italic text-zinc-300 p-2.5 rounded-xl bg-black/40 border border-white/[0.04] line-clamp-2">
                    "{cap.futureMessage}"
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-mono text-amber-400 font-bold">
                      🔒 {cap.lockedCoins} Coins Locked (+{cap.bonusCoinsEarned} Bonus)
                    </span>

                    {cap.isUnlocked ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked & Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveCapsuleForOpening(cap)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Sparkles size={12} />
                        Open Capsule Flow
                      </button>
                    )}
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. SPENDING MANAGER */}
      {/* ───────────────────────────────────────────────────────────── */}
      {econTab === 'spending' && (
        <div className="space-y-4">
          <GlassCard className="p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
              Log External or Custom Expense
            </span>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Expense Name (e.g. Cheat Meal Fine)"
                value={expenseName}
                onChange={e => setExpenseName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
              />
              <input
                type="number"
                placeholder="Amount (Coins)"
                value={expenseAmount}
                onChange={e => setExpenseAmount(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-white"
              />
            </div>

            <input
              type="text"
              placeholder="Reason & Category"
              value={expenseReason}
              onChange={e => setExpenseReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
            />

            <button
              onClick={() => {
                if (!expenseName.trim()) return;
                logExpense({
                  name: expenseName,
                  amount: expenseAmount,
                  category: expenseCategory,
                  reason: expenseReason,
                });
                setExpenseName('');
              }}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
            >
              Deduct & Record Expense
            </button>
          </GlassCard>

          {/* Expense Log List */}
          <GlassCard className="p-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block pb-1 border-b border-white/[0.06]">
              Discipline Deductions & Spending Log
            </span>

            {expenses.map(exp => (
              <div key={exp.id} className="p-2.5 rounded-xl bg-black/20 border border-white/[0.04] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-zinc-200">{exp.name}</span>
                  <span className="text-[10px] text-zinc-500 block">{exp.date} • {exp.reason}</span>
                </div>
                <span className="font-mono font-bold text-rose-400">-{exp.amount} Coins</span>
              </div>
            ))}
          </GlassCard>
        </div>
      )}

      {/* Golden Vault & Capsule Modal */}
      <GoldenVaultModal
        isOpen={vaultModalOpen}
        onClose={() => setVaultModalOpen(false)}
        initialMode={vaultModalMode}
      />

      {/* Treasure Chest Opening Ceremony Modal */}
      <VaultOpeningModal
        isOpen={!!activeVaultForOpening || !!activeCapsuleForOpening}
        onClose={() => {
          setActiveVaultForOpening(null);
          setActiveCapsuleForOpening(null);
        }}
        vault={activeVaultForOpening}
        capsule={activeCapsuleForOpening}
      />
    </div>
  );
};

