import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
  // The cache and the cart count live in localStorage: without this, one test leaks into the next.
  localStorage.clear();
});
