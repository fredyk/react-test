import { render, screen } from '@testing-library/react';
import App from './App';

// Smoke test: `vitest run` fails when there is no test file at all.
test('renders the app title', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'ITX Mobile Shop' })).toBeInTheDocument();
});
