import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EntryCard from '../EntryCard.jsx';

describe('EntryCard', () => {
  const mockEntry = {
    id: '1',
    message: 'Test message',
    tags: ['react', 'javascript'],
    category: 'work',
    timestamp: new Date('2026-02-18T10:00:00'),
  };

  it('renders entry message', () => {
    render(<EntryCard entry={mockEntry} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(<EntryCard entry={mockEntry} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('renders category', () => {
    render(<EntryCard entry={mockEntry} />);
    expect(screen.getByText('work')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<EntryCard entry={mockEntry} onDelete={onDelete} />);
    const deleteButton = screen.getByLabelText('Delete entry');
    deleteButton.click();
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
