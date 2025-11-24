import React from 'react';
import { Badge } from '../types';
import { Award, Zap, BookOpen, Star } from 'lucide-react';

interface ProfileProps {
  badges: Badge[];
  completedCount: number;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ badges, completedCount, onBack }) => {
  // Static badge definitions to compare against unlocked ones
  const ALL_BADGES: Badge[] = [
    { id: 'first_step', name: 'First Step', description: 'Complete your first module', icon: 'zap' },
    { id: 'bookworm', name: 'Bookworm', description: 'Complete 5 modules', icon: 'book' },
    { id: 'scholar', name: 'Scholar', description: 'Complete a full course', icon: 'award' },
    { id: 'pathfinder', name: 'Pathfinder', description: 'Start a learning path', icon: 'star' },
  ];

  const getIcon = (name: string, unlocked: boolean) => {
    const className = `w-8 h-8 ${unlocked ? 'text-white' : 'text-slate-400'}`;
    switch (name) {
      case 'zap': return <Zap className={className} />;
      case 'book': return <BookOpen className={className} />;
      case 'award': return <Award className={className} />;
      case 'star': return <Star className={className} />;
      default: return <Award className={className} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-slate-500 hover:text-slate-800 mb-6 font-medium text-sm">
         ← Back to Home
      </button>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
            You
          </div>
          <div>
            <h1 className="text-3xl font-bold">Your Learning Journey</h1>
            <p className="text-indigo-100">Keep learning to unlock more achievements!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <span className="block text-2xl font-bold">{completedCount}</span>
            <span className="text-xs uppercase tracking-wider text-indigo-200">Modules Done</span>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <span className="block text-2xl font-bold">{badges.length}</span>
            <span className="text-xs uppercase tracking-wider text-indigo-200">Badges</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Award className="text-indigo-600" /> Achievements
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {ALL_BADGES.map(badgeDef => {
          const unlocked = badges.find(b => b.id === badgeDef.id);
          return (
            <div 
              key={badgeDef.id} 
              className={`
                relative p-4 rounded-xl border flex items-center gap-4 transition-all
                ${unlocked 
                  ? 'bg-white border-indigo-200 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 opacity-60 grayscale'}
              `}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${unlocked ? 'bg-indigo-500 shadow-md' : 'bg-slate-200'}`}>
                {getIcon(badgeDef.icon, !!unlocked)}
              </div>
              <div>
                <h3 className={`font-bold ${unlocked ? 'text-slate-900' : 'text-slate-500'}`}>{badgeDef.name}</h3>
                <p className="text-sm text-slate-500">{badgeDef.description}</p>
                {unlocked && (
                   <span className="inline-block mt-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                     Unlocked
                   </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
