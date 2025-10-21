import { useState, useEffect } from 'react';
import type { Task, FilterType } from './types/Task';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [filter, setFilter] = useState<FilterType>('all');

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (title: string, content: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      content,
      completed: false,
      createdAt: new Date(),
    };
    setTasks([newTask, ...tasks]);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEdit = (id: string, title: string, content: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title, content } : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center mb-12 pt-8">
          <h1 className="mb-2 text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
            Task Manager
          </h1>
          <p className="text-gray-600 text-lg">
            Organize your tasks, boost your productivity ✨
          </p>
        </header>
        <main>
          <TaskForm onAddTask={handleAddTask} />
          <TaskList
            tasks={tasks}
            filter={filter}
            onFilterChange={setFilter}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
