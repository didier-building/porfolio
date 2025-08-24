import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Journal from './Journal';

vi.mock('../hooks/useInView', () => ({
  default: () => ({ ref: { current: null }, inView: true }),
}));

vi.mock('../services/api', () => ({
  blogApi: { list: vi.fn() },
}));

const { blogApi } = require('../services/api');

describe('Journal', () => {
  afterEach(() => vi.resetAllMocks());

  it('renders empty list when API returns non-array', async () => {
    blogApi.list.mockResolvedValue({ data: {} });
    const { container } = render(<Journal />);
    await waitFor(() => expect(blogApi.list).toHaveBeenCalled());
    expect(container.querySelectorAll('li').length).toBe(0);
  });

  it('renders empty list on API error', async () => {
    blogApi.list.mockRejectedValue(new Error('err'));
    const { container } = render(<Journal />);
    await waitFor(() => expect(blogApi.list).toHaveBeenCalled());
    expect(container.querySelectorAll('li').length).toBe(0);
  });
});
