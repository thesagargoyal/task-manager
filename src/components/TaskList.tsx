import { useState } from 'react';
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
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <div>
      {/* Filter Tabs */}
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

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">
            {filter === 'completed' ? '🎉' : filter === 'active' ? '📝' : '📋'}
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {filter === 'completed'
              ? 'No completed tasks yet'
              : filter === 'active'
                ? 'No active tasks'
                : 'No tasks yet'}
          </h3>
          <p className="text-gray-500">
            {filter === 'all'
              ? 'Create your first task to get started!'
              : filter === 'active'
                ? 'All tasks are completed! Great job! 🎊'
                : 'Complete some tasks to see them here'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
