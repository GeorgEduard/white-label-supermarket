import React from 'react';
import { render } from '@testing-library/react';
import Button from '@/app/components/ui/Button';

describe('Button', () => {
  it('renders with primary variant classes', () => {
    const { getByRole } = render(<Button variant="primary">Click</Button>);
    const btn = getByRole('button');
    expect(btn).toHaveClass('bg-cyan-700');
  });

  it('applies size classes', () => {
    const { getByRole } = render(<Button size="sm">Small</Button>);
    const btn = getByRole('button');
    expect(btn).toHaveClass('px-2.5', 'py-1.5');
  });

  it('respects disabled state', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>);
    const btn = getByRole('button');
    expect(btn).toBeDisabled();
  });
});
