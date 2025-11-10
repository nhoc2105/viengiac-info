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

  it('should return empty string for invalid date', () => {
    // GIVEN
    const t = 'not-a-date';

    // THEN
    expect(timeAgo(t)).toBe('');
  });

  it('should format seconds', () => {
    // GIVEN
    const t = new Date(base - 30 * 1000).toISOString();

    // THEN
    expect(timeAgo(t)).toBe('30 giây');
  });

  it('should format minutes', () => {
    // GIVEN
    const t = new Date(base - 5 * 60 * 1000).toISOString();

    // THEN
    expect(timeAgo(t)).toBe('5 phút');
  });

  it('should format hours', () => {
    // GIVEN
    const t = new Date(base - 3 * 60 * 60 * 1000).toISOString();

    // THEN
    expect(timeAgo(t)).toBe('3 giờ');
  });

  it('should format days', () => {
    // GIVEN
    const t = new Date(base - 2 * 24 * 60 * 60 * 1000).toISOString();

    // THEN
    expect(timeAgo(t)).toBe('2 ngày');
  });

  it('should format months', () => {
    // GIVEN
    const t = new Date(base - 4 * 30 * 24 * 60 * 60 * 1000).toISOString();

    // THEN
    expect(timeAgo(t)).toBe('4 tháng');
  });

  it('should format years', () => {
    // GIVEN  
    const t = new Date(base - 13 * 30 * 24 * 60 * 60 * 1000).toISOString();

    // THEN
    expect(timeAgo(t)).toBe('1 năm');
  });
});