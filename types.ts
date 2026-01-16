
export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  xp?: number;
  notifications?: NotificationSettings;
}

export interface NotificationSettings {
  tasks: boolean;
  pbl: boolean;
  community: boolean;
  quietHours: boolean;
}

export interface MasteryScore {
  subject: string;
  score: number;
  previousScore: number;
  gapAreas: string[];
}

export interface Student extends User {
  engagementIndex: number;
  masteryScores: MasteryScore[];
  skills: string[];
  personalityType: string;
}

export interface PBLProject {
  id: string;
  title: string;
  description: string;
  milestones: Milestone[];
  teams: Team[];
  status: 'planning' | 'active' | 'completed';
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  progress: number;
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'sim' | 'quiz';
  subject: string;
  duration: string;
  thumbnail: string;
  recommendedReason?: string;
}

export interface FeedItem {
  id: string;
  user: string;
  role: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  type: 'milestone' | 'resource' | 'update';
}

export interface Task {
  id: string;
  title: string;
  type: 'lesson_plan' | 'grading' | 'administrative' | 'meeting' | 'homework';
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'done';
}
