import { t } from 'i18next';

export function timeAgo(isoDate: string): string {
  const published = new Date(isoDate).getTime();
  if (Number.isNaN(published)) return '';

  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - published) / 1000));

  if (diffSec < 60) return `${diffSec} ${t('time.seconds')}`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} ${t('time.minutes')}`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} ${t('time.hours')}`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay} ${t('time.days')}`;

  const diffMon = Math.floor(diffDay / 30);
  if (diffMon < 12) return `${diffMon} ${t('time.months')}`;

  const diffYr = Math.floor(diffMon / 12);
  return `${diffYr} ${t('time.years')}`;
}