import React, { useState } from 'react';
import { Map, BookOpen, MessageSquare, Award, GraduationCap, ArrowRight, Briefcase, Sparkles, ScrollText, Landmark, Library, ChevronRight } from 'lucide-react';
import { Course, LearningPath, DifficultyLevel } from '../types';

interface HomeProps {
  onSearch: (topic: string, level: DifficultyLevel) => void;
  savedCourses: Course[];
  savedPaths: LearningPath[];
  onOpenCourse: (courseId: string) => void;
  onOpenPath: (pathId: string) => void;
  onOpenForum: () => void;
  onOpenProfile: () => void;
}

const SUGGESTIONS = [
  "Applied Artificial Intelligence",
  "Quantum Computing Engineering",
  "Computational Finance",
  "Biomedical Systems Design",
  "Cybersecurity Architecture",
  "Full-Stack Systems Engineering"
];

const Home: React.FC<HomeProps> = ({ 
  onSearch, savedCourses, savedPaths, onOpenCourse, onOpenPath, onOpenForum, onOpenProfile 
}) => {
  const [input, setInput] = useState('');
  const [level, setLevel] = useState<DifficultyLevel>('Beginner');

  const handleEnroll = () => {
    if (input.trim()) {
      onSearch(input.trim(), level);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEnroll();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Prestige Header Section */}
      <header className="bg-[#022c22] text-[#e7e5e4] pt-8 pb-32 px-4 relative overflow-hidden">
         {/* Decorative Background Pattern */}
         <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent"></div>
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-800 rounded-full blur-3xl opacity-20"></div>

         <div className="max-w-7xl mx-auto relative z-10">
            {/* Top Nav */}
            <div className="flex justify-between items-center mb-16 border-b border-emerald-800/50 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#FDFBF7] rounded-sm flex items-center justify-center text-[#022c22] shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <Landmark size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif tracking-wide text-[#FDFBF7] font-bold leading-none">Institute of <br/><span className="text-amber-500">Applied Technology</span></h1>
                    </div>
                </div>
                <div className="hidden md:flex gap-6">
                    <button onClick={onOpenForum} className="text-emerald-100 hover:text-amber-400 font-sans text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                        <MessageSquare size={14} /> Student Union
                    </button>
                    <button onClick={onOpenProfile} className="text-emerald-100 hover:text-amber-400 font-sans text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                        <ScrollText size={14} /> Transcript
                    </button>
                </div>
            </div>

            {/* Hero Content */}
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-700/50 text-emerald-200 text-xs font-sans font-bold uppercase tracking-widest mb-6">
                    <Sparkles size={12} className="text-amber-500" />
                    <span>Fall 2025 Admissions Open</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-serif font-bold text-[#FDFBF7] mb-8 leading-tight">
                    Your Path to <span className="text-amber-500 italic">Practical</span> Excellence
                </h2>
                <p className="text-xl md:text-2xl text-emerald-200/80 font-serif font-light italic max-w-2xl mx-auto leading-relaxed mb-12">
                    "From Day 1 undergraduate labs to Ph.D. research and industry placement. A complete career trajectory in one curriculum."
                </p>
            </div>
         </div>
      </header>

      {/* Main Interaction Area - Negative Margin to overlap Header */}
      <main className="max-w-6xl mx-auto px-4 -mt-24 relative z-20 pb-20">
        
        {/* Degree Selection Cards */}
        <div className="bg-white p-2 rounded-2xl shadow-xl border border-stone-200 mb-12">
            <div className="bg-[#FDFBF7] border border-dashed border-stone-300 rounded-xl p-8">
                
                <div className="text-center mb-10">
                    <h3 className="text-sm font-sans font-bold text-stone-500 uppercase tracking-widest mb-2">Step 1: Select Entry Point</h3>
                    <div className="w-16 h-0.5 bg-amber-500 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <button 
                        onClick={() => setLevel('Beginner')}
                        className={`group relative p-6 text-left border transition-all duration-300 ${level === 'Beginner' ? 'bg-[#022c22] border-[#022c22] text-white shadow-2xl scale-105 z-10' : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-600 hover:bg-emerald-50'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Start Here</span>
                            {level === 'Beginner' && <div className="text-amber-500"><Award size={20} /></div>}
                        </div>
                        <div className="text-3xl font-serif font-bold mb-2">Bachelor</div>
                        <div className="text-xs opacity-70 font-sans leading-relaxed">Entry level. Starts at foundations and continues through Master's, Ph.D, to Job Placement.</div>
                        <div className={`mt-6 h-1 w-12 ${level === 'Beginner' ? 'bg-amber-500' : 'bg-stone-200 group-hover:bg-emerald-400'}`}></div>
                    </button>

                    <button 
                        onClick={() => setLevel('Intermediate')}
                        className={`group relative p-6 text-left border transition-all duration-300 ${level === 'Intermediate' ? 'bg-[#022c22] border-[#022c22] text-white shadow-2xl scale-105 z-10' : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-600 hover:bg-emerald-50'}`}
                    >
                         <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Accelerated</span>
                            {level === 'Intermediate' && <div className="text-amber-500"><Award size={20} /></div>}
                        </div>
                        <div className="text-3xl font-serif font-bold mb-2">Master</div>
                        <div className="text-xs opacity-70 font-sans leading-relaxed">Skip basics. Focus on Architecture, Research, and Career Readiness.</div>
                        <div className={`mt-6 h-1 w-12 ${level === 'Intermediate' ? 'bg-amber-500' : 'bg-stone-200 group-hover:bg-emerald-400'}`}></div>
                    </button>

                    <button 
                        onClick={() => setLevel('Advanced')}
                        className={`group relative p-6 text-left border transition-all duration-300 ${level === 'Advanced' ? 'bg-[#022c22] border-[#022c22] text-white shadow-2xl scale-105 z-10' : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-600 hover:bg-emerald-50'}`}
                    >
                         <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Expert Track</span>
                            {level === 'Advanced' && <div className="text-amber-500"><Award size={20} /></div>}
                        </div>
                        <div className="text-3xl font-serif font-bold mb-2">Ph.D.</div>
                        <div className="text-xs opacity-70 font-sans leading-relaxed">Focus purely on novel research, internals, and high-level industry placement.</div>
                        <div className={`mt-6 h-1 w-12 ${level === 'Advanced' ? 'bg-amber-500' : 'bg-stone-200 group-hover:bg-emerald-400'}`}></div>
                    </button>
                </div>

                <div className="text-center mb-4">
                    <h3 className="text-sm font-sans font-bold text-stone-500 uppercase tracking-widest mb-6">Step 2: Declare Your Major</h3>
                    <div className="max-w-3xl mx-auto relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. Artificial Intelligence, Mechanical Engineering, History of Art..."
                            className="w-full pl-6 pr-48 py-6 bg-white border-2 border-stone-200 focus:border-[#022c22] focus:ring-1 focus:ring-[#022c22] outline-none text-2xl font-serif text-[#022c22] placeholder:text-stone-300 placeholder:italic shadow-inner"
                        />
                        <button 
                            onClick={handleEnroll}
                            disabled={!input.trim()}
                            className="absolute right-3 top-3 bottom-3 bg-[#022c22] text-white px-8 font-bold hover:bg-emerald-900 transition-colors disabled:opacity-50 flex items-center gap-2 uppercase tracking-widest text-xs shadow-lg"
                        >
                            <span>Enroll</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                 <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
                    {SUGGESTIONS.map((topic) => (
                        <button
                        key={topic}
                        onClick={() => { setInput(topic); }}
                        className="text-[10px] font-bold text-stone-400 hover:text-amber-600 uppercase tracking-widest transition-colors font-sans border-b border-transparent hover:border-amber-600 pb-0.5"
                        >
                        {topic}
                        </button>
                    ))}
                </div>

            </div>
        </div>

        {/* Dashboard / Transcripts */}
        {(savedPaths.length > 0) && (
            <div className="mt-20">
                <div className="flex items-end justify-between mb-8 border-b-2 border-stone-200 pb-4">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-[#022c22]">Academic Records</h2>
                        <p className="text-stone-500 italic mt-1 font-serif">Your active degree programs and progress.</p>
                    </div>
                    <div className="hidden md:block text-stone-400 text-xs font-bold uppercase tracking-widest">
                        Office of the Registrar
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedPaths.map(path => (
                        <div 
                            key={path.id}
                            onClick={() => onOpenPath(path.id)}
                            className="bg-white p-8 border border-stone-200 shadow-sm hover:shadow-xl hover:border-amber-400 cursor-pointer transition-all group relative overflow-hidden flex flex-col h-full"
                        >
                             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-900"></div>
                             
                             <div className="mb-6 pl-4">
                                <span className={`inline-block px-2 py-1 mb-3 text-[10px] font-bold uppercase tracking-widest border ${
                                    path.level === 'Beginner' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                                    path.level === 'Intermediate' ? 'bg-blue-50 text-blue-800 border-blue-100' :
                                    'bg-purple-50 text-purple-800 border-purple-100'
                                }`}>
                                    {path.level === 'Beginner' ? 'B.S. Entry' : path.level === 'Intermediate' ? 'M.S. Entry' : 'Ph.D Entry'}
                                </span>
                                <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-[#b45309] transition-colors leading-tight min-h-[4rem]">
                                    {path.topic}
                                </h3>
                             </div>
                             
                             <div className="mt-auto pl-4 border-t border-stone-100 pt-4">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Progress</span>
                                    <span className="text-xl font-bold font-serif text-[#022c22]">
                                        {Math.round((path.nodes.filter(n => n.status === 'completed').length / path.nodes.length) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-[#022c22] h-full transition-all duration-700" 
                                        style={{ width: `${(path.nodes.filter(n => n.status === 'completed').length / path.nodes.length) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="mt-4 flex items-center justify-end text-[#b45309] text-xs font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                    View Transcript <ChevronRight size={14} />
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#022c22] text-stone-400 py-12 mt-20 border-t-4 border-amber-600">
         <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-6 md:mb-0">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <Landmark size={24} className="text-stone-300" />
                    <span className="font-serif font-bold text-stone-200 text-lg">Institute of Applied Technology</span>
                </div>
                <p className="text-sm font-serif italic text-stone-500">Excellence in Engineering & Applied Sciences.</p>
            </div>
            <div className="text-xs font-sans uppercase tracking-widest opacity-50">
                © 2025 Board of Regents. All Rights Reserved.
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Home;