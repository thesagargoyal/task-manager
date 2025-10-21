export interface Task {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: Date;
}

export type FilterType = 'all' | 'active' | 'completed';
