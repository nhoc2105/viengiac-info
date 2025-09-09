import { timeAgo } from '@/src/utils/date-time.utils';

describe('timeAgo', () => {
  const base = new Date('2024-01-01T12:00:00Z').getTime();
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(base);
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns empty string for invalid date', () => {
    expect(timeAgo('not-a-date')).toBe('');
  });

  it('formats seconds', () => {
    const t = new Date(base - 30 * 1000).toISOString();
    expect(timeAgo(t)).toBe('30s ago');
  });

  it('formats minutes', () => {
    const t = new Date(base - 5 * 60 * 1000).toISOString();
    expect(timeAgo(t)).toBe('5m ago');
  });

  it('formats hours', () => {
    const t = new Date(base - 3 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(t)).toBe('3h ago');
  });

  it('formats days', () => {
    const t = new Date(base - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(t)).toBe('2d ago');
  });

  it('formats months', () => {
    const t = new Date(base - 4 * 30 * 24 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(t)).toBe('4mo ago');
  });

  it('formats years', () => {
    const t = new Date(base - 13 * 30 * 24 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(t)).toBe('1y ago');
  });
});