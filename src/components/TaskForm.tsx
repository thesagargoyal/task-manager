import { useState, memo } from 'react';
import type { Priority } from '../types/Task';

interface TaskFormProps {
  onAddTask: (title: string, content: string, priority: Priority) => void;
}

const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [errors, setErrors] = useState({ title: '', content: '' });

  const validate = () => {
    const newErrors = { title: '', content: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onAddTask(title.trim(), content.trim(), priority);
      setTitle('');
      setContent('');
      setPriority('medium');
      setErrors({ title: '', content: '' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">✨</span>
        Create New Task
      </h2>

      <div className="space-y-4">
        <div className="group">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Task Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            placeholder="Enter task title..."
            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none
              ${
                errors.title
                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                  : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50/50'
              }
              placeholder:text-gray-400`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500 animate-shake">
              {errors.title}
            </p>
          )}
        </div>
        <div className="group">
          <label
            htmlFor="content"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Task Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errors.content) setErrors({ ...errors, content: '' });
            }}
            placeholder="Describe your task..."
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 outline-none resize-none
              ${
                errors.content
                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                  : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50/50'
              }
              placeholder:text-gray-400`}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-500 animate-shake">
              {errors.content}
            </p>
          )}
        </div>

        <div className="group">
          <label
            htmlFor="priority"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Priority Level
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPriority('high')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]
                ${
                  priority === 'high'
                    ? 'bg-red-500 text-white shadow-md ring-2 ring-red-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span>🔴</span>
                <span>High</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPriority('medium')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]
                ${
                  priority === 'medium'
                    ? 'bg-yellow-500 text-white shadow-md ring-2 ring-yellow-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
                }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span>🟡</span>
                <span>Medium</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPriority('low')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]
                ${
                  priority === 'low'
                    ? 'bg-green-500 text-white shadow-md ring-2 ring-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span>🟢</span>
                <span>Low</span>
              </span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg
            transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <span className="flex items-center justify-center gap-2">
            <span>Add Task</span>
            <span className="text-xl">+</span>
          </span>
        </button>
      </div>
    </form>
  );
};

export default memo(TaskForm);
