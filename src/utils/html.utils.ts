import he from 'he';

export function decodeHtmlEntities(text: string): string {
  return he.decode(text);
}

export function stripHtml(html: string) {
  return (html ?? '').replace(/<[^>]+>/g, '').trim();
}