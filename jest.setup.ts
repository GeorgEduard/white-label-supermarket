import '@testing-library/jest-dom';

// Polyfill for window.matchMedia used by some components/libraries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  // Use plain JS here so Jest doesn't need to transpile TS in setup files
  value: query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
