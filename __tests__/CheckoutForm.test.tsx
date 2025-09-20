import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutForm from '@/app/components/checkout/CheckoutForm';
import type { Product } from '@/app/types';

const product: Product = {
  code: 'T1',
  name: 'Test',
  description: 'Test product',
  price: 10,
  image: '/t.svg',
};

describe('CheckoutForm', () => {
  it('shows validation errors when fields are empty', async () => {
    render(<CheckoutForm items={[{ product, qty: 1 }]} total={10} />);

    fireEvent.click(screen.getByRole('button', { name: /submit order/i }));

    expect(await screen.findAllByText(/required/i)).toHaveLength(4);
  });

  it('disables submit when cart is empty', () => {
    render(<CheckoutForm items={[]} total={0} />);
    expect(screen.getByRole('button', { name: /submit order/i })).toBeDisabled();
  });

  it('submits successfully and shows thank you message', async () => {
    render(<CheckoutForm items={[{ product, qty: 1 }]} total={10} />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '1234567' },
    });
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit order/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/thank you! your order was submitted\./i),
      ).toBeInTheDocument(),
    );
  });
});
