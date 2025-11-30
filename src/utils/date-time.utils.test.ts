import i18n from '@/src/i18n';
import { formatDuration, timeAgoLong, timeAgoShort } from '@/src/utils/date-time.utils';

describe('timeAgo', () => {
  const base = new Date('2024-01-01T12:00:00Z').getTime();
  beforeAll(() => {
    i18n.changeLanguage('vi');
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(base);
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return empty string for invalid date', () => {
    // GIVEN
    const t = 'not-a-date';

    // THEN
    expect(timeAgoShort(t)).toBe('');
  });

  it('should format seconds', () => {
    // GIVEN
    const t = new Date(base - 30 * 1000).toISOString();

    // THEN
    expect(timeAgoLong(t)).toBe('30 giây trước');
  });

  it('should format minutes', () => {
    // GIVEN
    const t = new Date(base - 5 * 60 * 1000).toISOString();

    // THEN
    expect(timeAgoShort(t)).toBe('5 phút');
  });

  it('should format hours', () => {
    // GIVEN
    const t = new Date(base - 3 * 60 * 60 * 1000).toISOString();

    // THEN
    expect(timeAgoLong(t)).toBe('3 giờ trước');
  });

  it('should format days', () => {
    // GIVEN
    const t = new Date(base - 2 * 24 * 60 * 60 * 1000).toISOString();

    // THEN
    expect(timeAgoShort(t)).toBe('2 ngày');
  });

  it('should format months', () => {
    // GIVEN
    const t = new Date(base - 4 * 30 * 24 * 60 * 60 * 1000).toISOString();

    // THEN
    expect(timeAgoLong(t)).toBe('4 tháng trước');
  });

  it('should format years', () => {
    // GIVEN  
    const t = new Date(base - 13 * 30 * 24 * 60 * 60 * 1000).toISOString();

    // THEN
    expect(timeAgoShort(t)).toBe('1 năm');
  });
});

describe('formatDuration', () => {
  test.each([
    // Base cases
    { input: 0, expected: '00:00' },
    { input: 1, expected: '00:01' },
    { input: 59, expected: '00:59' },
    { input: 60, expected: '01:00' },
    { input: 61, expected: '01:01' },
    { input: 3599, expected: '59:59' },

    // Hours present
    { input: 3600, expected: '01:00:00' },
    { input: 3661, expected: '01:01:01' },
    { input: 7322, expected: '02:02:02' },

    // Large hours
    { input: 359999, expected: '99:59:59' },
    { input: 360000, expected: '100:00:00' },

    // Rounding behavior
    { input: 0.4, expected: '00:00' },
    { input: 0.5, expected: '00:01' },
    { input: 59.4, expected: '00:59' },
    { input: 59.5, expected: '01:00' },
    { input: 3599.4, expected: '59:59' },
    { input: 3599.5, expected: '01:00:00' },

    // Padding checks
    { input: 600, expected: '10:00' },
    { input: 3605, expected: '01:00:05' },

    // Negative -> clamp to 00:00
    { input: -0.1, expected: '00:00' },
    { input: -1, expected: '00:00' },
    { input: -61, expected: '00:00' },
    { input: -3661.9, expected: '00:00' },
  ])('should format $input sec -> $expected', ({ input, expected }) => {
    expect(formatDuration(input)).toBe(expected);
  });
});
