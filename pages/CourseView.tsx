import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import MarkdownView from '../components/MarkdownView';
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, Menu, X, Trophy, FlaskConical, BookOpen, TrendingUp } from 'lucide-react';

interface CourseViewProps {
  course: Course;
  onBack: () => void;
  onProgressUpdate?: (completedCount: number, totalModules: number) => void;
}

const CourseView: React.FC<CourseViewProps> = ({ course, onBack, onProgressUpdate }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>(course.modules[0]?.id || '');
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`progress_${course.id}`);
    if (saved) {
      setCompletedModules(new Set(JSON.parse(saved)));
    }
  }, [course.id]);

  const toggleComplete = (moduleId: string) => {
    const next = new Set(completedModules);
    if (next.has(moduleId)) {
      next.delete(moduleId);
    } else {
      next.add(moduleId);
    }
    setCompletedModules(next);
    localStorage.setItem(`progress_${course.id}`, JSON.stringify(Array.from(next)));
    
    if (onProgressUpdate) {
        onProgressUpdate(next.size, course.modules.length);
    }

    if (next.size === course.modules.length && course.modules.length > 0) {
        setShowCompletionModal(true);
    }
  };

  const activeModule = course.modules.find(m => m.id === activeModuleId) || course.modules[0];
  const progressPercent = course.modules.length === 0 ? 0 : Math.round((completedModules.size / course.modules.length) * 100);

  return (
    <div className="flex h-screen bg-[#FDFBF7] overflow-hidden relative">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#022c22]/80 backdrop-blur-sm animate-in fade-in">
              <div className="bg-[#FDFBF7] rounded-sm p-10 max-w-sm text-center shadow-2xl border-4 border-amber-600">
                  <div className="w-20 h-20 bg-[#022c22] text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Trophy size={40} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-[#022c22] mb-4">Course Completed</h2>
                  <p className="text-stone-600 mb-8 font-serif italic text-lg">"Outstanding performance. You have mastered the curriculum requirements for {course.topic}."</p>
                  <button 
                    onClick={() => setShowCompletionModal(false)}
                    className="bg-[#022c22] text-white px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-emerald-900 transition-colors"
                  >
                      Return to Campus
                  </button>
              </div>
          </div>
      )}

      {/* Dark Sidebar - "The Library Stack" look */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-[#022c22] text-stone-300 flex flex-col transition-transform duration-300 ease-in-out border-r border-emerald-900
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-emerald-900/50 flex items-center justify-between bg-[#012019]">
            <button onClick={onBack} className="text-stone-400 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors">
                <ArrowLeft size={14} />
                Roadmap
            </button>
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} className="text-stone-400" />
            </button>
        </div>
        
        <div className="p-8 border-b border-emerald-900/50">
            <div className="mb-4">
                 <span className={`text-[10px] px-2 py-1 font-bold uppercase tracking-widest text-[#022c22] bg-amber-500`}>
                    {course.level || 'Core'}
                </span>
            </div>
            <h1 className="font-serif font-bold text-white text-xl leading-tight mb-6">{course.topic}</h1>
            
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">
                <span>Completion Status</span>
                <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-emerald-950 h-1.5 overflow-hidden">
                <div 
                    className="bg-amber-600 h-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {course.modules.map((module, idx) => {
                const isActive = module.id === activeModuleId;
                const isCompleted = completedModules.has(module.id);
                return (
                    <button
                        key={module.id}
                        onClick={() => {
                            setActiveModuleId(module.id);
                            setIsMobileMenuOpen(false);
                        }}
                        className={`
                            w-full flex items-start text-left p-4 transition-all group relative border-l-2
                            ${isActive 
                                ? 'bg-[#064e3b] border-amber-500 text-white' 
                                : 'bg-transparent border-transparent text-stone-400 hover:bg-[#064e3b]/30 hover:text-stone-200'}
                        `}
                    >
                        <div 
                            role="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleComplete(module.id);
                            }}
                            className={`mr-4 mt-0.5 flex-shrink-0 transition-colors ${isCompleted ? 'text-emerald-400' : 'text-emerald-900 group-hover:text-emerald-700'}`}
                        >
                            {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </div>
                        <div className="flex-1">
                             <span className="text-[9px] font-bold text-emerald-600/70 uppercase tracking-[0.2em] block mb-1">Module {idx + 1}</span>
                             <span className={`font-serif text-sm leading-snug ${isActive ? 'text-amber-50' : 'text-stone-400'}`}>{module.title}</span>
                        </div>
                    </button>
                );
            })}
        </div>
      </aside>

      {/* Main Content - "The Paper" */}
      <main className="flex-1 flex flex-col h-full w-full relative overflow-hidden bg-[#FDFBF7]">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-[#022c22] flex items-center px-4 justify-between flex-shrink-0 text-white">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-stone-300">
                <Menu size={24} />
            </button>
            <span className="font-serif font-bold truncate px-4">Lab Manual</span>
            <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto scroll-smooth">
            <div className="max-w-4xl mx-auto p-8 md:p-16">
                
                {/* Header for Module */}
                <div className="mb-12 border-b-2 border-[#022c22] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="inline-block w-8 h-[1px] bg-amber-600"></span>
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                                Lab Assignment {course.modules.findIndex(m => m.id === activeModuleId) + 1}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#022c22] leading-tight">{activeModule?.title}</h2>
                     </div>
                     
                     <button 
                        onClick={() => toggleComplete(activeModuleId)}
                        className={`
                            flex items-center justify-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all shrink-0 border
                            ${completedModules.has(activeModuleId) 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : 'bg-[#022c22] border-[#022c22] text-white hover:bg-emerald-900 shadow-lg'}
                        `}
                     >
                        {completedModules.has(activeModuleId) ? (
                            <>
                                <CheckCircle2 size={16} />
                                <span>Submitted</span>
                            </>
                        ) : (
                            <>
                                <FlaskConical size={16} />
                                <span>Submit Work</span>
                            </>
                        )}
                     </button>
                </div>

                {/* Market & Academic Analysis Banner (Visible on first module or Introduction) */}
                {activeModuleId.includes('intro') && (
                  <div className="mb-12 bg-white border-l-4 border-blue-600 p-6 shadow-md rounded-r-lg">
                     <div className="flex items-center gap-3 mb-3 text-blue-800">
                        <TrendingUp size={24} />
                        <h3 className="text-lg font-bold uppercase tracking-widest font-sans">Market & Academic Analysis</h3>
                     </div>
                     <p className="text-stone-600 font-serif italic">
                        "This syllabus has been calibrated against real-time job descriptions (LinkedIn/FAANG) and aligned with seminal research papers from top research universities to ensure both practical relevance and theoretical rigor."
                     </p>
                  </div>
                )}

                {/* Content Card */}
                <div className="min-h-[50vh] text-lg">
                    <MarkdownView content={activeModule?.content || "Select a module to begin."} />
                </div>

                {/* Sources Section */}
                {course.sources && course.sources.length > 0 && (
                    <div className="mt-20 pt-10 border-t border-stone-200 bg-stone-50/50 -mx-8 px-8 pb-8">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-[#022c22] uppercase tracking-widest mb-6">
                            <BookOpen size={16} />
                            Industry Tooling & Resources
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.sources.map((source, i) => (
                                <a 
                                    key={i} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-4 p-4 bg-white border border-stone-200 hover:border-amber-500 hover:shadow-md transition-all group"
                                >
                                    <div className="mt-1 text-stone-300 group-hover:text-amber-600">
                                        <ExternalLink size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Resource {i + 1}</div>
                                        <span className="text-base font-serif text-[#022c22] font-medium leading-tight group-hover:underline decoration-amber-500 underline-offset-4">
                                            {source.title || "External Resource"}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default CourseView;