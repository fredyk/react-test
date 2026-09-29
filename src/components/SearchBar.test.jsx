import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar.jsx';

describe('SearchBar', () => {
  it('labels the input and reports every keystroke', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByRole('searchbox', { name: 'Search' });
    await user.type(input, 'a');

    expect(onChange).toHaveBeenCalledWith('a');
  });
});
