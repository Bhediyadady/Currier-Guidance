import React from 'react';
import { Course } from '../types';
import { BookOpen, ChevronRight, GraduationCap } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-sm border border-stone-200 shadow-sm hover:shadow-xl hover:border-amber-500 transition-all cursor-pointer overflow-hidden flex flex-col h-full"
    >
      <div className="h-32 bg-[#022c22] p-6 flex flex-col justify-end relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-white transform rotate-12">
            <GraduationCap size={100} />
        </div>
        
        <div className="absolute top-4 left-4">
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                {course.level || 'Core'}
            </span>
        </div>
        
        <h3 className="text-white text-xl font-serif font-bold line-clamp-2 relative z-10 leading-tight border-l-2 border-amber-500 pl-3">
            {course.topic}
        </h3>
      </div>
      
      <div className="p-6 flex-grow bg-[#fffefb]">
        <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-widest mb-4">
            <BookOpen size={14} className="text-amber-600" />
            <span>{course.modules.length} Lab Modules</span>
        </div>
        <p className="text-stone-600 text-sm font-serif italic line-clamp-3 mb-4 leading-relaxed">
            {course.modules[0]?.content.slice(0, 150).replace(/##/g, '').replace(/\*\*/g, '')}...
        </p>
      </div>
      
      <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 group-hover:bg-amber-50 transition-colors flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-500 group-hover:text-amber-800">Open Syllabus</span>
        <ChevronRight size={16} className="text-stone-400 group-hover:text-amber-600" />
      </div>
    </div>
  );
};

export default CourseCard;