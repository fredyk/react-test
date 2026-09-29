import { render, screen } from '@testing-library/react';
import { Description } from './Description.jsx';

describe('Description', () => {
  it('renders one row per spec', () => {
    render(
      <Description
        specs={[
          { label: 'Brand', value: 'Acer' },
          { label: 'RAM', value: '2 GB RAM' },
        ]}
      />,
    );

    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Acer')).toBeInTheDocument();
    expect(screen.getByText('RAM')).toBeInTheDocument();
    expect(screen.getByText('2 GB RAM')).toBeInTheDocument();
  });
});
