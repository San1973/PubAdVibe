
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Upload, Activity, Lock, Globe, AlertTriangle, CheckCircle2, Cpu, Zap, Database, FlaskConical, MousePointer2, Info, Compass, Waves, X, Clock } from 'lucide-react';
import Gauge from './components/Gauge';
import AdFeed from './components/AdFeed';
import RevenueCounter from './components/RevenueCounter';
import { AdItem, AuditResult, SecurityStatus } from './types';
import { processAdImage } from './services/gemini';
import { BRAND_MANIFESTO } from './constants';

const DEMO_VAULT = [
  {
    id: 'vial-1',
    name: 'Vial A: Harmony',
    url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    type: 'SAFE_HARMONY',
    description: 'Organic Tea / Minimalist'
  },
  {
    id: 'vial-2',
    name: 'Vial B: UI Threat',
    url: 'https://img.freepik.com/premium-vector/system-update-progress-bar-loading-sign_125371-50.jpg',
    type: 'THREAT_DETECTED',
    description: 'Fake System Dialog Scam'
  },
  {
    id: 'vial-3',
    name: 'Vial C: Aesthetic Clash',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    type: 'HARMONY_VIOLATION',
    description: 'Neon Gaming (Safe but Clashes)'
  },
  {
    id: 'vial-4',
    name: 'Vial D: Vibe Violation',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
    type: 'HARMONY_VIOLATION',
    description: 'High-Stress Stock Trading'
  }
];

const PubAdVibeLogo = () => (
  <div className="relative flex items-center justify-center w-12 h-12">
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">
      <defs>
        <linearGradient id="pGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <path 
        d="M10,50 L25,50 L35,20 L45,80 L55,50 L70,50" 
        fill="none" 
        stroke="#22c55e" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="animate-[pulse_2s_infinite]"
      />
      <path 
        d="M50,85 L50,35 C50,20 85,20 85,45 C85,70 50,70 50,70" 
        fill="none" 
        stroke="url(#pGradient)" 
        strokeWidth="10" 
        strokeLinecap="round"
      />
      <circle cx="68" cy="45" r="8" fill="white" className="animate-pulse" />
    </svg>
  </div>
);

const App: React.FC = () => {
  const [ads, setAds] = useState<AdItem[]>([]);
  const [revenue, setRevenue] = useState(1450.25);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [agentScanning, setAgentScanning] = useState(false);
  const [agentProgress, setAgentProgress] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const performAudit = async (base64: string, name: string) => {
    setAnalyzing(true);
    setAuditResult(null);
    setSelectedFile(base64);
    setActiveHistoryId(null);

    const newAdId = Math.random().toString(36).substr(2, 9);
    const newAd: AdItem = {
      id: newAdId,
      name: name,
      status: 'SCANNING',
      score: 0,
      timestamp: new Date().toLocaleTimeString(),
      image: base64,
    };
    setAds(prev => [newAd, ...prev]);

    try {
      const result = await processAdImage(base64);
      setAuditResult(result);
      
      const isBlocked = result.harmonyScore < 65 || result.deceptiveUIScan.status === 'THREAT_DETECTED' || result.rafPolicyViolation.detected;
      
      setAds(prev => prev.map(ad => 
        ad.id === newAdId 
          ? { 
              ...ad, 
              status: isBlocked ? 'BLOCKED' : 'SAFE',
              score: result.harmonyScore,
              result: result
            } 
          : ad
      ));
      setActiveHistoryId(newAdId);

      if (isBlocked) {
        setRevenue(prev => prev + 45.50);
      }
    } catch (error) {
      console.error("Audit failed", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectHistoryItem = (ad: AdItem) => {
    if (ad.status === 'SCANNING') return;
    setSelectedFile(ad.image || null);
    setAuditResult(ad.result || null);
    setActiveHistoryId(ad.id);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      await performAudit(base64, file.name);
    };
    reader.readAsDataURL(file);
  };

  const loadDemoVial = async (url: string, name: string) => {
    try {
      setAnalyzing(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        performAudit(reader.result as string, name);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to load demo vial", error);
      setAnalyzing(false);
    }
  };

  const simulateAdSenseScan = () => {
    setAgentScanning(true);
    setAgentProgress(0);
    setShowReport(false);

    const interval = setInterval(() => {
      setAgentProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setAgentScanning(false);
            setShowReport(true);
          }, 500);
          return 100;
        }
        return p + 4;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-pink-500/30">
      <header className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <PubAdVibeLogo />
            <div>
              <h1 className="text-2xl font-black tracking-tighter flex items-center">
                <span className="text-pink-500">Pub</span>
                <span className="text-blue-400">Ad</span>
                <span className="text-emerald-400">Vibe</span>
              </h1>
              <p className="text-[9px] uppercase tracking-[0.4em] text-slate-500 font-bold -mt-1">Aesthetic Intelligence v3.5</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Domain</span>
              <span className="text-sm font-semibold flex items-center gap-1.5 text-blue-300">
                <Globe className="w-3.5 h-3.5" /> MyMorningYoga.net
              </span>
            </div>
            <RevenueCounter value={revenue} />
            <button 
              onClick={simulateAdSenseScan}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 via-blue-500 to-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              disabled={agentScanning}
            >
              <Zap className="w-4 h-4" />
              Scan Network
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm relative min-h-[500px] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_#ec4899]"></div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {activeHistoryId ? 'Historical Review' : 'Vibe Analysis Chamber'}
                </h2>
              </div>
              <div className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full uppercase border border-slate-700">
                {activeHistoryId ? `ENTRY_ID: ${activeHistoryId.toUpperCase()}` : `LENS_STATUS: ${analyzing ? 'PULSING' : 'IDLE'}`}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8">
              {!selectedFile ? (
                <div className="w-full max-w-3xl flex flex-col gap-10">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-800 rounded-[2.5rem] p-16 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/40 hover:bg-pink-500/5 transition-all group bg-slate-900/20 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-slate-700 relative z-10">
                      <Upload className="w-10 h-10 text-pink-400" />
                    </div>
                    <p className="text-2xl font-black mb-3 relative z-10 tracking-tight">Sync New Ad Creative</p>
                    <p className="text-sm text-slate-500 text-center max-w-sm leading-relaxed relative z-10 font-medium">Verify visual integrity and aesthetic alignment against your brand's unique vibe manifesto.</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Waves className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em]">Evidence Samples</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {DEMO_VAULT.map(vial => (
                        <button 
                          key={vial.id}
                          onClick={() => loadDemoVial(vial.url, vial.name)}
                          disabled={analyzing}
                          className="group relative p-5 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left overflow-hidden disabled:opacity-50"
                        >
                          <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 group-hover:text-blue-400 transition-all translate-y-2 group-hover:translate-y-0">
                            <Zap className="w-4 h-4 fill-current" />
                          </div>
                          <span className="text-[9px] font-black text-blue-400 mb-2 block tracking-widest uppercase">{vial.type.replace('_', ' ')}</span>
                          <p className="text-xs font-bold text-slate-200 mb-1 leading-tight">{vial.name}</p>
                          <p className="text-[9px] text-slate-500 uppercase tracking-tighter line-clamp-1">{vial.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col lg:flex-row gap-10 items-start">
                  <div className="flex-1 space-y-6 w-full">
                    <div className="relative group overflow-hidden rounded-[2rem] border border-slate-700 bg-black aspect-video flex items-center justify-center shadow-2xl">
                      <img src={selectedFile} alt="Ad content" className="max-h-full object-contain" />
                      {analyzing && (
                        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
                          <div className="relative mb-8">
                             <PubAdVibeLogo />
                             <div className="absolute inset-0 bg-pink-400/20 blur-2xl animate-pulse"></div>
                          </div>
                          <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 font-black text-lg animate-pulse tracking-widest mb-2 uppercase">Vibe Mapping...</p>
                          <p className="text-[10px] text-slate-500 max-w-xs uppercase tracking-[0.4em] font-mono">Neural_Engine_Inference // Gem-3-Pro</p>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => { setSelectedFile(null); setAuditResult(null); setActiveHistoryId(null); }}
                      className="text-[10px] text-slate-500 hover:text-pink-400 transition-colors uppercase font-black tracking-[0.4em] flex items-center gap-3 group px-4 py-2 rounded-full border border-slate-800 hover:border-pink-500/30"
                    >
                      <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-pink-500 transition-colors text-white">
                        <X className="w-3 h-3" />
                      </div>
                      {activeHistoryId ? 'Back to Laboratory' : 'Clear Analysis'}
                    </button>
                  </div>

                  {auditResult && (
                    <div className="w-full lg:w-96 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                      <div className="bg-slate-800/20 border border-slate-700 rounded-3xl p-8 flex flex-col items-center shadow-inner relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/10 blur-3xl"></div>
                        <Gauge score={auditResult.harmonyScore} label="Aesthetic Purity" />
                        <div className="mt-6 p-4 bg-slate-900/80 rounded-2xl border border-slate-800 w-full relative z-10 shadow-lg">
                           <p className="text-[10px] text-pink-500 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                             <Activity className="w-3 h-3" /> AI Contextual Output
                           </p>
                           <p className="text-xs text-slate-300 italic leading-relaxed font-medium">"{auditResult.summary}"</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className={`p-5 rounded-2xl border flex gap-4 transition-all duration-500 ${auditResult.deceptiveUIScan.status === 'CLEAN' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/10 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]'}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${auditResult.deceptiveUIScan.status === 'CLEAN' ? 'bg-emerald-500/20' : 'bg-red-500/20 shadow-lg'}`}>
                            {auditResult.deceptiveUIScan.status === 'CLEAN' ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <AlertTriangle className="w-6 h-6 text-red-500" />}
                          </div>
                          <div>
                            <span className="text-xs font-black uppercase tracking-widest block mb-1">Deceptive Scan</span>
                            <div className="text-[11px] text-slate-400 leading-relaxed font-medium">
                              {auditResult.deceptiveUIScan.status === 'CLEAN' ? 'Visual integrity confirmed. No UI traps found.' : (
                                <ul className="list-disc list-inside">
                                  {auditResult.deceptiveUIScan.findings.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={`p-5 rounded-2xl border flex gap-4 transition-all duration-500 ${!auditResult.rafPolicyViolation.detected ? 'bg-blue-500/5 border-blue-500/20' : 'bg-pink-500/10 border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.15)]'}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!auditResult.rafPolicyViolation.detected ? 'bg-blue-500/20' : 'bg-pink-500/20'}`}>
                            <Lock className={`w-6 h-6 ${!auditResult.rafPolicyViolation.detected ? 'text-blue-400' : 'text-pink-500'}`} />
                          </div>
                          <div>
                            <span className="text-xs font-black uppercase tracking-widest block mb-1">Policy Guard</span>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                              {auditResult.rafPolicyViolation.detected ? auditResult.rafPolicyViolation.details : 'Compliance verified for 2026 Internet Safety Standards.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-800 bg-slate-900/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)] animate-pulse"></div>
                    <span className="text-[10px] font-mono text-emerald-500 uppercase font-black tracking-[0.2em]">PubAdVibe_Active</span>
                  </div>
                  <div className="h-4 w-px bg-slate-700"></div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest">
                    <span className="text-blue-400">VIBE_CORE:</span> <span className="text-slate-200">ZEN_MINIMALISM_v2.0</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-600 uppercase font-black tracking-widest">
                   <Shield className="w-3.5 h-3.5 text-pink-500" /> End-to-End Brand Protection
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500/5 via-blue-500/5 to-emerald-500/5 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:bg-slate-800/50 transition-all duration-500">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none rotate-12">
              <Waves className="w-64 h-64" />
            </div>
            <h3 className="text-sm font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-emerald-400 tracking-[0.3em] mb-6 flex items-center gap-3">
              <Database className="w-4 h-4 text-slate-400" /> Current Domain Manifesto: MyMorningYoga.net
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              {BRAND_MANIFESTO.split('-').slice(1).map((item, i) => (
                <div key={i} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col hover:border-pink-500/30 transition-all hover:translate-y-[-2px] duration-300">
                  <span className="text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">Rule {i+1}</span>
                  <span className="text-[11px] font-semibold text-slate-300 leading-tight">{item.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full">
          <div className="flex-1 min-h-[400px]">
            <AdFeed 
              ads={ads} 
              onSelectAd={handleSelectHistoryItem}
              activeId={activeHistoryId}
            />
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl"></div>
             <div className="flex items-center justify-between relative z-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">System Telemetry</h3>
                <span className="text-[9px] font-mono text-pink-500 font-bold bg-pink-500/10 px-2 py-0.5 rounded">REALTIME</span>
             </div>
             <div className="space-y-3 font-mono text-[11px] max-h-[150px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                <div className="flex gap-3 text-emerald-400/80">
                  <span className="opacity-40">[09:00:01]</span>
                  <span>PubAdVibe Vibe_Core initialized. Vision-P-L1 ready.</span>
                </div>
                <div className="flex gap-3 text-slate-500">
                  <span className="opacity-40">[09:05:22]</span>
                  <span>Neural sync established with AdSense global CDN.</span>
                </div>
                {analyzing && (
                  <div className="flex gap-3 text-blue-400 animate-pulse">
                    <span className="opacity-40">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span>Deconstructing pixel density map...</span>
                  </div>
                )}
                {auditResult && (
                   <div className="flex gap-3 text-white border-l-2 border-pink-500 pl-2">
                      <span className="opacity-40">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                      <span className="font-bold">Audit Complete: {auditResult.harmonyScore}% Purity match.</span>
                   </div>
                )}
             </div>
          </div>
        </div>
      </main>

      {agentScanning && (
        <div className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
          <div className="relative mb-16 scale-150">
            <PubAdVibeLogo />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              Agent_Active
            </div>
          </div>
          <h2 className="text-5xl font-black mb-4 tracking-tighter italic">
            <span className="text-pink-500">PULSE</span>_GATEWAY_SCAN
          </h2>
          <p className="text-slate-500 font-mono uppercase tracking-[0.4em] mb-12 text-sm font-bold">Purging Visual Noise // Syncing Network Purity</p>
          <div className="w-full max-w-2xl space-y-6">
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div className="h-full bg-gradient-to-r from-pink-500 via-blue-500 to-emerald-500 transition-all duration-100 ease-out shadow-[0_0_30px_rgba(59,130,246,0.4)] rounded-full" style={{ width: `${agentProgress}%` }}></div>
            </div>
            <div className="flex justify-between font-mono text-[12px] text-slate-400 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-pink-500 animate-pulse" />
                Processing_Segment: 0x{Math.floor(agentProgress).toString(16).toUpperCase()}
              </span>
              <span className="text-white">{Math.floor(agentProgress * 5)} / 500 CREATIVES_AUDITED</span>
            </div>
          </div>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-500">
            <div className="bg-gradient-to-br from-pink-600 via-blue-600 to-emerald-600 p-12 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-20 pointer-events-none rotate-45 scale-150">
                 <Shield className="w-64 h-64 text-white" />
              </div>
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/30">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white tracking-tighter">Purity Report Ready</h3>
                  <p className="text-white/80 font-mono text-xs uppercase tracking-[0.4em] font-bold mt-2">Autonomous Network Remediation Complete</p>
                </div>
              </div>
              <button onClick={() => setShowReport(false)} className="relative z-10 text-white/60 hover:text-white transition-colors bg-white/10 p-4 rounded-full hover:bg-white/20">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-12 space-y-12">
              <div className="grid grid-cols-3 gap-8">
                <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:bg-slate-800/60 transition-all hover:scale-[1.02]">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Inventory Swept</p>
                  <p className="text-4xl font-black font-mono tracking-tighter">500</p>
                </div>
                <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:bg-slate-800/60 transition-all hover:scale-[1.02]">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Toxins Purged</p>
                  <p className="text-4xl font-black font-mono tracking-tighter text-pink-500">42</p>
                </div>
                <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:bg-slate-800/60 transition-all hover:scale-[1.02]">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Vibe Score</p>
                  <p className="text-4xl font-black font-mono tracking-tighter text-emerald-400">91.6%</p>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                   <Zap className="w-4 h-4 text-amber-500" /> Automated Purity Actions
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-5 p-5 bg-pink-500/5 border border-pink-500/10 rounded-2xl group hover:border-pink-500/30 transition-all">
                    <div className="w-3 h-3 rounded-full bg-pink-500 group-hover:scale-150 shadow-[0_0_10px_#ec4899] transition-transform"></div>
                    <span className="text-sm font-bold text-slate-200">Purged 12 High-Risk Deepfake Endorsements</span>
                  </div>
                  <div className="flex items-center gap-5 p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl group hover:border-emerald-500/30 transition-all">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 group-hover:scale-150 shadow-[0_0_10px_#10b981] transition-transform"></div>
                    <span className="text-sm font-bold text-slate-200">Blocked 30 aesthetic violations (Harmony mismatch)</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowReport(false)}
                className="w-full py-6 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:brightness-110 transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98]"
              >
                Sync Gateway to AdSense Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
