import React from 'react';
import { Loader2, Landmark, Globe, Search, ScrollText } from 'lucide-react';

const LoadingScreen: React.FC<{ topic: string }> = ({ topic }) => {
  const isDegree = topic.toLowerCase().includes('path') || topic.toLowerCase().includes('degree') || topic.length > 20;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 bg-[#FDFBF7]">
      <div className="relative mb-12">
        {/* Animated Rings */}
        <div className="absolute inset-0 border-4 border-amber-100 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 border-4 border-emerald-100 rounded-full animate-pulse delay-75"></div>
        
        <div className="relative bg-[#022c22] p-10 rounded-full shadow-2xl border-4 border-amber-600">
            <Landmark className="w-16 h-16 text-amber-50" />
        </div>
      </div>
      
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-serif font-bold text-[#022c22] mb-3 tracking-tight">
            Office of the Registrar
        </h2>
        <div className="h-1 w-16 bg-amber-600 mx-auto mb-6"></div>
        
        <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-800 to-emerald-400 animate-pulse"></div>
             
             <h3 className="text-lg font-serif italic text-stone-600 mb-6">
                "{isDegree ? `Drafting Curriculum: ${topic}` : `Compiling Lab Manual: ${topic}`}"
            </h3>

            <div className="space-y-4 text-left">
                <div className="flex items-center gap-4 text-sm text-stone-800">
                    <Globe size={16} className="text-blue-600 animate-pulse" />
                    <span className="font-bold uppercase tracking-widest text-xs text-emerald-800">Scraping LinkedIn Job Descriptions</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-stone-800 opacity-90">
                    <ScrollText size={16} className="text-purple-600 animate-bounce" />
                    <span className="font-bold uppercase tracking-widest text-xs text-emerald-800">Parsing Seminal Research Papers</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-stone-800 opacity-80">
                    <Search size={16} className="text-amber-600 animate-pulse" />
                    <span className="font-bold uppercase tracking-widest text-xs text-emerald-800">Analyzing FAANG Engineering Blogs</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-stone-800 opacity-60">
                    <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-bold uppercase tracking-widest text-xs text-emerald-800">{isDegree ? "Aligning with Career Tracks" : "Curating Direct Download Links"}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Validating against 2025 Hiring Criteria</span>
      </div>
    </div>
  );
};

export default LoadingScreen;