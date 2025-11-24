import React from 'react';
import { LearningPath, PathNode } from '../types';
import { CheckCircle2, Lock, Printer, Shield, BookOpen, Briefcase, GraduationCap, Award } from 'lucide-react';

interface RoadmapViewProps {
  path: LearningPath;
  onNodeClick: (node: PathNode) => void;
  onBack: () => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ path, onNodeClick, onBack }) => {
  const studentId = `SID-${path.createdAt.toString().slice(-6)}`;
  const currentYear = new Date().getFullYear();

  const getDegreeLabel = (level: string) => {
      switch(level) {
          case 'Beginner': return 'Comprehensive Academic Track';
          case 'Intermediate': return 'Accelerated Graduate Track';
          case 'Advanced': return 'Doctoral Research Track';
          default: return 'Certificate Program';
      }
  };

  // Helper to categorize nodes for visual grouping
  const getPhase = (title: string) => {
      if (title.startsWith('BS')) return 'Undergraduate Phase';
      if (title.startsWith('MS')) return 'Graduate School Phase';
      if (title.startsWith('PHD')) return 'Doctoral Research Phase';
      if (title.startsWith('JOB') || title.toLowerCase().includes('job') || title.toLowerCase().includes('interview')) return 'Career Placement Phase';
      return 'Core Curriculum';
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation / Toolbar */}
        <div className="flex justify-between items-center mb-8 print:hidden">
            <button onClick={onBack} className="text-stone-500 hover:text-[#022c22] font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                ← Return to Registrar
            </button>
            <button onClick={() => window.print()} className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-md flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors">
                <Printer size={16} /> Print Transcript
            </button>
        </div>
        
        {/* The Transcript "Paper" */}
        <div className="bg-[#fffefb] p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-stone-200 relative overflow-hidden min-h-[1000px]">
            
            {/* Top Border Decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#022c22]"></div>
            <div className="absolute top-2 left-0 w-full h-1 bg-amber-600"></div>

            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none text-[#022c22]">
                <Shield size={700} strokeWidth={0.5} />
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-[#022c22] pb-10 mb-10 relative">
                <div className="flex items-start gap-6">
                    <div className="hidden md:flex w-24 h-24 bg-[#022c22] text-[#FDFBF7] items-center justify-center rounded-sm">
                        <Shield size={48} />
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 mb-2">Official Academic Record</div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#022c22] mb-4 leading-tight">{path.topic}</h1>
                        <p className="text-2xl font-serif italic text-amber-700">{getDegreeLabel(path.level)}</p>
                    </div>
                </div>
                
                <div className="mt-8 md:mt-0 text-right bg-stone-50 p-4 border border-stone-200 rounded-sm">
                    <table className="text-sm font-serif text-stone-700">
                        <tbody>
                            <tr>
                                <td className="font-bold text-stone-400 uppercase text-xs pr-4 text-right py-1">Student ID</td>
                                <td className="font-mono font-bold text-[#022c22]">{studentId}</td>
                            </tr>
                            <tr>
                                <td className="font-bold text-stone-400 uppercase text-xs pr-4 text-right py-1">Entry</td>
                                <td className="font-mono font-bold">{path.level}</td>
                            </tr>
                            <tr>
                                <td className="font-bold text-stone-400 uppercase text-xs pr-4 text-right py-1">Term</td>
                                <td className="font-mono font-bold">Fall {currentYear}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Curriculum Body */}
            <div>
                {path.nodes.map((node, index) => {
                    const isLocked = node.status === 'locked';
                    const isCompleted = node.status === 'completed';
                    const code = node.title.split(':')[0].trim();
                    const phase = getPhase(code);
                    const prevPhase = index > 0 ? getPhase(path.nodes[index - 1].title.split(':')[0].trim()) : '';
                    const isNewPhase = phase !== prevPhase;
                    
                    const isCareer = phase.includes('Career');

                    return (
                        <React.Fragment key={node.id}>
                            {isNewPhase && (
                                <div className="mt-12 mb-6 flex items-center gap-4">
                                    <div className={`h-8 w-8 flex items-center justify-center rounded-full text-white ${isCareer ? 'bg-amber-600' : 'bg-[#022c22]'}`}>
                                        {isCareer ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                                    </div>
                                    <h2 className={`text-xl font-serif font-bold uppercase tracking-widest ${isCareer ? 'text-amber-700' : 'text-[#022c22]'}`}>
                                        {phase}
                                    </h2>
                                    <div className="flex-1 h-[1px] bg-stone-200"></div>
                                </div>
                            )}

                            <div 
                                onClick={() => !isLocked && onNodeClick(node)}
                                className={`
                                    flex flex-col md:flex-row gap-6 p-6 border-b last:border-b-0 border-stone-100 transition-colors
                                    ${isLocked ? 'bg-stone-50 opacity-60 grayscale cursor-not-allowed' : 'hover:bg-[#fcfaf5] cursor-pointer'}
                                    ${isCareer ? 'border-l-4 border-l-amber-500 bg-amber-50/10' : ''}
                                `}
                            >
                                <div className="w-24 shrink-0 pt-1">
                                    <div className={`font-mono font-bold text-lg ${isCareer ? 'text-[#022c22]' : 'text-amber-700'}`}>{code}</div>
                                    <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                                        {isCareer ? 'Placement' : '4.0 Credits'}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-serif font-bold text-xl text-[#022c22]">
                                            {node.title.includes(':') ? node.title.split(':')[1] : node.title}
                                        </h3>
                                        <div className="shrink-0 ml-4">
                                            {isCompleted ? (
                                                <div className="flex items-center gap-2 text-[#022c22]">
                                                    <span className="font-serif font-bold text-lg">A</span>
                                                    <CheckCircle2 size={20} />
                                                </div>
                                            ) : isLocked ? (
                                                <Lock size={18} className="text-stone-300" />
                                            ) : (
                                                <div className="text-xs font-bold uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded">In Progress</div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="font-serif text-stone-600 text-sm leading-relaxed italic">
                                        {node.description}
                                    </p>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Official Seal Footer */}
            <div className="mt-24 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-amber-600/30 flex items-center justify-center text-amber-700 mb-4 bg-amber-50 relative">
                     <div className="absolute inset-2 border border-amber-600/50 rounded-full"></div>
                     <Shield size={40} />
                </div>
                <div className="font-serif font-bold text-2xl text-[#022c22] mb-1">Final Verdict</div>
                <div className="font-serif italic text-3xl text-stone-500 font-normal rotate-[-5deg] mb-2">"You are good to Go"</div>
                <div className="w-64 h-px bg-stone-300 mb-2"></div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">Approved for Industry</div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default RoadmapView;