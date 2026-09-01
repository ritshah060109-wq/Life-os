import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { GlassCard } from '../common/GlassCard';
import { X, User, Crown, Sparkles, Check, Shield } from 'lucide-react';
import { sound } from '../../utils/soundAndHaptics';

const CALLSIGN_PRESETS = [
  'Commander',
  'Vanguard',
  'Architect',
  'Titan',
  'Sovereign',
  'Scholar',
  'Captain',
  'Apex',
  'Guardian',
  'Phoenix',
];

const TEMPLATE_PRESETS = [
  { label: 'Title + Name', template: '{title} {name}', example: 'Commander Alex' },
  { label: 'Title Only', template: '{title}', example: 'Commander' },
  { label: 'Name Only', template: '{name}', example: 'Alex' },
  { label: 'Lord / Sovereign', template: 'Lord {name}', example: 'Lord Alex' },
  { label: 'Agent / Operator', template: 'Agent {name}', example: 'Agent Alex' },
  { label: 'Epithet Suffix', template: '{name} the Sovereign', example: 'Alex the Sovereign' },
];

interface NameCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NameCustomizerModal: React.FC<NameCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, economy } = useLifeOS();

  const [name, setName] = useState(settings.userName || 'Commander');
  const [title, setTitle] = useState(settings.userTitle || 'Commander');
  const [template, setTemplate] = useState(settings.nameTemplate || '{title}');
  const [customTemplate, setCustomTemplate] = useState(settings.nameTemplate || '{title}');
  const [activeTitle, setActiveTitle] = useState(economy.activeTitle || 'Disciplined');

  if (!isOpen) return null;

  const renderFormattedName = (tmpl: string, rawName: string, rawTitle: string) => {
    return tmpl
      .replace(/{name}/g, rawName || 'User')
      .replace(/{title}/g, rawTitle || 'Commander');
  };

  const currentFormatted = renderFormattedName(template, name, title);

  const handleSave = () => {
    sound.coin();
    updateSettings({
      userName: name.trim() || 'Commander',
      userTitle: title.trim() || 'Commander',
      nameTemplate: template,
    });
    onClose();
  };

  const unlockedTitles = economy.unlockedTitles || ['Beginner', 'Explorer', 'Disciplined'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg overflow-hidden"
        >
          <GlassCard variant="gold" className="p-5 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Identity & Name Customizer</h3>
                  <p className="text-[11px] text-zinc-400">Configure your call sign, display name & format</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Live Preview Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/30 text-center space-y-1 relative overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">
                Live Command Identity Preview
              </span>
              <div className="text-xl font-extrabold text-amber-300 drop-shadow-sm font-mono">
                {currentFormatted}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
                <span>Rank: Level {economy.level}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{activeTitle}</span>
              </div>
            </div>

            {/* 1. Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <User size={13} className="text-amber-400" />
                Personal Name / Alias
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* 2. Call Sign / Prefix */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Shield size={13} className="text-cyan-400" />
                Call Sign / Title Prefix
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Commander"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.08] text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
              />

              {/* Call Sign Quick Select */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {CALLSIGN_PRESETS.map(cs => (
                  <button
                    key={cs}
                    type="button"
                    onClick={() => setTitle(cs)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                      title === cs
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {cs}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Name Template Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Sparkles size={13} className="text-yellow-400" />
                Name Template Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATE_PRESETS.map(tp => {
                  const isSelected = template === tp.template;
                  return (
                    <button
                      key={tp.label}
                      type="button"
                      onClick={() => setTemplate(tp.template)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-black/30 border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">{tp.label}</span>
                        {isSelected && <Check size={12} className="text-amber-400 stroke-[3]" />}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
                        {renderFormattedName(tp.template, name, title)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Active RPG Title Selection */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-zinc-200">
                Unlocked RPG Titles ({unlockedTitles.length})
              </label>
              <div className="flex flex-wrap gap-1.5">
                {unlockedTitles.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTitle(t)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                      activeTitle === t
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black border-amber-300 shadow-sm'
                        : 'bg-black/40 text-zinc-400 border-white/[0.08] hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 transition-all flex items-center gap-1.5"
              >
                <Check size={14} className="stroke-[3]" />
                Apply Changes
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
