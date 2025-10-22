import { useState, useMemo } from 'react';
import type { Task, FilterType } from '../types/Task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, content: string) => void;
  onReorder: (draggedId: string, targetId: string) => void;
}

const TaskList = ({
  tasks,
  filter,
  onFilterChange,
  onToggleComplete,
  onDelete,
  onEdit,
  onReorder,
}: TaskListProps) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === 'active' && task.completed) return false;
      if (filter === 'completed' && !task.completed) return false;
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(query);
        const contentMatch = task.content.toLowerCase().includes(query);
        return titleMatch || contentMatch;
      }
      
      return true;
    });
  }, [tasks, filter, searchQuery]);

  const sortedTasks = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...filteredTasks].sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [filteredTasks]);

  const stats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  }), [tasks]);

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or content..."
            className="w-full pl-10 pr-10 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:bg-blue-50/50 outline-none transition-all duration-200 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-2 mb-6 flex gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]
            ${
              filter === 'all'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]
            ${
              filter === 'active'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          Active ({stats.active})
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]
            ${
              filter === 'completed'
                ? 'bg-green-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          Completed ({stats.completed})
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">
            {searchQuery ? '🔍' : filter === 'completed' ? '🎉' : filter === 'active' ? '📝' : '📋'}
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {searchQuery
              ? 'No tasks found'
              : filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'active'
                  ? 'No active tasks'
                  : 'No tasks yet'}
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? `No tasks match "${searchQuery}". Try a different search term.`
              : filter === 'all'
                ? 'Create your first task to get started!'
                : filter === 'active'
                  ? 'All tasks are completed! Great job! 🎊'
                  : 'Complete some tasks to see them here'}
          </p>
        </div>
      ) : (
        <div>
          {searchQuery && (
            <div className="mb-4 px-2">
              <p className="text-sm text-gray-600">
                Found <span className="font-semibold text-blue-600">{sortedTasks.length}</span> {sortedTasks.length === 1 ? 'task' : 'tasks'} matching "{searchQuery}"
              </p>
            </div>
          )}
          <div className="space-y-4">
            {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
              onDragStart={(id) => setDraggedTaskId(id)}
              onDragOver={(targetId) => {
                if (draggedTaskId && draggedTaskId !== targetId) {
                  onReorder(draggedTaskId, targetId);
                }
              }}
              onDragEnd={() => setDraggedTaskId(null)}
              isDragging={draggedTaskId === task.id}
              isSearchActive={!!searchQuery.trim()}
            />
          ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
