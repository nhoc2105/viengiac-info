// src/shared/utils/time.ts
export function timeAgo(isoDate: string): string {
  const published = new Date(isoDate).getTime();
  if (Number.isNaN(published)) return '';

  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - published) / 1000));

  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;

  const diffMon = Math.floor(diffDay / 30);
  if (diffMon < 12) return `${diffMon}mo ago`;

  const diffYr = Math.floor(diffMon / 12);
  return `${diffYr}y ago`;
}