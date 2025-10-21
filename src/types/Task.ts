export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  priority: Priority;
}

export type FilterType = 'all' | 'active' | 'completed';
