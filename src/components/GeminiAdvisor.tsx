import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Loader2, BrainCircuit } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function GeminiAdvisor() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are an expert career and software engineering advisor. You help developers find the best programming language for their goals. Be concise, technical, and objective. Use markdown for formatting.",
        }
      });
      setResponse(result.text || 'No response received.');
    } catch (error) {
      console.error(error);
      setResponse('Failed to get a response. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col gap-4 overflow-hidden h-full">
      <div className="flex items-center gap-2 mb-2">
        <BrainCircuit className="w-5 h-5 text-brand-accent" />
        <h2 className="text-sm font-semibold uppercase tracking-widest">AI Career Advisor</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {response ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-brand-accent/90"
          >
            {response}
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-brand-dim text-center px-4">
            <Sparkles className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-xs italic">"Which language should I learn if I want to build a high-performance trading platform?"</p>
          </div>
        )}
      </div>

      <div className="relative mt-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Ask about career paths or tech stacks..."
          className="w-full bg-brand-bg/50 border border-brand-border rounded-lg py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-brand-accent/30 transition-colors"
        />
        <button
          onClick={handleAsk}
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-brand-accent hover:text-brand-bg rounded-md transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
