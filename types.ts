export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  topic: string;
  level: DifficultyLevel;
  rawContent: string;
  modules: CourseModule[];
  sources: Source[];
  createdAt: number;
}

export interface CourseModule {
  title: string;
  content: string; // Markdown snippet for this module
  id: string;
}

export interface Source {
  title: string;
  uri: string;
}

export interface GenerationState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

// --- Gamification Types ---

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon identifier
  unlockedAt?: number;
}

export interface UserProfile {
  username: string;
  badges: Badge[];
  xp: number;
}

// --- Community Forum Types ---

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: number;
  replies: ForumReply[];
  likes: number;
}

export interface ForumReply {
  id: string;
  content: string;
  author: string;
  createdAt: number;
}

// --- Learning Path Types ---

export interface LearningPath {
  id: string;
  topic: string;
  level: DifficultyLevel;
  nodes: PathNode[];
  createdAt: number;
}

export interface PathNode {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'unlocked' | 'completed'; // 'unlocked' means ready to start
  courseId?: string; // ID of the generated course if it exists
}