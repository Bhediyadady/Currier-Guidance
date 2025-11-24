import React, { useState, useEffect } from 'react';
import { ForumPost } from '../types';
import { MessageSquare, Plus, ThumbsUp, User } from 'lucide-react';

interface ForumProps {
  onBack: () => void;
}

const Forum: React.FC<ForumProps> = ({ onBack }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Initial seed data if empty
  useEffect(() => {
    const saved = localStorage.getItem('pathfinder_forum');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      const seeds: ForumPost[] = [
        {
          id: '1',
          title: 'Best resources for Python basics?',
          content: 'I just started the Python path. Anyone have extra exercises?',
          author: 'Alice',
          createdAt: Date.now() - 86400000,
          replies: [],
          likes: 3,
        },
        {
          id: '2',
          title: 'How long did it take you to finish Web Dev?',
          content: 'I am struggling with CSS Grid. Just wondering!',
          author: 'Bob',
          createdAt: Date.now() - 172800000,
          replies: [],
          likes: 5,
        }
      ];
      setPosts(seeds);
      localStorage.setItem('pathfinder_forum', JSON.stringify(seeds));
    }
  }, []);

  const savePosts = (newPosts: ForumPost[]) => {
    setPosts(newPosts);
    localStorage.setItem('pathfinder_forum', JSON.stringify(newPosts));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      author: 'You', // In a real app, this comes from auth
      createdAt: Date.now(),
      replies: [],
      likes: 0,
    };

    savePosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const handleReply = (postId: string) => {
    if (!replyContent.trim()) return;

    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [...p.replies, {
            id: Date.now().toString(),
            content: replyContent,
            author: 'You',
            createdAt: Date.now()
          }]
        };
      }
      return p;
    });

    savePosts(updatedPosts);
    setReplyContent('');
  };

  const activePost = posts.find(p => p.id === activePostId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-slate-500 hover:text-slate-800 mb-6 font-medium text-sm flex items-center gap-1">
         ← Back to Home
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
             <MessageSquare className="text-indigo-600" /> Community Forum
           </h1>
           <p className="text-slate-500 mt-1">Ask questions, share progress, and help others.</p>
        </div>
        {!isCreating && !activePostId && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> New Post
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-bold mb-4">Create Discussion</h2>
          <form onSubmit={handleCreatePost}>
            <input
              type="text"
              placeholder="Title"
              className="w-full mb-4 px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <textarea
              placeholder="What's on your mind?"
              rows={4}
              className="w-full mb-4 px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      ) : activePostId && activePost ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <button onClick={() => setActivePostId(null)} className="text-sm text-indigo-600 font-medium mb-4 hover:underline">← All Discussions</button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{activePost.title}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
               <span className="flex items-center gap-1"><User size={14}/> {activePost.author}</span>
               <span>•</span>
               <span>{new Date(activePost.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{activePost.content}</p>
          </div>
          
          <div className="bg-slate-50 p-6">
            <h3 className="font-bold text-slate-800 mb-4">{activePost.replies.length} Replies</h3>
            <div className="space-y-4 mb-6">
              {activePost.replies.map(reply => (
                <div key={reply.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                   <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-slate-700">{reply.author}</span>
                      <span className="text-xs text-slate-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                   </div>
                   <p className="text-slate-600 text-sm">{reply.content}</p>
                </div>
              ))}
              {activePost.replies.length === 0 && (
                <p className="text-slate-500 italic text-sm">No replies yet. Be the first!</p>
              )}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500"
              />
              <button 
                onClick={() => handleReply(activePost.id)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div 
              key={post.id} 
              onClick={() => setActivePostId(post.id)}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 mb-2">{post.title}</h3>
                <div className="flex items-center gap-1 text-slate-400 text-sm bg-slate-100 px-2 py-1 rounded-full">
                  <ThumbsUp size={12} /> {post.likes}
                </div>
              </div>
              <p className="text-slate-600 line-clamp-2 text-sm mb-4">{post.content}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.author}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <span>{post.replies.length} comments</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forum;