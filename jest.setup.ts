import '@testing-library/jest-dom';

// Polyfill for window.matchMedia used by some components/libraries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  // Use plain JS here so Jest doesn't need to transpile TS in setup files
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: (_listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => {},
    removeListener: (_listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList),
});
