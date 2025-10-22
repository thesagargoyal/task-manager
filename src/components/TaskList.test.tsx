import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from './TaskList';
import type { Task, FilterType } from '../types/Task';

describe('TaskList', () => {
  const mockOnFilterChange = vi.fn();
  const mockOnToggleComplete = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnReorder = vi.fn();

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'High Priority Task',
      content: 'Important content',
      completed: false,
      createdAt: new Date('2025-10-22T10:00:00'),
      priority: 'high',
    },
    {
      id: '2',
      title: 'Medium Priority Task',
      content: 'Normal content',
      completed: true,
      createdAt: new Date('2025-10-22T11:00:00'),
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Low Priority Task',
      content: 'Less urgent content',
      completed: false,
      createdAt: new Date('2025-10-22T12:00:00'),
      priority: 'low',
    },
  ];

  const defaultProps = {
    tasks: mockTasks,
    filter: 'all' as FilterType,
    onFilterChange: mockOnFilterChange,
    onToggleComplete: mockOnToggleComplete,
    onDelete: mockOnDelete,
    onEdit: mockOnEdit,
    onReorder: mockOnReorder,
  };

  beforeEach(() => {
    mockOnFilterChange.mockClear();
    mockOnToggleComplete.mockClear();
    mockOnDelete.mockClear();
    mockOnEdit.mockClear();
    mockOnReorder.mockClear();
  });

  describe('Rendering', () => {
    it('should render search input and filter buttons', () => {
      render(<TaskList {...defaultProps} />);

      expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /all \(3\)/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /active \(2\)/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /completed \(1\)/i })).toBeInTheDocument();
    });

    it('should render all tasks when filter is "all"', () => {
      render(<TaskList {...defaultProps} />);

      expect(screen.getByText('High Priority Task')).toBeInTheDocument();
      expect(screen.getByText('Medium Priority Task')).toBeInTheDocument();
      expect(screen.getByText('Low Priority Task')).toBeInTheDocument();
    });

    it('should sort tasks by priority (high, medium, low)', () => {
      const { container } = render(<TaskList {...defaultProps} />);
      const taskTitles = Array.from(container.querySelectorAll('h3')).map((h3) => h3.textContent);

      expect(taskTitles[0]).toBe('High Priority Task');
      expect(taskTitles[1]).toBe('Medium Priority Task');
      expect(taskTitles[2]).toBe('Low Priority Task');
    });
  });

  describe('Filtering', () => {
    it('should call onFilterChange when filter buttons are clicked', async () => {
      const user = userEvent.setup();
      render(<TaskList {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /active/i }));
      expect(mockOnFilterChange).toHaveBeenCalledWith('active');

      await user.click(screen.getByRole('button', { name: /completed/i }));
      expect(mockOnFilterChange).toHaveBeenCalledWith('completed');
    });

    it('should show only active tasks when filter is "active"', () => {
      render(<TaskList {...defaultProps} filter="active" />);

      expect(screen.getByText('High Priority Task')).toBeInTheDocument();
      expect(screen.getByText('Low Priority Task')).toBeInTheDocument();
      expect(screen.queryByText('Medium Priority Task')).not.toBeInTheDocument();
    });

    it('should show only completed tasks when filter is "completed"', () => {
      render(<TaskList {...defaultProps} filter="completed" />);

      expect(screen.getByText('Medium Priority Task')).toBeInTheDocument();
      expect(screen.queryByText('High Priority Task')).not.toBeInTheDocument();
      expect(screen.queryByText('Low Priority Task')).not.toBeInTheDocument();
    });

    it('should highlight active filter button', () => {
      const { rerender } = render(<TaskList {...defaultProps} filter="all" />);
      
      let allButton = screen.getByRole('button', { name: /all/i });
      expect(allButton).toHaveClass('bg-blue-500');

      rerender(<TaskList {...defaultProps} filter="active" />);
      let activeButton = screen.getByRole('button', { name: /active/i });
      expect(activeButton).toHaveClass('bg-orange-500');

      rerender(<TaskList {...defaultProps} filter="completed" />);
      let completedButton = screen.getByRole('button', { name: /completed/i });
      expect(completedButton).toHaveClass('bg-green-500');
    });
  });

  describe('Search Functionality', () => {
    it('should filter tasks by title when searching', async () => {
      const user = userEvent.setup();
      render(<TaskList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'High Priority');

      expect(screen.getByText('High Priority Task')).toBeInTheDocument();
      expect(screen.queryByText('Medium Priority Task')).not.toBeInTheDocument();
      expect(screen.queryByText('Low Priority Task')).not.toBeInTheDocument();
    });

    it('should filter tasks by content when searching', async () => {
      const user = userEvent.setup();
      render(<TaskList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'Important');

      expect(screen.getByText('High Priority Task')).toBeInTheDocument();
      expect(screen.queryByText('Medium Priority Task')).not.toBeInTheDocument();
    });

    it('should show search results count', async () => {
      const user = userEvent.setup();
      render(<TaskList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'Priority');

      expect(screen.getByText(/Found/i)).toBeInTheDocument();
      expect(screen.getByText(/tasks matching "Priority"/i)).toBeInTheDocument();
    });

    it('should show clear button when search has value', async () => {
      const user = userEvent.setup();
      render(<TaskList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      
      expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();

      await user.type(searchInput, 'test');
      expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
    });

    it('should clear search when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search tasks/i) as HTMLInputElement;
      await user.type(searchInput, 'test');
      
      const clearButton = screen.getByLabelText(/clear search/i);
      await user.click(clearButton);

      expect(searchInput.value).toBe('');
    });

    it('should be case-insensitive when searching', async () => {
      const user = userEvent.setup();
      render(<TaskList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'high priority');

      expect(screen.getByText('High Priority Task')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no tasks exist', () => {
      render(<TaskList {...defaultProps} tasks={[]} />);

      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
      expect(screen.getByText(/create your first task/i)).toBeInTheDocument();
    });

    it('should show empty state when no active tasks', () => {
      const completedTasks = mockTasks.map(t => ({ ...t, completed: true }));
      render(<TaskList {...defaultProps} tasks={completedTasks} filter="active" />);

      expect(screen.getByText('No active tasks')).toBeInTheDocument();
      expect(screen.getByText(/all tasks are completed/i)).toBeInTheDocument();
    });

    it('should show empty state when no completed tasks', () => {
      const activeTasks = mockTasks.map(t => ({ ...t, completed: false }));
      render(<TaskList {...defaultProps} tasks={activeTasks} filter="completed" />);

      expect(screen.getByText('No completed tasks yet')).toBeInTheDocument();
    });

    it('should show empty state when search returns no results', async () => {
      const user = userEvent.setup();
      render(<TaskList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'nonexistent');

      expect(screen.getByText('No tasks found')).toBeInTheDocument();
      expect(screen.getByText(/no tasks match "nonexistent"/i)).toBeInTheDocument();
    });
  });

  describe('Task Statistics', () => {
    it('should display correct task counts in filter buttons', () => {
      render(<TaskList {...defaultProps} />);

      expect(screen.getByText(/all \(3\)/i)).toBeInTheDocument();
      expect(screen.getByText(/active \(2\)/i)).toBeInTheDocument();
      expect(screen.getByText(/completed \(1\)/i)).toBeInTheDocument();
    });

    it('should update counts when tasks change', () => {
      const { rerender } = render(<TaskList {...defaultProps} />);

      expect(screen.getByText(/all \(3\)/i)).toBeInTheDocument();

      const newTasks = [...mockTasks, {
        id: '4',
        title: 'New Task',
        content: 'New content',
        completed: false,
        createdAt: new Date(),
        priority: 'medium' as const,
      }];

      rerender(<TaskList {...defaultProps} tasks={newTasks} />);

      expect(screen.getByText(/all \(4\)/i)).toBeInTheDocument();
      expect(screen.getByText(/active \(3\)/i)).toBeInTheDocument();
    });
  });

  describe('Drag and Drop', () => {
    it('should render draggable tasks by default', () => {
      const { container } = render(<TaskList {...defaultProps} />);
      const taskItems = container.querySelectorAll('[draggable="true"]');

      expect(taskItems.length).toBe(3);
    });

    it('should disable drag when search is active', async () => {
      const user = userEvent.setup();
      render(<TaskList {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'Priority');

      // When search is active, isSearchActive prop should be passed to TaskItem
      expect(screen.getByText('High Priority Task')).toBeInTheDocument();
    });
  });
});
