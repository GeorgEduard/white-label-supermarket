'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { Product } from '@/app/types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface CartItem {
  product: Product;
  qty: number;
}

export default function CheckoutPage() {
  // Dummy product (we'll replace with real cart later)
  const dummyProduct: Product = useMemo(
    () => ({
      code: 'APL001',
      name: 'Fresh Apples (1kg)',
      price: 3.99,
      description: 'Crisp, juicy apples perfect for snacking and baking.',
      image: '/products-cake.svg',
      promo: undefined,
    }),
    [],
  );

  const [items, setItems] = useState<CartItem[]>([
    { product: dummyProduct, qty: 1 },
  ]);
  const [submitted, setSubmitted] = useState(false);

  const initialValues = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    payment: 'cod' as const,
  };

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .trim()
      .min(2, 'Please enter your full name')
      .required('Full name is required'),
    email: Yup.string()
      .trim()
      .email('Enter a valid email')
      .required('Email is required'),
    phone: Yup.string()
      .trim()
      .min(7, 'Enter a valid phone number')
      .required('Phone is required'),
    address: Yup.string()
      .trim()
      .min(5, 'Enter a valid address')
      .required('Address is required'),
    payment: Yup.mixed<'cod'>().oneOf(['cod']),
  });

  const cartTotal = useMemo(
    () => items.reduce((sum, it) => sum + it.product.price * it.qty, 0),
    [items],
  );

  function updateQty(code: string, qty: number) {
    setItems(prev =>
      prev
        .map(ci =>
          ci.product.code === code ? { ...ci, qty: Math.max(1, qty) } : ci,
        )
        .filter(ci => ci.qty > 0),
    );
  }

  function removeItem(code: string) {
    setItems(prev => prev.filter(ci => ci.product.code !== code));
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart */}
        <section className="lg:col-span-2">
          <h2 className="text-xl font-medium mb-3">Your Cart</h2>

          {items.length === 0 ? (
            <p className="text-black/70">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product: p, qty }) => (
                <li
                  key={p.code}
                  className="flex gap-4 sm:gap-6 items-center p-4 rounded-lg border border-emerald-100 bg-white/80 shadow-sm"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-md ring-1 ring-emerald-100 bg-white shadow-inner">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="112px"
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-medium truncate">
                        {p.name}
                      </h3>
                      <div className="text-emerald-700 font-semibold">
                        ${p.price.toFixed(2)}
                      </div>
                    </div>
                    <p className="text-sm text-black/70 mt-1 line-clamp-2">
                      {p.description}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      {/* Quantity */}
                      <label
                        className="text-sm text-black/70"
                        htmlFor={`qty-${p.code}`}
                      >
                        Qty
                      </label>
                      <input
                        id={`qty-${p.code}`}
                        type="number"
                        min={1}
                        inputMode="numeric"
                        className="w-20 rounded-md border border-slate-200 px-2 py-1 text-sm"
                        value={qty}
                        onChange={e =>
                          updateQty(p.code, Number(e.target.value) || 1)
                        }
                      />

                      {/* Remove */}
                      <button
                        aria-label="Remove from cart"
                        className="ml-auto inline-flex items-center justify-center rounded-md border border-transparent px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(p.code)}
                      >
                        <span aria-hidden>×</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Summary + Checkout */}
        <section className="lg:col-span-1">
          <div className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-3">Order Summary</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-700 mb-4">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                if (items.length === 0) {
                  setSubmitting(false);
                  return;
                }
                console.log('Order submitted', {
                  items,
                  form: values,
                  total: cartTotal,
                });
                setSubmitted(true);
                setSubmitting(false);
                resetForm();
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1" htmlFor="fullName">
                      Full name
                    </label>
                    <Field
                      id="fullName"
                      name="fullName"
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                      placeholder="John Doe"
                    />
                    <ErrorMessage
                      name="fullName"
                      component="p"
                      className="text-xs text-red-600 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1" htmlFor="email">
                        Email
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        placeholder="john@example.com"
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-xs text-red-600 mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1" htmlFor="phone">
                        Phone
                      </label>
                      <Field
                        id="phone"
                        name="phone"
                        type="tel"
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                        placeholder="(123) 456-7890"
                      />
                      <ErrorMessage
                        name="phone"
                        component="p"
                        className="text-xs text-red-600 mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1" htmlFor="address">
                      Address
                    </label>
                    <Field
                      as="textarea"
                      id="address"
                      name="address"
                      rows={3}
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm resize-y"
                      placeholder="Street, number, city, ZIP"
                    />
                    <ErrorMessage
                      name="address"
                      component="p"
                      className="text-xs text-red-600 mt-1"
                    />
                  </div>

                  <fieldset className="mt-2">
                    <legend className="block text-sm mb-1">
                      Payment method
                    </legend>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <Field type="radio" name="payment" value="cod" />
                      Cash on delivery
                    </label>
                  </fieldset>

                  <button
                    type="submit"
                    disabled={items.length === 0 || isSubmitting}
                    className="w-full inline-flex items-center justify-center rounded-md bg-amber-500 text-white px-4 py-2 text-sm shadow-sm hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit order'}
                  </button>

                  {submitted && (
                    <p className="text-sm text-emerald-700">
                      Thank you! Your order was submitted.
                    </p>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </div>
    </div>
  );
}
