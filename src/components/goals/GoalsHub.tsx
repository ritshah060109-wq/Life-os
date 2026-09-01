import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  Trophy,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { PersonalGoal, GoalPriority } from '../../types';
import { GoalCard } from './GoalCard';
import { CompletedGoalCard } from './CompletedGoalCard';
import { GoalModal } from './GoalModal';
import { GlassCard } from '../common/GlassCard';
import { sound } from '../../utils/soundAndHaptics';

export const GoalsHub: React.FC = () => {
  const { goals, settings } = useLifeOS();
  const isLight = settings.theme === 'white';

  const [modalOpen, setModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<PersonalGoal | null>(null);
  const [selectedTab, setSelectedTab] = useState<'active' | 'all' | 'completed'>('active');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompletedArchive, setShowCompletedArchive] = useState(true);

  // Current year-month for "Completed This Month" stat (e.g. "2026-08")
  const currentYearMonth = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, []);

  // Goal Statistics Calculations
  const stats = useMemo(() => {
    const total = goals.length;
    const active = goals.filter(g => g.status !== 'completed').length;
    const completed = goals.filter(g => g.status === 'completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const completedThisMonth = goals.filter(
      g => g.status === 'completed' && g.completedAt && g.completedAt.startsWith(currentYearMonth)
    ).length;

    return {
      total,
      active,
      completed,
      completionRate,
      completedThisMonth,
    };
  }, [goals, currentYearMonth]);

  // Categories present in goals
  const categories = useMemo(() => {
    const set = new Set<string>();
    goals.forEach(g => {
      if (g.category) set.add(g.category);
    });
    return ['All', ...Array.from(set)];
  }, [goals]);

  // Filtered lists
  const filteredActiveGoals = useMemo(() => {
    return goals
      .filter(g => g.status !== 'completed')
      .filter(g => {
        if (selectedCategory !== 'All' && g.category !== selectedCategory) return false;
        if (selectedPriority !== 'All' && g.priority !== selectedPriority) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            g.title.toLowerCase().includes(q) ||
            (g.description && g.description.toLowerCase().includes(q)) ||
            g.category.toLowerCase().includes(q)
          );
        }
        return true;
      });
  }, [goals, selectedCategory, selectedPriority, searchQuery]);

  const filteredCompletedGoals = useMemo(() => {
    return goals
      .filter(g => g.status === 'completed')
      .filter(g => {
        if (selectedCategory !== 'All' && g.category !== selectedCategory) return false;
        if (selectedPriority !== 'All' && g.priority !== selectedPriority) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            g.title.toLowerCase().includes(q) ||
            (g.description && g.description.toLowerCase().includes(q)) ||
            g.category.toLowerCase().includes(q)
          );
        }
        return true;
      });
  }, [goals, selectedCategory, selectedPriority, searchQuery]);

  const handleOpenCreateModal = () => {
    sound.tap();
    setGoalToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (goal: PersonalGoal) => {
    sound.tap();
    setGoalToEdit(goal);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4" id="goals-hub-section">
      {/* 1. Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-md shadow-amber-500/10">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight leading-tight">
              Personal Goals & Milestones
            </h3>
            <p className="text-xs text-neutral-400">
              Forge and conquer unlimited personal, fitness, and career goals
            </p>
          </div>
        </div>

        <button
          id="create-personal-goal-btn"
          onClick={handleOpenCreateModal}
          className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={15} className="stroke-[3]" />
          <span>New Goal</span>
        </button>
      </div>

      {/* 2. Goal Statistics Dashboard (5 Key Metrics) */}
      <GlassCard variant="gold" className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <TrendingUp size={14} />
            <span>Goal Statistics & Velocity</span>
          </span>
          <span className="text-[11px] font-mono text-neutral-400">
            {stats.active} Active • {stats.completed} Completed
          </span>
        </div>

        {/* 5 Stats Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* Stat 1: Total Goals */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
            <span className="text-[10px] text-neutral-400 block font-medium">Total Goals</span>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-white mt-0.5 block">
              {stats.total}
            </span>
          </div>

          {/* Stat 2: Active Goals */}
          <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 text-center">
            <span className="text-[10px] text-amber-300/80 block font-medium">Active Goals</span>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-amber-400 mt-0.5 block">
              {stats.active}
            </span>
          </div>

          {/* Stat 3: Completed Goals */}
          <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-center">
            <span className="text-[10px] text-emerald-300/80 block font-medium">Completed</span>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-emerald-400 mt-0.5 block">
              {stats.completed}
            </span>
          </div>

          {/* Stat 4: Completion Rate */}
          <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/20 text-center">
            <span className="text-[10px] text-cyan-300/80 block font-medium">Completion Rate</span>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-cyan-400 mt-0.5 block">
              {stats.completionRate}%
            </span>
          </div>

          {/* Stat 5: Goals Completed This Month */}
          <div className="p-3 rounded-xl bg-black/40 border border-purple-500/20 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] text-purple-300/80 block font-medium">Completed This Month</span>
            <span className="text-lg sm:text-xl font-extrabold font-mono text-purple-300 mt-0.5 block">
              {stats.completedThisMonth}
            </span>
          </div>
        </div>

        {/* Overall Completion Progress Bar */}
        <div className="mt-3.5 pt-3 border-t border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
            <span>Overall Milestone Completion</span>
            <span className="text-amber-400 font-bold">{stats.completionRate}% Done</span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </GlassCard>

      {/* 3. Search & Filter Bar */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search goals by name, description, category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* View Tab Filter */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-black/50 border border-white/10 text-xs">
            {(['active', 'all', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  sound.tap();
                  setSelectedTab(tab);
                }}
                className={`py-1.5 px-2.5 rounded-lg font-bold capitalize transition-all text-xs text-center ${
                  selectedTab === tab
                    ? 'bg-amber-500 text-black shadow-sm font-extrabold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab === 'active' ? `Active (${stats.active})` : tab === 'completed' ? `Done (${stats.completed})` : `All (${stats.total})`}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills Filter */}
        {categories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  sound.tap();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-sm'
                    : 'bg-black/30 text-neutral-400 border-white/5 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Active Goals Cards Section */}
      {(selectedTab === 'active' || selectedTab === 'all') && (
        <div className="space-y-3">
          {filteredActiveGoals.length === 0 ? (
            <div className="p-8 rounded-2xl bg-black/30 border border-white/5 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                <Target size={24} />
              </div>
              <h4 className="text-sm font-bold text-white">No active goals found</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                {searchQuery || selectedCategory !== 'All'
                  ? 'Try clearing your filters or search keywords.'
                  : 'Start your journey by forging your first high-impact personal goal.'}
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="mt-2 py-1.5 px-3 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold transition-all"
              >
                + Forge First Goal
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActiveGoals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleOpenEditModal}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Completed Goals Archive Section */}
      {(selectedTab === 'completed' || selectedTab === 'all') && filteredCompletedGoals.length > 0 && (
        <div className="space-y-3 pt-2">
          {/* Header Bar */}
          <div
            onClick={() => setShowCompletedArchive(!showCompletedArchive)}
            className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/15 transition-all"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300">
                Completed Goals Archive ({filteredCompletedGoals.length})
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <span>{showCompletedArchive ? 'Hide' : 'Show'}</span>
              {showCompletedArchive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>

          {/* List of Completed Goals */}
          {showCompletedArchive && (
            <div className="space-y-3">
              {filteredCompletedGoals.map(goal => (
                <CompletedGoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Goal Modal (Create & Edit) */}
      <GoalModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setGoalToEdit(null);
        }}
        goalToEdit={goalToEdit}
      />
    </div>
  );
};
