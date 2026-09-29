import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders, AppRoutes } from '../App.jsx';
import { fakeApi } from './fixtures.js';

export function renderApp({ route = '/', api = fakeApi() } = {}) {
  const user = userEvent.setup();
  const utils = render(
    <AppProviders api={api}>
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>
    </AppProviders>,
  );
  return { ...utils, api, user };
}
