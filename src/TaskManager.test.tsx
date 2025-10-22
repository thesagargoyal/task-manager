import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskManager from './TaskManager';

describe('TaskManager', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      clear: () => {
        store = {};
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('Rendering', () => {
    it('should render main heading and description', () => {
      render(<TaskManager />);

      expect(screen.getByText('Task Manager')).toBeInTheDocument();
      expect(screen.getByText(/organize your tasks/i)).toBeInTheDocument();
    });
  });

  describe('Task Management', () => {
    it('should add a new task when form is submitted', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      const titleInput = screen.getByLabelText('Task Title');
      const contentTextarea = screen.getByLabelText('Task Content');
      const submitButton = screen.getByRole('button', { name: /add task/i });

      await user.type(titleInput, 'New Task');
      await user.type(contentTextarea, 'Task description');
      await user.click(submitButton);

      expect(screen.getByText('New Task')).toBeInTheDocument();
      expect(screen.getByText('Task description')).toBeInTheDocument();
    });

    it('should toggle task completion status', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Add a task first
      await user.type(screen.getByLabelText('Task Title'), 'Test Task');
      await user.type(screen.getByLabelText('Task Content'), 'Test Content');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Toggle completion
      const checkbox = screen.getByRole('button', { name: /mark as complete/i });
      await user.click(checkbox);

      const title = screen.getByText('Test Task');
      expect(title).toHaveClass('line-through');
    });

    it('should delete a task', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Add a task
      await user.type(screen.getByLabelText('Task Title'), 'Task to Delete');
      await user.type(screen.getByLabelText('Task Content'), 'Will be deleted');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      expect(screen.getByText('Task to Delete')).toBeInTheDocument();

      // Delete the task
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument();
    });

    it('should edit a task', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Add a task
      await user.type(screen.getByLabelText('Task Title'), 'Original Title');
      await user.type(screen.getByLabelText('Task Content'), 'Original Content');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Edit the task
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const titleInput = screen.getByPlaceholderText('Task title...');
      const contentTextarea = screen.getByPlaceholderText('Task content...');

      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');
      await user.clear(contentTextarea);
      await user.type(contentTextarea, 'Updated Content');

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.getByText('Updated Content')).toBeInTheDocument();
      expect(screen.queryByText('Original Title')).not.toBeInTheDocument();
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should load tasks from localStorage on mount', () => {
      const savedTasks = JSON.stringify([
        {
          id: '1',
          title: 'Saved Task',
          content: 'From localStorage',
          completed: false,
          createdAt: new Date().toISOString(),
          priority: 'medium',
        },
      ]);
      localStorageMock.setItem('tasks', savedTasks);

      render(<TaskManager />);

      expect(screen.getByText('Saved Task')).toBeInTheDocument();
      expect(screen.getByText('From localStorage')).toBeInTheDocument();
    });

    it('should save tasks to localStorage when tasks change', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      await user.type(screen.getByLabelText('Task Title'), 'New Task');
      await user.type(screen.getByLabelText('Task Content'), 'New Content');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      await waitFor(() => {
        const savedTasks = localStorageMock.getItem('tasks');
        expect(savedTasks).toBeTruthy();
        const tasks = JSON.parse(savedTasks!);
        expect(tasks).toHaveLength(1);
        expect(tasks[0].title).toBe('New Task');
      });
    });
  });

  describe('Integration', () => {
    it('should handle complete workflow: add, edit, complete, and delete tasks', async () => {
      const user = userEvent.setup();
      render(<TaskManager />);

      // Add a task
      await user.type(screen.getByLabelText('Task Title'), 'Workflow Task');
      await user.type(screen.getByLabelText('Task Content'), 'Original');
      await user.click(screen.getByRole('button', { name: /add task/i }));

      // Edit the task
      await user.click(screen.getByRole('button', { name: /edit/i }));
      const titleInput = screen.getByPlaceholderText('Task title...');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Workflow');
      await user.click(screen.getByRole('button', { name: /save/i }));

      // Complete the task
      await user.click(screen.getByRole('button', { name: /mark as complete/i }));
      expect(screen.getByText('Updated Workflow')).toHaveClass('line-through');

      // Delete the task
      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(screen.queryByText('Updated Workflow')).not.toBeInTheDocument();
    });
  });
});
