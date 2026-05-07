import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Terminal, 
  Layers, 
  Cpu, 
  Globe, 
  Zap, 
  Code2, 
  ChevronRight, 
  Scale, 
  X,
  Plus,
  Monitor
} from 'lucide-react';
import { LANGUAGES } from './constants';
import { Language, ComparisonState } from './types';
import GeminiAdvisor from './components/GeminiAdvisor';

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language | null>(LANGUAGES[0]);
  const [filter, setFilter] = useState<string>('All');
  const [compare, setCompare] = useState<ComparisonState>({ isComparing: false, selectedIds: [] });

  const filteredLanguages = useMemo(() => {
    return LANGUAGES.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || l.category.includes(filter as any);
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const toggleCompare = (id: string) => {
    setCompare(prev => {
      if (prev.selectedIds.includes(id)) {
        return { ...prev, selectedIds: prev.selectedIds.filter(x => x !== id) };
      }
      if (prev.selectedIds.length < 3) {
        return { ...prev, selectedIds: [...prev.selectedIds, id] };
      }
      return prev;
    });
  };

  const selectedForComparison = LANGUAGES.filter(l => compare.selectedIds.includes(l.id));

  return (
    <div className="flex h-screen w-full bg-brand-bg overflow-hidden text-brand-accent selection:bg-brand-accent selection:text-brand-bg">
      {/* Left Sidebar: Navigation & List */}
      <aside className="w-80 flex flex-col border-r border-brand-border bg-brand-bg/50 backdrop-blur-md z-10">
        <header className="p-6 border-bottom border-brand-border h-[100px] flex flex-col justify-end">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-1.5 bg-brand-accent text-brand-bg rounded">
              <Terminal className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">DEVLANG</h1>
          </div>
          <p className="mono-label">Version 1.0.4 // Alpha</p>
        </header>

        <nav className="px-6 py-4 border-y border-brand-border bg-brand-bg/80">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dim group-focus-within:text-brand-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-card/50 border border-brand-border rounded-md px-10 py-2 text-sm focus:outline-none focus:border-brand-accent/50 transition-all placeholder:text-brand-dim"
            />
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {['All', 'Systems', 'Web', 'Data Science', 'AI'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full border transition-all whitespace-nowrap ${
                  filter === cat 
                    ? 'bg-brand-accent text-brand-bg border-brand-accent' 
                    : 'border-brand-border text-brand-dim hover:border-brand-dim'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>

        <section className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredLanguages.map((lang, idx) => (
            <motion.button
              key={lang.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedLang(lang)}
              className={`w-full text-left p-6 border-b border-brand-border flex items-center justify-between group transition-all ${
                selectedLang?.id === lang.id ? 'bg-brand-card border-r-2 border-r-brand-accent' : 'hover:bg-brand-card/30'
              }`}
            >
              <div>
                <h3 className="font-medium text-sm mb-1">{lang.name}</h3>
                <div className="flex gap-2">
                  {lang.category.slice(0, 2).map(c => (
                    <span key={c} className="mono-label opacity-70">{c}</span>
                  ))}
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-brand-dim transition-transform ${selectedLang?.id === lang.id ? 'translate-x-1 text-brand-accent' : 'group-hover:translate-x-1'}`} />
            </motion.button>
          ))}
        </section>

        <footer className="p-6 border-t border-brand-border bg-brand-card/50">
          <button 
            onClick={() => setCompare(p => ({ ...p, isComparing: !p.isComparing }))}
            className={`w-full py-3 px-4 border rounded-md flex items-center justify-center gap-3 transition-all ${
              compare.isComparing ? 'bg-brand-accent text-brand-bg border-brand-accent' : 'border-brand-border hover:border-brand-accent/50'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span className="text-xs uppercase font-semibold tracking-widest">Compare Mode</span>
          </button>
        </footer>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto bg-brand-bg/50">
        <AnimatePresence mode="wait">
          {compare.isComparing ? (
            <motion.div 
              key="compare"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 h-full"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">Matrix Comparison</h2>
                  <p className="mono-label">Compare up to 3 technologies side-by-side</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100%-100px)]">
                {[0, 1, 2].map(idx => {
                  const lang = selectedForComparison[idx];
                  return (
                    <div key={idx} className={`glass-card rounded-xl p-6 flex flex-col ${!lang ? 'border-dashed border-brand-dim/30' : ''}`}>
                      {lang ? (
                        <>
                          <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold uppercase tracking-wider">{lang.name}</h3>
                            <button 
                              onClick={() => toggleCompare(lang.id)}
                              className="p-1 hover:bg-brand-dim/20 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <ComparisonItem label="Paradigms" value={lang.paradigms.join(', ')} />
                            <ComparisonItem label="Creator" value={lang.creator || 'Open Source'} />
                            <div className="space-y-2">
                              <p className="mono-label">Performance Core</p>
                              <RatingBar value={lang.rating.performance} />
                            </div>
                            <div className="space-y-2">
                              <p className="mono-label">Ecosystem Strength</p>
                              <RatingBar value={lang.rating.ecosystem} />
                            </div>
                            <div className="space-y-2">
                              <p className="mono-label">Code Blueprint</p>
                              <pre className="bg-brand-bg p-3 rounded text-[10px] font-mono overflow-x-auto text-brand-dim border border-brand-border">
                                {lang.helloWorld}
                              </pre>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-brand-dim/50 space-y-4">
                          <Plus className="w-10 h-10 animate-pulse" />
                          <p className="text-xs uppercase tracking-widest font-mono">Select from list to add</p>
                          <div className="flex flex-wrap gap-2 justify-center px-4">
                            {LANGUAGES.filter(l => !compare.selectedIds.includes(l.id)).slice(0, 5).map(l => (
                              <button 
                                key={l.id}
                                onClick={() => toggleCompare(l.id)}
                                className="px-2 py-1 border border-brand-border rounded text-[9px] hover:border-brand-accent transition-colors"
                              >
                                {l.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 h-full"
            >
              {/* Center Page: Detail */}
              <div className="lg:col-span-8 p-12 overflow-y-auto border-r border-brand-border custom-scrollbar">
                {selectedLang ? (
                  <motion.div
                    key={selectedLang.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded-full">
                        <span className="mono-label !text-brand-accent">EST. {selectedLang.year}</span>
                      </div>
                      <div className="px-3 py-1 bg-brand-card border border-brand-border rounded-full">
                         <span className="mono-label">{selectedLang.creator}</span>
                      </div>
                    </div>
                    
                    <h1 className="text-6xl font-black mb-8 italic tracking-tighter uppercase">{selectedLang.name}</h1>
                    
                    <p className="text-lg text-brand-dim mb-12 leading-relaxed">
                      {selectedLang.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Zap className="w-4 h-4 text-amber-400" />
                          <h3 className="mono-label !text-brand-accent">Core Strengths</h3>
                        </div>
                        <ul className="space-y-3">
                          {selectedLang.strength.map(s => (
                            <li key={s} className="flex items-center gap-3 text-sm text-brand-dim">
                              <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Layers className="w-4 h-4 text-brand-dim" />
                          <h3 className="mono-label">Key Paradigms</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedLang.paradigms.map(p => (
                            <span key={p} className="px-2 py-1 bg-brand-card border border-brand-border rounded text-[10px] font-mono text-brand-dim uppercase">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="glass-card rounded-xl overflow-hidden mb-12">
                      <div className="bg-brand-border/40 px-4 py-2 border-b border-brand-border flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <Code2 className="w-3.5 h-3.5" />
                           <span className="mono-label">Main Entry Point // Syntax View</span>
                         </div>
                         <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/30" />
                            <div className="w-2 h-2 rounded-full bg-amber-500/30" />
                            <div className="w-2 h-2 rounded-full bg-green-500/30" />
                         </div>
                      </div>
                      <div className="p-6 overflow-x-auto bg-brand-card/30">
                        <pre className="font-mono text-sm leading-relaxed text-brand-accent/80">
                          {selectedLang.helloWorld}
                        </pre>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                       <Metric label="Learning Flow" value={selectedLang.rating.learningCurve} inverted />
                       <Metric label="Architecture" value={selectedLang.rating.performance} />
                       <Metric label="Ecosystem" value={selectedLang.rating.ecosystem} />
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-brand-dim opacity-30">
                    <Monitor className="w-16 h-16 mb-4" />
                    <p className="uppercase tracking-[0.3em] font-mono text-sm">Waiting for input...</p>
                  </div>
                )}
              </div>

              {/* Right Page: AI Sidebar */}
              <div className="lg:col-span-4 p-8 bg-brand-card/20 h-full overflow-hidden">
                <GeminiAdvisor />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Metric({ label, value, inverted = false }: { label: string, value: number, inverted?: boolean }) {
  const scoreLabel = inverted ? ['Master', 'Advanced', 'Moderate', 'Easer', 'Simple'][value - 1] : ['Alpha', 'Beta', 'Stable', 'Strong', 'Supreme'][value - 1];
  
  return (
    <div className="space-y-3">
      <p className="mono-label">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= value ? 'bg-brand-accent' : 'bg-brand-border'}`} />
        ))}
      </div>
      <p className="text-[10px] text-brand-dim uppercase tracking-widest">{scoreLabel}</p>
    </div>
  );
}

function RatingBar({ value }: { value: number }) {
  return (
    <div className="flex items-end gap-1 h-8">
      {[1, 2, 3, 4, 5].map(i => (
        <div 
          key={i} 
          className={`flex-1 rounded-sm transition-all duration-500 scale-y-100 origin-bottom ${
            i <= value ? 'bg-brand-accent' : 'bg-brand-border/30'
          }`} 
          style={{ height: `${(i/5) * 100}%`, opacity: i <= value ? 1 : 0.3 }} 
        />
      ))}
    </div>
  );
}

function ComparisonItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="mono-label">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

