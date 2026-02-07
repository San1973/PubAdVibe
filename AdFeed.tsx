
import React from 'react';
import { AdItem, SecurityStatus } from '../types';
import { Clock, History } from 'lucide-react';

interface AdFeedProps {
  ads: AdItem[];
  onSelectAd?: (ad: AdItem) => void;
  activeId?: string | null;
}

const AdFeed: React.FC<AdFeedProps> = ({ ads, onSelectAd, activeId }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl">
      <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">History Feed</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_#ec4899]" />
          <span className="text-[9px] font-mono text-pink-500 font-bold tracking-widest uppercase">Vault_Storage</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {ads.map((ad) => (
          <button
            key={ad.id}
            onClick={() => onSelectAd?.(ad)}
            className={`w-full text-left p-4 rounded-2xl flex items-center justify-between group transition-all border ${
              activeId === ad.id 
                ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex flex-col min-w-0 pr-4">
              <span className="text-sm font-bold truncate text-slate-200">{ad.name}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-3 h-3 text-slate-600" />
                <span className="text-[9px] text-slate-600 font-mono uppercase tracking-tighter">{ad.timestamp}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
               {ad.status === 'SCANNING' ? (
                <div className="flex flex-col items-end gap-2">
                  <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-blue-500 animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-[8px] font-black font-mono text-blue-400 tracking-widest uppercase">Audit...</span>
                </div>
              ) : (
                <div className="flex flex-col items-end">
                   <span 
                    className="text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest"
                    style={{ 
                      borderColor: ad.status === 'SAFE' ? '#10b981' : '#ec4899',
                      color: ad.status === 'SAFE' ? '#10b981' : '#ec4899',
                      backgroundColor: `${ad.status === 'SAFE' ? '#10b981' : '#ec4899'}10`
                    }}
                   >
                    {ad.status}
                  </span>
                  <span className="text-[8px] font-mono mt-1 text-slate-500 font-bold uppercase tracking-tighter">VIBE: {ad.score}%</span>
                </div>
              )}
            </div>
          </button>
        ))}
        {ads.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 grayscale">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-black uppercase tracking-[0.4em]">Vault is empty</span>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest text-center">
          Records persistent until session termination
        </p>
      </div>
    </div>
  );
};

export default AdFeed;
