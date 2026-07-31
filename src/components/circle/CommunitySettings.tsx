import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Check, RefreshCw, UserCheck, Shield, Clock, 
  Dices, User, CheckCircle2, RotateCw, Loader2, Sparkle
} from 'lucide-react';
import { useCircle } from '../../context/CircleContext';
import Card from '../common/Card';
import { useToast } from '../../context/ToastContext';

// WORD LIBRARIES
export const PREFIX_OPTIONS = [
  'Silent', 'Nova', 'Swift', 'Golden', 'Curious', 
  'Bright', 'Royal', 'Pixel', 'Lucky', 'Shadow', 
  'Neon', 'Cyber', 'Echo', 'Solar', 'Astral', 
  'Crimson', 'Azure', 'Emerald', 'Scarlet', 'Ivory', 
  'Iron', 'Crystal', 'Mystic', 'Rapid', 'Cosmic', 
  'Quantum', 'Hyper', 'Ultra', 'Prime', 'Epic', 
  'Alpha', 'Omega', 'Turbo', 'Frozen', 'Thunder', 
  'Storm', 'Blazing', 'Lunar', 'Arctic', 'Hidden'
];

export const MIDDLE_OPTIONS = [
  'Blue', 'Silver', 'Dark', 'Light', 'Fire', 
  'Ice', 'Star', 'Moon', 'Sky', 'Cloud', 
  'Stone', 'Leaf', 'River', 'Forest', 'Wind', 
  'Dream', 'Flash', 'Magic', 'Pulse', 'Pixel'
];

export const SUFFIX_OPTIONS = [
  'Falcon', 'Tiger', 'Scholar', 'River', 'Voyager', 
  'Phoenix', 'Explorer', 'Coder', 'Panda', 'Comet', 
  'Hawk', 'Eagle', 'Nomad', 'Scout', 'Spark', 
  'Wolf', 'Fox', 'Lion', 'Dragon', 'Raven', 
  'Bear', 'Otter', 'Dolphin', 'Shark', 'Viper', 
  'Knight', 'Wizard', 'Ninja', 'Samurai', 'Pilot', 
  'Ranger', 'Guardian', 'Runner', 'Builder', 'Artist', 
  'Dreamer', 'Inventor', 'Thinker', 'Walker', 'Navigator'
];

export const SEPARATORS = ['', '_', '-', '.'];

// Mock taken names for testing uniqueness check
const TAKEN_MOCK = [
  'Royal_Fire_Falcon1',
  'Nova_Ice_Ranger2',
  'VaigaiAdmin',
  'KaveriWarden',
  'Silent_Dark_Falcon',
  'Pixel_Coder_Panda',
  'Swift_Star_Wolf1'
];

// Single random username generator following formula: Prefix + Separator + Middle + Separator + Suffix + Optional Digit
export const generateSingleUsername = (): string => {
  const prefix = PREFIX_OPTIONS[Math.floor(Math.random() * PREFIX_OPTIONS.length)];
  const middle = MIDDLE_OPTIONS[Math.floor(Math.random() * MIDDLE_OPTIONS.length)];
  const suffix = SUFFIX_OPTIONS[Math.floor(Math.random() * SUFFIX_OPTIONS.length)];
  const sep = SEPARATORS[Math.floor(Math.random() * SEPARATORS.length)];
  
  // Digit (0-9)
  const hasDigit = Math.random() > 0.15;
  const digit = hasDigit ? Math.floor(Math.random() * 10).toString() : '';

  const username = `${prefix}${sep}${middle}${sep}${suffix}${digit}`;

  // Validate rules: Length 6 to 30
  if (username.length >= 6 && username.length <= 30) {
    return username;
  }
  return `${prefix}_${middle}_${suffix}7`;
};

// Generate 5 completely different username suggestions
export const generateFiveSuggestions = (excludeList: string[] = []): string[] => {
  const list: string[] = [];
  let attempts = 0;

  while (list.length < 5 && attempts < 150) {
    attempts++;
    const cand = generateSingleUsername();
    if (!list.includes(cand) && !excludeList.includes(cand)) {
      list.push(cand);
    }
  }

  // Pre-seeded defaults if needed
  const fallbackSeeds = [
    'Royal_Fire_Falcon7',
    'Nova-Ice-Wolf4',
    'GoldenStarExplorer8',
    'Pixel.Cloud.Panda2',
    'HyperMagicKnight6'
  ];

  for (const seed of fallbackSeeds) {
    if (list.length < 5 && !list.includes(seed) && !excludeList.includes(seed)) {
      list.push(seed);
    }
  }

  return list;
};

export const CommunitySettings: React.FC = () => {
  const { userProfile, updateUserProfile } = useCircle();
  const { showToast } = useToast();

  // Clean initial handle
  const initialUser = userProfile.communityUsername.startsWith('@') 
    ? userProfile.communityUsername.slice(1) 
    : userProfile.communityUsername || 'Royal_Fire_Falcon7';

  const [selectedUsername, setSelectedUsername] = useState<string>(initialUser);
  const [suggestions, setSuggestions] = useState<string[]>(() => generateFiveSuggestions([initialUser]));
  
  // Micro-interaction states
  const [isRolling, setIsRolling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [autoRegenerating, setAutoRegenerating] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Availability validation
  const isTaken = TAKEN_MOCK.includes(selectedUsername);
  const isAvailable = !isTaken && selectedUsername.length >= 6 && selectedUsername.length <= 30;

  // Handle mock taken username auto-regeneration
  useEffect(() => {
    if (isTaken) {
      setAutoRegenerating(true);
      const timer = setTimeout(() => {
        let fresh = generateSingleUsername();
        while (TAKEN_MOCK.includes(fresh)) {
          fresh = generateSingleUsername();
        }
        setSelectedUsername(fresh);
        setAutoRegenerating(false);
        showToast({
          title: 'Username Taken',
          message: 'Original handle was taken. Generating another available username...',
          type: 'info',
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedUsername, isTaken]);

  const handleGenerate = () => {
    setIsRolling(true);
    setIsChecking(true);
    setTimeout(() => {
      const newSuggestions = generateFiveSuggestions(suggestions);
      setSuggestions(newSuggestions);
      setSelectedUsername(newSuggestions[0]);
      setIsRolling(false);
      setIsChecking(false);
    }, 350);
  };

  const handleRefreshSuggestions = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newSuggestions = generateFiveSuggestions([...suggestions, selectedUsername]);
      setSuggestions(newSuggestions);
      setIsRefreshing(false);
    }, 350);
  };

  const handleSelectChip = (sug: string) => {
    setIsChecking(true);
    setSelectedUsername(sug);
    setTimeout(() => {
      setIsChecking(false);
    }, 200);
  };

  const handleSaveUsername = () => {
    if (!isAvailable) {
      showToast({
        title: 'Cannot Save',
        message: 'Please choose an available username between 6 and 30 characters.',
        type: 'error',
      });
      return;
    }

    const formatted = `@${selectedUsername}`;
    updateUserProfile({
      communityUsername: formatted,
      lastUsernameChangedDate: new Date().toISOString().split('T')[0],
    });

    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);

    showToast({
      title: 'Community Username Saved',
      message: `Your active community identity is now ${formatted}!`,
      type: 'success',
    });
  };

  return (
    <Card className="p-6 space-y-6 font-body text-xs text-[#1A1A1A]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7E4DF] pb-4">
        <div>
          <h3 className="font-heading text-lg font-black text-[#1A1A1A] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2A5C8A]" />
            Community Username
          </h3>
          <p className="font-body text-xs text-[#666666] mt-0.5">
            Intelligent username generator constructed from curated word libraries.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3FA] border border-[#2A5C8A]/20 text-[#2A5C8A] font-bold text-[11px]">
          <Shield className="w-3.5 h-3.5" />
          <span>Anonymous Identity</span>
        </div>
      </div>

      {/* Main Display Box & Actions */}
      <div className="space-y-3">
        <label className="font-heading text-xs font-extrabold text-[#1A1A1A] uppercase tracking-wider block">
          Community Username
        </label>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Active Field Display */}
          <div className="flex-1 relative flex items-center bg-[#FAF8F2] rounded-2xl border-2 border-[#2A5C8A]/30 p-2.5 px-4 shadow-inner">
            <span className="font-mono text-base font-extrabold text-[#1A1A1A] tracking-wide flex-1">
              {selectedUsername}
            </span>

            {/* Uniqueness Status Indicator */}
            <div className="ml-2 shrink-0">
              {autoRegenerating ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF9E7] border border-[#D97706]/30 text-[#D97706] font-bold text-[10px] animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating another available username...
                </span>
              ) : isChecking ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F2] border border-[#E7E4DF] text-[#666666] font-bold text-[10px]">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Checking...
                </span>
              ) : isAvailable ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#059669]/30 text-[#059669] font-extrabold text-[10px] shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping" />
                  🟢 Available
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDF2F2] border border-[#D9534F]/30 text-[#D9534F] font-bold text-[10px]">
                  🔴 Already Taken
                </span>
              )}
            </div>
          </div>

          {/* Buttons: 🎲 Generate, 🔄 Refresh Suggestions, ✓ Save Username */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 🎲 Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              className="px-3.5 py-3 rounded-2xl bg-[#2A5C8A] text-white font-extrabold text-xs hover:bg-[#1A1A1A] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Dices className={`w-4 h-4 transition-transform duration-500 ${isRolling ? 'rotate-180 scale-125' : ''}`} />
              <span>🎲 Generate</span>
            </button>

            {/* 🔄 Refresh Suggestions Button */}
            <button
              type="button"
              onClick={handleRefreshSuggestions}
              className="px-3.5 py-3 rounded-2xl border border-[#E7E4DF] bg-white text-[#1A1A1A] font-extrabold text-xs hover:bg-[#FAF8F2] hover:border-[#2A5C8A] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              title="Refresh Suggestions"
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#2A5C8A] transition-transform duration-500 ${isRefreshing ? 'rotate-180' : ''}`} />
              <span>🔄 Refresh Suggestions</span>
            </button>

            {/* ✓ Save Username Button */}
            <button
              type="button"
              onClick={handleSaveUsername}
              disabled={!isAvailable || autoRegenerating}
              className={`px-4 py-3 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                justSaved
                  ? 'bg-[#059669] text-white scale-105'
                  : isAvailable
                  ? 'bg-[#996E7D] text-white hover:bg-[#1A1A1A]'
                  : 'bg-[#E7E4DF] text-[#8E8E93] cursor-not-allowed'
              }`}
            >
              {justSaved ? <CheckCircle2 className="w-4 h-4 animate-bounce" /> : <UserCheck className="w-4 h-4" />}
              <span>{justSaved ? 'Saved!' : '✓ Save Username'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Usernames Section */}
      <div className="space-y-2.5 pt-2 border-t border-[#E7E4DF]">
        <div className="flex items-center justify-between">
          <span className="font-heading text-xs font-extrabold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkle className="w-3.5 h-3.5 text-[#2A5C8A]" />
            Suggested Usernames
          </span>
          <span className="text-[10px] text-[#8E8E93] italic">
            Select a chip to apply
          </span>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2.5">
          {suggestions.map((sug, idx) => {
            const isSelected = selectedUsername === sug;
            return (
              <button
                key={`${sug}-${idx}`}
                type="button"
                onClick={() => handleSelectChip(sug)}
                className={`px-3.5 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 animate-fadeIn border shadow-2xs ${
                  isSelected
                    ? 'bg-[#2A5C8A] text-white border-[#2A5C8A] shadow-md ring-2 ring-[#2A5C8A]/30 scale-105'
                    : 'bg-[#FAF8F2] text-[#1A1A1A] border-[#E7E4DF] hover:bg-[#EBF3FA] hover:border-[#2A5C8A]/40'
                }`}
              >
                <span>{sug}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-white animate-scaleIn stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview Card */}
      <div className="pt-2">
        <label className="font-heading text-xs font-extrabold text-[#1A1A1A] uppercase tracking-wider block mb-2">
          Community Preview
        </label>

        <div className="p-4 bg-gradient-to-r from-[#1A1A1A] to-[#2D2D2D] text-white rounded-2xl shadow-md border border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#2A5C8A] text-white font-extrabold text-sm flex items-center justify-center border border-white/20 shadow-inner">
              <User className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#996E7D] uppercase tracking-widest block">
                  👤 Community Preview
                </span>
              </div>
              <span className="font-mono text-base font-extrabold text-white tracking-wide block mt-0.5">
                @{selectedUsername}
              </span>
              <span className="text-[11px] text-gray-300 font-medium">
                Anonymous Resident
              </span>
            </div>
          </div>

          <div className="hidden sm:block text-right border-l border-white/10 pl-4">
            <span className="text-[10px] text-gray-400 block">Hostel Scope</span>
            <span className="font-bold text-xs text-white">Vaigai Campus</span>
          </div>
        </div>
      </div>

      {/* Cooldown Information */}
      <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-body text-[#666666]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2A5C8A] shrink-0" />
          <span>Users may change their Community Username only once every 30 days.</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0 self-end sm:self-auto">
          <span>Last Changed: <strong className="text-[#1A1A1A]">15 Days Ago</strong></span>
          <span className="text-[#8E8E93]">•</span>
          <span>Remaining Cooldown: <strong className="text-[#2A5C8A]">15 Days</strong></span>
        </div>
      </div>
    </Card>
  );
};

export default CommunitySettings;
