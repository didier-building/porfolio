import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Comms from './Comms';

vi.mock('../hooks/useInView', () => ({
  default: () => ({ ref: { current: null }, inView: true }),
}));

vi.mock('../services/api', () => ({
  commsApi: { list: vi.fn() },
  MEDIA_BASE: '',
}));

const { commsApi } = require('../services/api');

describe('Comms', () => {
  afterEach(() => vi.resetAllMocks());

  it('renders empty list when API returns non-array', async () => {
    commsApi.list.mockResolvedValue({ data: {} });
    const { container } = render(<Comms />);
    await waitFor(() => expect(commsApi.list).toHaveBeenCalled());
    expect(container.querySelectorAll('li').length).toBe(0);
  });

  it('renders empty list on API error', async () => {
    commsApi.list.mockRejectedValue(new Error('err'));
    const { container } = render(<Comms />);
    await waitFor(() => expect(commsApi.list).toHaveBeenCalled());
    expect(container.querySelectorAll('li').length).toBe(0);
  });
});
