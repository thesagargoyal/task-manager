import { useState, useEffect, useCallback } from 'react';
import './TaskManager.css'
import type { Task, FilterType, Priority } from './types/Task';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [filter, setFilter] = useState<FilterType>('all');

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = useCallback((title: string, content: string, priority: Priority) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      content,
      completed: false,
      createdAt: new Date(),
      priority,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  }, []);

  const handleToggleComplete = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  const handleEdit = useCallback((id: string, title: string, content: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, title, content } : task
      )
    );
  }, []);

  const handleReorder = useCallback((draggedId: string, targetId: string) => {
    setTasks((prevTasks) => {
      const draggedIndex = prevTasks.findIndex((task) => task.id === draggedId);
      const targetIndex = prevTasks.findIndex((task) => task.id === targetId);

      if (draggedIndex === targetIndex) return prevTasks;

      const newTasks = [...prevTasks];
      const [draggedTask] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(targetIndex, 0, draggedTask);

      return newTasks;
    });
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center mb-12 pt-8">
          <h1 className="mb-4 text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
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
            onReorder={handleReorder}
          />
        </main>
      </div>
    </div>
  );
};

export default TaskManager;
