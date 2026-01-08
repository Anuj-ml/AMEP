
import { Student, PBLProject, Task, Resource, FeedItem } from './types';

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    engagementIndex: 85,
    masteryScores: [
      { subject: 'Mathematics', score: 72, previousScore: 65, gapAreas: ['Calculus', 'Trigonometry'] },
      { subject: 'Physics', score: 88, previousScore: 82, gapAreas: ['Thermodynamics'] }
    ]
  },
  {
    id: '2',
    name: 'Maria Garcia',
    engagementIndex: 62,
    masteryScores: [
      { subject: 'Mathematics', score: 91, previousScore: 89, gapAreas: [] },
      { subject: 'Physics', score: 45, previousScore: 50, gapAreas: ['Quantum Mechanics', 'Wave Optics'] }
    ]
  }
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: 'Visualizing Integration',
    type: 'video',
    subject: 'Mathematics',
    duration: '12 min',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80',
    recommendedReason: 'Focuses on your gap in Area Under Curves.'
  },
  {
    id: 'r2',
    title: 'Thermodynamics Interactive Sim',
    type: 'sim',
    subject: 'Physics',
    duration: '20 min',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80',
    recommendedReason: 'Active practice for Heat Transfer concepts.'
  }
];

export const MOCK_FEED: FeedItem[] = [
  {
    id: 'f1',
    user: 'Team Solar Pioneers',
    role: 'Project Team',
    content: 'Just reached 50% milestone on Site Selection! The solar irradiance data is looking promising for our chosen location.',
    timestamp: '2h ago',
    likes: 12,
    comments: 3,
    type: 'milestone'
  },
  {
    id: 'f2',
    user: 'Dr. Sarah Wilson',
    role: 'Teacher',
    content: 'Check out this new interactive simulation for Wave Optics. It really helps clarify the double-slit experiment!',
    timestamp: '5h ago',
    likes: 24,
    comments: 8,
    type: 'resource'
  }
];

export const MOCK_PROJECTS: PBLProject[] = [
  {
    id: 'p1',
    title: 'Renewable Energy City',
    description: 'Design a sustainable city model powered entirely by renewable resources.',
    status: 'active',
    milestones: [
      { id: 'm1', title: 'Site Selection', dueDate: '2023-11-20', completed: true },
      { id: 'm2', title: 'Resource Mapping', dueDate: '2023-12-05', completed: false }
    ],
    teams: [
      { id: 't1', name: 'Solar Pioneers', members: ['1', '2'], progress: 45 },
      { id: 't2', name: 'Wind Warriors', members: ['3'], progress: 60 }
    ]
  }
];

export const MOCK_TASKS: Task[] = [
  { id: 't-1', title: 'Grade Mid-term PBL Reports', type: 'grading', priority: 'high', status: 'todo' },
  { id: 't-2', title: 'Prepare Thermodynamics Lesson', type: 'lesson_plan', priority: 'medium', status: 'todo' }
];
