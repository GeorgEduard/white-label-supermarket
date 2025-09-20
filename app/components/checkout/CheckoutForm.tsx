"use client";
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { Product } from '@/app/types';

interface CartItem {
  product: Product;
  qty: number;
}

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
}

export default function CheckoutForm({ items, total }: CheckoutFormProps) {
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

  return (
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
          total,
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
            <legend className="block text-sm mb-1">Payment method</legend>
            <label className="inline-flex items-center gap-2 text-sm">
              <Field type="radio" name="payment" value="cod" />
              Cash on delivery
            </label>
          </fieldset>

          <button
            type="submit"
            disabled={items.length === 0 || isSubmitting}
            className="w-full inline-flex items-center justify-center rounded-md bg-cyan-700 text-white px-4 py-2 text-sm shadow-sm hover:bg-cyan-800 disabled:opacity-60 disabled:cursor-not-allowed"
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
  );
}
