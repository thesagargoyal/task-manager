import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PriorityBadge from './PriorityBadge';

describe('PriorityBadge', () => {
  describe('High Priority', () => {
    it('should render high priority badge with correct label and correct emoji', () => {
      render(<PriorityBadge priority="high" />);
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('🔴')).toBeInTheDocument();
    });
  });

  describe('Medium Priority', () => {
    it('should render medium priority badge with correct label and correct emoji', () => {
      render(<PriorityBadge priority="medium" />);
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('🟡')).toBeInTheDocument();
    });
  });

  describe('Low Priority', () => {
    it('should render low priority badge with correct label and correct emoji', () => {
      render(<PriorityBadge priority="low" />);
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('🟢')).toBeInTheDocument();
    });
  });
});
