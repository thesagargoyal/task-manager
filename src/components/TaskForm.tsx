import { useState } from 'react';

interface TaskFormProps {
  onAddTask: (title: string, content: string) => void;
}

const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
      onAddTask(title.trim(), content.trim());
      setTitle('');
      setContent('');
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

export default TaskForm;
