import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';

describe('NotFoundPage', () => {
  it('announces the missing page and links back to the list', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to products/i })).toHaveAttribute('href', '/');
  });
});
