import React from 'react';
import { Terminal, AlertCircle, Cpu } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  
  const renderLine = (line: string, index: number) => {
    const cleanLine = line.trim();

    // Special Styling for Lab Protocol Headers (The "Practical" Part)
    if (cleanLine.toUpperCase().includes('LAB PROTOCOL') || cleanLine.toUpperCase().includes('CAPSTONE CHALLENGE')) {
        return (
            <div key={index} className="mt-16 mb-8">
                <div className="flex items-center gap-3 border-b-4 border-[#022c22] pb-2 mb-4">
                    <div className="bg-[#022c22] text-amber-400 p-2">
                        <Terminal size={24} />
                    </div>
                    <h2 className="text-2xl font-mono font-bold text-[#022c22] tracking-tight uppercase m-0 border-none p-0">
                        {cleanLine.replace(/##/g, '').replace(/\*\*/g, '')}
                    </h2>
                </div>
                <div className="bg-stone-100 p-4 border-l-4 border-amber-500 text-sm font-sans text-stone-600 italic">
                    <strong className="text-stone-900 not-italic block mb-1">Engineering Requirement:</strong>
                    Complete the following specifications precisely.
                </div>
            </div>
        );
    }

    // Header 2 (Modules)
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-3xl font-serif font-bold text-[#022c22] mt-16 mb-6 border-b border-stone-200 pb-2">{line.replace('## ', '')}</h2>;
    }
    // Header 3 (Subsections)
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-serif font-bold text-emerald-900 mt-8 mb-4 flex items-center gap-2">
          <Cpu size={18} className="text-amber-600" />
          {line.replace('### ', '')}
      </h3>;
    }
    // Header 4/Bold
    if (line.startsWith('#### ')) {
      return <h4 key={index} className="text-lg font-sans font-bold text-stone-800 mt-6 mb-2 uppercase tracking-wide">{line.replace('#### ', '')}</h4>;
    }
    
    // Lists
    if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
      const text = cleanLine.substring(2);
      return (
        <li key={index} className="ml-0 mb-3 list-none flex items-start gap-4 group">
            <div className="mt-2.5 min-w-[6px] h-[6px] transform rotate-45 bg-amber-600 group-hover:bg-[#022c22] transition-colors"></div>
            <span className="text-stone-700 leading-relaxed font-serif text-lg">{parseInline(text)}</span>
        </li>
      );
    }
    if (/^\d+\.\s/.test(cleanLine)) {
       const text = cleanLine.replace(/^\d+\.\s/, '');
       return (
         <li key={index} className="ml-0 mb-4 list-none flex items-start gap-4">
             <span className="font-mono text-sm font-bold text-[#022c22] bg-emerald-100 px-2 py-0.5 mt-0.5 border border-emerald-200 min-w-[28px] text-center">
                 {cleanLine.match(/^\d+/)?.[0]}
             </span>
             <span className="text-stone-700 leading-relaxed font-serif text-lg">{parseInline(text)}</span>
         </li>
       );
    }

    // Code blocks (naive detection for simplicity)
    if (cleanLine.startsWith('```')) {
        return null; // Skip markers
    }

    // Empty line
    if (cleanLine === '') {
      return <div key={index} className="h-4"></div>;
    }

    // Standard Paragraph
    return <p key={index} className="mb-4 text-stone-800 leading-8 text-lg font-serif">{parseInline(line)}</p>;
  };

  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-[#022c22] bg-amber-50 px-1">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-stone-100 text-[#be123c] px-1.5 py-0.5 text-sm font-mono border border-stone-200">{part.slice(1, -1)}</code>;
      }
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
         const [full, label, url] = linkMatch;
         const split = part.split(full);
         return (
            <span key={i}>
                {split[0]}
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#059669] hover:text-[#022c22] border-b border-[#059669] hover:border-[#022c22] font-semibold transition-colors">{label}</a>
                {split[1]}
            </span>
         );
      }
      return part;
    });
  };

  return (
    <div className="markdown-content">
      {content.split('\n').map((line, i) => renderLine(line, i))}
      
      {content.length > 200 && (
          <div className="mt-16 pt-8 border-t-2 border-stone-200 flex flex-col items-center justify-center text-stone-400 gap-2">
              <div className="w-2 h-2 rounded-full bg-stone-300"></div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-sans">Section Complete</div>
          </div>
      )}
    </div>
  );
};

export default MarkdownView;