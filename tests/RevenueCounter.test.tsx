// tests/RevenueCounter.test.tsx
import { render, screen } from '@testing-library/react';
import { RevenueCounter } from '../RevenueCounter';

it('renders formatted revenue', () => {
  render(<RevenueCounter value={1245678.9} />);
  expect(screen.getByText(/\$1.25M/i)).toBeInTheDocument(); // adjust formatter
});

it('shows placeholder when value is 0', () => {
  render(<RevenueCounter value={0} />);
  expect(screen.getByText(/protected revenue/i)).toBeInTheDocument();
});
