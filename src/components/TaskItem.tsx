import { useState } from 'react';
import type { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, content: string) => void;
}

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editContent, setEditContent] = useState(task.content);

  const handleSave = () => {
    if (editTitle.trim() && editContent.trim()) {
      onEdit(task.id, editTitle.trim(), editContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditContent(task.content);
    setIsEditing(false);
  };

  return (
    <div
      className={"bg-white rounded-xl shadow-md p-5 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border-2 border-blue-300 focus:border-blue-500 outline-none transition-colors"
            placeholder="Task title..."
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border-2 border-blue-300 focus:border-blue-500 outline-none resize-none transition-colors"
            placeholder="Task content..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start gap-3 mb-3">
            <button
              onClick={() => onToggleComplete(task.id)}
              className="mt-1 shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center
                transition-all duration-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed && (
                <svg
                  className="w-4 h-4 text-blue-500 animate-scale-in"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-lg font-bold text-gray-800 mb-1 transition-all duration-200
                  ${task.completed ? 'line-through text-gray-500' : ''}`}
              >
                {task.title}
              </h3>
              <p
                className={`text-gray-600 text-sm leading-relaxed transition-all duration-200
                  ${task.completed ? 'line-through text-gray-400' : ''}`}
              >
                {task.content}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(task.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              disabled={task.completed}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 
                transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-1">
                <span>✏️</span>
                <span>Edit</span>
              </span>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 
                transition-all duration-200 font-medium transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-1">
                <span>🗑️</span>
                <span>Delete</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
