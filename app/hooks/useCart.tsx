import { useEffect, useState } from 'react';
import type { CartItem } from '@/app/types';
import { getCart } from '@/app/lib/cart';

/**
 * Custom hook to get the cart items from the session storage
 */
export default function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = () => setItems(getCart());
    load();

    const handler = (e: Event) => {
      try {
        const cartEvent = e as CustomEvent<{ items?: CartItem[] }>;
        const next = cartEvent.detail?.items;
        if (Array.isArray(next)) {
          setItems(next);
        } else {
          load();
        }
      } catch {
        load();
      }
    };

    window.addEventListener('cart:updated', handler as EventListener);
    return () =>
      window.removeEventListener('cart:updated', handler as EventListener);
  }, []);

  return items;
}
