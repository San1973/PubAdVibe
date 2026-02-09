import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Gauge } from '../Gauge';

describe('Gauge', () => {
  it('shows high vibe in green', () => {
    render(<Gauge value={8.4} label="Aesthetic Fit" />);
    
    expect(screen.getByText('8.4')).toBeInTheDocument();
    expect(screen.getByText('Aesthetic Fit')).toBeInTheDocument();
    
    const numberEl = screen.getByText('8.4');
    expect(numberEl).toHaveClass('text-emerald-500');
  });

  it('shows medium vibe in amber', () => {
    render(<Gauge value={5.9} label="Deception Risk" />);
    expect(screen.getByText('5.9')).toHaveClass('text-amber-500');
  });

  it('shows low vibe in red', () => {
    render(<Gauge value={2.1} label="Policy Violations" />);
    expect(screen.getByText('2.1')).toHaveClass('text-rose-500');
  });

  it('clamps percentage width correctly', () => {
    render(<Gauge value={10} label="Test" />);
    const bar = screen.getByTestId('gauge-bar') || screen.getAllByRole('progressbar')[0]; // adjust if you add data-testid
    expect(bar.style.width).toBe('100%');
    
    render(<Gauge value={0} label="Test" />);
    expect(bar.style.width).toBe('0%');
  });
});
