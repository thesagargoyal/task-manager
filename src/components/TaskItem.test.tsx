import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from './TaskItem';
import type { Task } from '../types/Task';

describe('TaskItem', () => {
  const mockOnToggleComplete = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDragStart = vi.fn();
  const mockOnDragOver = vi.fn();
  const mockOnDragEnd = vi.fn();

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    content: 'Test task content',
    completed: false,
    createdAt: new Date('2025-10-22T10:00:00'),
    priority: 'medium',
  };

  beforeEach(() => {
    mockOnToggleComplete.mockClear();
    mockOnDelete.mockClear();
    mockOnEdit.mockClear();
    mockOnDragStart.mockClear();
    mockOnDragOver.mockClear();
    mockOnDragEnd.mockClear();
  });

  const defaultProps = {
    task: mockTask,
    onToggleComplete: mockOnToggleComplete,
    onDelete: mockOnDelete,
    onEdit: mockOnEdit,
    onDragStart: mockOnDragStart,
    onDragOver: mockOnDragOver,
    onDragEnd: mockOnDragEnd,
  };

  describe('Rendering', () => {
    it('should render task title and content', () => {
      render(<TaskItem {...defaultProps} />);

      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test task content')).toBeInTheDocument();
    });

    it('should render drag handle when not in search mode', () => {
      render(<TaskItem {...defaultProps} />);

      expect(screen.getByLabelText('Drag to reorder')).toBeInTheDocument();
    });

    it('should not render drag handle when in search mode', () => {
      render(<TaskItem {...defaultProps} isSearchActive={true} />);

      expect(screen.queryByLabelText('Drag to reorder')).not.toBeInTheDocument();
    });

    it('should render priority badge and formatted date', () => {
      render(<TaskItem {...defaultProps} />);

      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText(/Oct 22, 2025/)).toBeInTheDocument();
    });

    it('should render edit and delete buttons', () => {
      render(<TaskItem {...defaultProps} />);

      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });
  });

  describe('Task Completion', () => {
    it('should call onToggleComplete when checkbox is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} />);

      const checkbox = screen.getByRole('button', { name: /mark as complete/i });
      await user.click(checkbox);

      expect(mockOnToggleComplete).toHaveBeenCalledWith('1');
    });

    it('should show checkmark and line-through style when task is completed', () => {
      const completedTask = { ...mockTask, completed: true };
      const { container } = render(<TaskItem {...defaultProps} task={completedTask} />);

      const checkmark = container.querySelector('svg');
      expect(checkmark).toBeInTheDocument();
      
      const title = screen.getByText('Test Task');
      expect(title).toHaveClass('line-through');
    });

    it('should disable edit button when task is completed', () => {
      const completedTask = { ...mockTask, completed: true };
      render(<TaskItem {...defaultProps} task={completedTask} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      expect(editButton).toBeDisabled();
    });
  });

  describe('Task Deletion', () => {
    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} />);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  describe('Task Editing', () => {
    it('should enter edit mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      expect(screen.getByPlaceholderText('Task title...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Task content...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should populate edit inputs with current task data', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const titleInput = screen.getByPlaceholderText('Task title...') as HTMLInputElement;
      const contentTextarea = screen.getByPlaceholderText('Task content...') as HTMLTextAreaElement;

      expect(titleInput.value).toBe('Test Task');
      expect(contentTextarea.value).toBe('Test task content');
    });

    it('should call onEdit with new values when save is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const titleInput = screen.getByPlaceholderText('Task title...');
      const contentTextarea = screen.getByPlaceholderText('Task content...');

      await user.clear(titleInput);
      await user.type(titleInput, 'New Title');
      await user.clear(contentTextarea);
      await user.type(contentTextarea, 'New Content');

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(mockOnEdit).toHaveBeenCalledWith('1', 'New Title', 'New Content');
    });

    it('should not save when title or content is empty', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const titleInput = screen.getByPlaceholderText('Task title...');
      await user.clear(titleInput);
      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(mockOnEdit).not.toHaveBeenCalled();
    });

    it('should trim whitespace when saving', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      const titleInput = screen.getByPlaceholderText('Task title...');
      const contentTextarea = screen.getByPlaceholderText('Task content...');

      await user.clear(titleInput);
      await user.type(titleInput, '  Trimmed Title  ');
      await user.clear(contentTextarea);
      await user.type(contentTextarea, '  Trimmed Content  ');

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(mockOnEdit).toHaveBeenCalledWith('1', 'Trimmed Title', 'Trimmed Content');
    });

    it('should cancel editing and restore values when cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskItem {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));
      const titleInput = screen.getByPlaceholderText('Task title...');
      await user.clear(titleInput);
      await user.type(titleInput, 'Changed Title');
      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.queryByPlaceholderText('Task title...')).not.toBeInTheDocument();
      expect(mockOnEdit).not.toHaveBeenCalled();
    });
  });

  describe('Drag and Drop', () => {
    it('should be draggable by default', () => {
      const { container } = render(<TaskItem {...defaultProps} />);
      const taskItem = container.firstChild as HTMLElement;

      expect(taskItem).toHaveAttribute('draggable', 'true');
    });

    it('should not be draggable when in edit mode or search is active', async () => {
      const user = userEvent.setup();
      const { container, rerender } = render(<TaskItem {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));
      expect(container.firstChild as HTMLElement).toHaveAttribute('draggable', 'false');

      rerender(<TaskItem {...defaultProps} isSearchActive={true} />);
      expect(container.firstChild as HTMLElement).toHaveAttribute('draggable', 'false');
    });

    it('should call drag event handlers', () => {
      const { container } = render(<TaskItem {...defaultProps} />);
      const taskItem = container.firstChild as HTMLElement;

      fireEvent.dragStart(taskItem);
      expect(mockOnDragStart).toHaveBeenCalledWith('1');

      fireEvent.dragOver(taskItem);
      expect(mockOnDragOver).toHaveBeenCalledWith('1');

      fireEvent.dragEnd(taskItem);
      expect(mockOnDragEnd).toHaveBeenCalled();
    });

    it('should apply dragging styles when isDragging is true', () => {
      const { container } = render(<TaskItem {...defaultProps} isDragging={true} />);
      const taskItem = container.firstChild as HTMLElement;

      expect(taskItem).toHaveClass('opacity-50');
      expect(taskItem).toHaveClass('cursor-grabbing');
    });
  });

  describe('Priority Display', () => {
    it('should display different priority badges', () => {
      const highPriorityTask = { ...mockTask, priority: 'high' as const };
      const { rerender } = render(<TaskItem {...defaultProps} task={highPriorityTask} />);

      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('🔴')).toBeInTheDocument();

      const lowPriorityTask = { ...mockTask, priority: 'low' as const };
      rerender(<TaskItem {...defaultProps} task={lowPriorityTask} />);

      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('🟢')).toBeInTheDocument();
    });
  });
});
