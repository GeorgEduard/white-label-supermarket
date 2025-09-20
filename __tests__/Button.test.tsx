import React from 'react';
import { render } from '@testing-library/react';
import Button from '@/app/components/ui/Button';

describe('Button', () => {
  it('renders with primary variant classes', () => {
    const { getByRole } = render(
      React.createElement(Button, { variant: 'primary' }, 'Click'),
    );
    const btn = getByRole('button');
    expect(btn).toHaveClass('bg-cyan-700');
  });

  it('applies size classes', () => {
    const { getByRole } = render(
      React.createElement(Button, { size: 'sm' }, 'Small'),
    );
    const btn = getByRole('button');
    expect(btn).toHaveClass('px-2.5', 'py-1.5');
  });

  it('respects disabled state', () => {
    const { getByRole } = render(
      React.createElement(Button, { disabled: true }, 'Disabled'),
    );
    const btn = getByRole('button');
    expect(btn).toBeDisabled();
  });
});
