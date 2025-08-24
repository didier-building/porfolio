import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Profiles from './Profiles';

vi.mock('../hooks/useInView', () => ({
  default: () => ({ ref: { current: null }, inView: true }),
}));

vi.mock('../services/api', () => ({
  profilesApi: { list: vi.fn() },
}));

const { profilesApi } = require('../services/api');

describe('Profiles', () => {
  afterEach(() => vi.resetAllMocks());

  it('renders empty list when API returns non-array', async () => {
    profilesApi.list.mockResolvedValue({ data: {} });
    const { container } = render(<Profiles />);
    await waitFor(() => expect(profilesApi.list).toHaveBeenCalled());
    expect(container.querySelectorAll('li').length).toBe(0);
  });

  it('renders empty list on API error', async () => {
    profilesApi.list.mockRejectedValue(new Error('err'));
    const { container } = render(<Profiles />);
    await waitFor(() => expect(profilesApi.list).toHaveBeenCalled());
    expect(container.querySelectorAll('li').length).toBe(0);
  });
});
