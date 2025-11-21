import { t } from 'i18next';

export function timeAgoShort(isoDate: string): string {
  return timeAgo(isoDate, false);
}

export function timeAgoLong(isoDate: string): string {
  return timeAgo(isoDate, true);
}

function timeAgo(isoDate: string, long = false): string {
  const published = new Date(isoDate).getTime();
  if (Number.isNaN(published)) return '';
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - published) / 1000));

  const key = long ? 'time.elapsed.long' : 'time.elapsed.short';

  if (diffSec < 60)
    return t(key, { count: diffSec, unit: t('time.seconds') });

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60)
    return t(key, { count: diffMin, unit: t('time.minutes') });

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24)
    return t(key, { count: diffHr, unit: t('time.hours') });

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30)
    return t(key, { count: diffDay, unit: t('time.days') });

  const diffMon = Math.floor(diffDay / 30);
  if (diffMon < 12)
    return t(key, { count: diffMon, unit: t('time.months') });

  const diffYr = Math.floor(diffMon / 12);
  return t(key, { count: diffYr, unit: t('time.years') });
}