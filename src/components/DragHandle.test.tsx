import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DragHandle from './DragHandle';

describe('DragHandle', () => {
  it('should render the drag handle component', () => {
    render(<DragHandle />);
    const dragHandle = screen.getByLabelText('Drag to reorder');
    expect(dragHandle).toBeInTheDocument();
  });
});
