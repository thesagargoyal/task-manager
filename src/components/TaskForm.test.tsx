import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';

describe('TaskForm', () => {
  const mockOnAddTask = vi.fn();

  beforeEach(() => {
    mockOnAddTask.mockClear();
  });

  describe('Rendering', () => {
    it('should render the form with all fields', () => {
      render(<TaskForm onAddTask={mockOnAddTask} />);

      expect(screen.getByText('Create New Task')).toBeInTheDocument();
      expect(screen.getByLabelText('Task Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Task Content')).toBeInTheDocument();
      expect(screen.getByText('Priority Level')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    it('should render title input with correct attributes', () => {
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const titleInput = screen.getByLabelText('Task Title') as HTMLInputElement;

      expect(titleInput).toHaveAttribute('type', 'text');
      expect(titleInput).toHaveAttribute('placeholder', 'Enter task title...');
      expect(titleInput.value).toBe('');
    });

    it('should render content textarea with correct attributes', () => {
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const contentTextarea = screen.getByLabelText('Task Content') as HTMLTextAreaElement;

      expect(contentTextarea).toHaveAttribute('placeholder', 'Describe your task...');
      expect(contentTextarea).toHaveAttribute('rows', '4');
      expect(contentTextarea.value).toBe('');
    });

    it('should render all three priority buttons', () => {
      render(<TaskForm onAddTask={mockOnAddTask} />);

      expect(screen.getByRole('button', { name: /high/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /medium/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /low/i })).toBeInTheDocument();
    });

    it('should have medium priority selected by default', () => {
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const mediumButton = screen.getByRole('button', { name: /medium/i });

      expect(mediumButton).toHaveClass('bg-yellow-500');
      expect(mediumButton).toHaveClass('text-white');
    });
  });

  describe('Input Handling', () => {
    it('should update title when user types', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const titleInput = screen.getByLabelText('Task Title') as HTMLInputElement;

      await user.type(titleInput, 'New Task Title');

      expect(titleInput.value).toBe('New Task Title');
    });

    it('should update content when user types', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const contentTextarea = screen.getByLabelText('Task Content') as HTMLTextAreaElement;

      await user.type(contentTextarea, 'Task description here');

      expect(contentTextarea.value).toBe('Task description here');
    });

    it('should clear title error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const submitButton = screen.getByRole('button', { name: /add task/i });
      const titleInput = screen.getByLabelText('Task Title');

      await user.click(submitButton);
      expect(screen.getByText('Title is required')).toBeInTheDocument();

      await user.type(titleInput, 'T');
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });

    it('should clear content error when user starts typing', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const submitButton = screen.getByRole('button', { name: /add task/i });
      const contentTextarea = screen.getByLabelText('Task Content');

      await user.click(submitButton);
      expect(screen.getByText('Content is required')).toBeInTheDocument();

      await user.type(contentTextarea, 'C');
      expect(screen.queryByText('Content is required')).not.toBeInTheDocument();
    });
  });

  describe('Priority Selection', () => {
    it('should change priority to high when high button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const highButton = screen.getByRole('button', { name: /high/i });

      await user.click(highButton);

      expect(highButton).toHaveClass('bg-red-500');
      expect(highButton).toHaveClass('text-white');
    });

    it('should change priority to low when low button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const lowButton = screen.getByRole('button', { name: /low/i });

      await user.click(lowButton);

      expect(lowButton).toHaveClass('bg-green-500');
      expect(lowButton).toHaveClass('text-white');
    });

    it('should toggle between different priorities', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const highButton = screen.getByRole('button', { name: /high/i });
      const mediumButton = screen.getByRole('button', { name: /medium/i });
      const lowButton = screen.getByRole('button', { name: /low/i });

      await user.click(highButton);
      expect(highButton).toHaveClass('bg-red-500');

      await user.click(lowButton);
      expect(lowButton).toHaveClass('bg-green-500');
      expect(highButton).not.toHaveClass('bg-red-500');

      await user.click(mediumButton);
      expect(mediumButton).toHaveClass('bg-yellow-500');
      expect(lowButton).not.toHaveClass('bg-green-500');
    });
  });

  describe('Form Validation', () => {
    it('should show error when submitting with empty title', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const submitButton = screen.getByRole('button', { name: /add task/i });
      const contentTextarea = screen.getByLabelText('Task Content');

      await user.type(contentTextarea, 'Some content');
      await user.click(submitButton);

      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(mockOnAddTask).not.toHaveBeenCalled();
    });

    it('should show error when submitting with empty content', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const submitButton = screen.getByRole('button', { name: /add task/i });
      const titleInput = screen.getByLabelText('Task Title');

      await user.type(titleInput, 'Some title');
      await user.click(submitButton);

      expect(screen.getByText('Content is required')).toBeInTheDocument();
      expect(mockOnAddTask).not.toHaveBeenCalled();
    });

    it('should show both errors when submitting empty form', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const submitButton = screen.getByRole('button', { name: /add task/i });

      await user.click(submitButton);

      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Content is required')).toBeInTheDocument();
      expect(mockOnAddTask).not.toHaveBeenCalled();
    });

    it('should show error for whitespace-only title', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const titleInput = screen.getByLabelText('Task Title');
      const contentTextarea = screen.getByLabelText('Task Content');
      const submitButton = screen.getByRole('button', { name: /add task/i });

      await user.type(titleInput, '   ');
      await user.type(contentTextarea, 'Valid content');
      await user.click(submitButton);

      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(mockOnAddTask).not.toHaveBeenCalled();
    });

    it('should show error for whitespace-only content', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const titleInput = screen.getByLabelText('Task Title');
      const contentTextarea = screen.getByLabelText('Task Content');
      const submitButton = screen.getByRole('button', { name: /add task/i });

      await user.type(titleInput, 'Valid title');
      await user.type(contentTextarea, '   ');
      await user.click(submitButton);

      expect(screen.getByText('Content is required')).toBeInTheDocument();
      expect(mockOnAddTask).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should call onAddTask with correct values on valid submission', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const titleInput = screen.getByLabelText('Task Title');
      const contentTextarea = screen.getByLabelText('Task Content');
      const submitButton = screen.getByRole('button', { name: /add task/i });

      await user.type(titleInput, 'Test Task');
      await user.type(contentTextarea, 'Test Content');
      await user.click(submitButton);

      expect(mockOnAddTask).toHaveBeenCalledWith('Test Task', 'Test Content', 'medium');
      expect(mockOnAddTask).toHaveBeenCalledTimes(1);
    });

    it('should call onAddTask with high priority when selected', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const titleInput = screen.getByLabelText('Task Title');
      const contentTextarea = screen.getByLabelText('Task Content');
      const highButton = screen.getByRole('button', { name: /high/i });
      const submitButton = screen.getByRole('button', { name: /add task/i });

      await user.type(titleInput, 'Urgent Task');
      await user.type(contentTextarea, 'Urgent Content');
      await user.click(highButton);
      await user.click(submitButton);

      expect(mockOnAddTask).toHaveBeenCalledWith('Urgent Task', 'Urgent Content', 'high');
    });

    it('should call onAddTask with low priority when selected', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const titleInput = screen.getByLabelText('Task Title');
      const contentTextarea = screen.getByLabelText('Task Content');
      const lowButton = screen.getByRole('button', { name: /low/i });
      const submitButton = screen.getByRole('button', { name: /add task/i });

      await user.type(titleInput, 'Low Priority Task');
      await user.type(contentTextarea, 'Low Priority Content');
      await user.click(lowButton);
      await user.click(submitButton);

      expect(mockOnAddTask).toHaveBeenCalledWith('Low Priority Task', 'Low Priority Content', 'low');
    });

    it('should trim whitespace from title and content', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const titleInput = screen.getByLabelText('Task Title');
      const contentTextarea = screen.getByLabelText('Task Content');
      const submitButton = screen.getByRole('button', { name: /add task/i });

      await user.type(titleInput, '  Trimmed Title  ');
      await user.type(contentTextarea, '  Trimmed Content  ');
      await user.click(submitButton);

      expect(mockOnAddTask).toHaveBeenCalledWith('Trimmed Title', 'Trimmed Content', 'medium');
    });

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const titleInput = screen.getByLabelText('Task Title') as HTMLInputElement;
      const contentTextarea = screen.getByLabelText('Task Content') as HTMLTextAreaElement;
      const submitButton = screen.getByRole('button', { name: /add task/i });

      await user.type(titleInput, 'Test Task');
      await user.type(contentTextarea, 'Test Content');
      await user.click(submitButton);

      expect(titleInput.value).toBe('');
      expect(contentTextarea.value).toBe('');
    });

    it('should reset priority to medium after submission', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const titleInput = screen.getByLabelText('Task Title');
      const contentTextarea = screen.getByLabelText('Task Content');
      const highButton = screen.getByRole('button', { name: /high/i });
      const mediumButton = screen.getByRole('button', { name: /medium/i });
      const submitButton = screen.getByRole('button', { name: /add task/i });

      await user.type(titleInput, 'Test Task');
      await user.type(contentTextarea, 'Test Content');
      await user.click(highButton);
      await user.click(submitButton);

      expect(mediumButton).toHaveClass('bg-yellow-500');
      expect(highButton).not.toHaveClass('bg-red-500');
    });

    it('should clear errors after successful submission', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const titleInput = screen.getByLabelText('Task Title');
      const contentTextarea = screen.getByLabelText('Task Content');
      const submitButton = screen.getByRole('button', { name: /add task/i });

      await user.click(submitButton);
      expect(screen.getByText('Title is required')).toBeInTheDocument();

      await user.type(titleInput, 'Test Task');
      await user.type(contentTextarea, 'Test Content');
      await user.click(submitButton);

      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Content is required')).not.toBeInTheDocument();
    });

    it('should prevent default form submission', async () => {
      const user = userEvent.setup();
      render(<TaskForm onAddTask={mockOnAddTask} />);
      const form = screen.getByRole('button', { name: /add task/i }).closest('form');
      const handleSubmit = vi.fn((e) => e.preventDefault());
      
      form?.addEventListener('submit', handleSubmit);
      
      const titleInput = screen.getByLabelText('Task Title');
      const contentTextarea = screen.getByLabelText('Task Content');
      const submitButton = screen.getByRole('button', { name: /add task/i });

      await user.type(titleInput, 'Test Task');
      await user.type(contentTextarea, 'Test Content');
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
