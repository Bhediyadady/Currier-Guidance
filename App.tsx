import React, { useState, useEffect } from 'react';
import { Course, LearningPath, PathNode, Badge, DifficultyLevel } from './types';
import { generateCourse, generateLearningPath } from './services/gemini';
import Home from './pages/Home';
import CourseView from './pages/CourseView';
import LoadingScreen from './components/LoadingScreen';
import Forum from './pages/Forum';
import Profile from './pages/Profile';
import RoadmapView from './pages/RoadmapView';

type ViewState = 'home' | 'loading' | 'course' | 'forum' | 'profile' | 'roadmap';

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [currentTopic, setCurrentTopic] = useState('');
  
  // Data State
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activePath, setActivePath] = useState<LearningPath | null>(null);
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [savedPaths, setSavedPaths] = useState<LearningPath[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedC = localStorage.getItem('pathfinder_courses');
      if (savedC) setSavedCourses(JSON.parse(savedC));
      
      const savedP = localStorage.getItem('pathfinder_paths');
      if (savedP) setSavedPaths(JSON.parse(savedP));

      const savedB = localStorage.getItem('pathfinder_badges');
      if (savedB) setBadges(JSON.parse(savedB));
    } catch (e) {
      console.error("Failed to load saved data", e);
    }
  }, []);

  const saveCourse = (course: Course) => {
    const exists = savedCourses.find(c => c.id === course.id);
    if (!exists) {
        const newSaved = [course, ...savedCourses];
        setSavedCourses(newSaved);
        localStorage.setItem('pathfinder_courses', JSON.stringify(newSaved));
    }
  };

  const savePath = (path: LearningPath) => {
      const updatedPaths = [path, ...savedPaths.filter(p => p.id !== path.id)];
      setSavedPaths(updatedPaths);
      localStorage.setItem('pathfinder_paths', JSON.stringify(updatedPaths));
  };

  const unlockBadge = (badge: Badge) => {
      if (!badges.find(b => b.id === badge.id)) {
          const newBadges = [...badges, badge];
          setBadges(newBadges);
          localStorage.setItem('pathfinder_badges', JSON.stringify(newBadges));
          alert(`Achievement Unlocked: ${badge.name}!`); // Simple toast replacement
      }
  };

  const checkBadges = (courseId: string, completedCount: number, totalModules: number) => {
      if (completedCount >= 1) {
          unlockBadge({ id: 'first_step', name: 'First Step', description: 'Complete your first module', icon: 'zap' });
      }
      if (completedCount >= 5) {
          unlockBadge({ id: 'bookworm', name: 'Bookworm', description: 'Complete 5 modules', icon: 'book' });
      }
      if (completedCount === totalModules && totalModules > 0) {
          unlockBadge({ id: 'scholar', name: 'Scholar', description: 'Complete a full course', icon: 'award' });
          // Also update path node status if this course belongs to a path
          if (activePath) {
             const updatedNodes = activePath.nodes.map(n => {
                 if (n.courseId === courseId) return { ...n, status: 'completed' as const };
                 // Unlock next node
                 return n;
             });
             
             // Unlock logic: find index of current, unlock next
             const idx = updatedNodes.findIndex(n => n.courseId === courseId);
             if (idx >= 0 && idx < updatedNodes.length - 1) {
                 updatedNodes[idx + 1].status = 'unlocked';
             }

             const newPath = { ...activePath, nodes: updatedNodes };
             setActivePath(newPath);
             savePath(newPath);
          }
      }
  };

  const handleSearch = async (topic: string, level: DifficultyLevel) => {
    setCurrentTopic(topic);
    setView('loading');
    
    // Default Flow: ALWAYS generate a roadmap/degree path first.
    try {
        const path = await generateLearningPath(topic, level);
        setActivePath(path);
        savePath(path);
        unlockBadge({ id: 'pathfinder', name: 'Matriculated', description: 'Enrolled in a degree program', icon: 'star' });
        setView('roadmap');
    } catch (error) {
        alert("Admissions Office is busy (Error generating path). Please try again.");
        setView('home');
    }
  };

  const handleNodeClick = async (node: PathNode) => {
      if (node.courseId) {
          const course = savedCourses.find(c => c.id === node.courseId);
          if (course) {
              setActiveCourse(course);
              setView('course');
          }
      } else {
          // Generate course for this node
          setCurrentTopic(node.title);
          setView('loading');
          try {
              // Contextualize the prompt with the path topic
              const level = activePath?.level || 'Intermediate';
              const course = await generateCourse(`${node.title} (Part of ${activePath?.topic} degree)`, level);
              
              // Link course to node
              if (activePath) {
                  const updatedNodes = activePath.nodes.map(n => 
                      n.id === node.id ? { ...n, courseId: course.id } : n
                  );
                  const updatedPath = { ...activePath, nodes: updatedNodes };
                  setActivePath(updatedPath);
                  savePath(updatedPath);
              }

              setActiveCourse(course);
              saveCourse(course);
              setView('course');
          } catch (e) {
              setView('roadmap');
              alert("Failed to generate course syllabus.");
          }
      }
  };

  // Aggregated stats for profile
  const getTotalCompletedModules = () => {
      // In a real app we'd query a modules_completed table. 
      // Here we iterate local storage keys roughly or just trust the badge logic triggers.
      // Let's count roughly based on local storage keys we know
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('progress_')) {
              const val = localStorage.getItem(key);
              if (val) count += JSON.parse(val).length;
          }
      }
      return count;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {view === 'home' && (
        <Home 
            onSearch={handleSearch} 
            savedCourses={savedCourses} 
            savedPaths={savedPaths}
            onOpenCourse={(id) => {
                setActiveCourse(savedCourses.find(c => c.id === id) || null);
                setView('course');
            }}
            onOpenPath={(id) => {
                setActivePath(savedPaths.find(p => p.id === id) || null);
                setView('roadmap');
            }}
            onOpenForum={() => setView('forum')}
            onOpenProfile={() => setView('profile')}
        />
      )}
      
      {view === 'loading' && (
        <LoadingScreen topic={currentTopic} />
      )}
      
      {view === 'course' && activeCourse && (
        <CourseView 
          course={activeCourse} 
          onBack={() => activePath ? setView('roadmap') : setView('home')}
          onProgressUpdate={(completed, total) => checkBadges(activeCourse.id, completed, total)}
        />
      )}

      {view === 'roadmap' && activePath && (
        <RoadmapView 
            path={activePath} 
            onNodeClick={handleNodeClick}
            onBack={() => setView('home')}
        />
      )}

      {view === 'forum' && (
          <Forum onBack={() => setView('home')} />
      )}

      {view === 'profile' && (
          <Profile 
            badges={badges} 
            completedCount={getTotalCompletedModules()}
            onBack={() => setView('home')} 
          />
      )}
    </div>
  );
}

export default App;