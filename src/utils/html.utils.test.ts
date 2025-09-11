import { decodeHtmlEntities, stripHtml } from '@/src/utils/html.utils';

test('decodeHtmlEntities decodes common entities', () => {
  // GIVEN
  const input = 'Vien &amp; Giac &lt;news&gt;&#8482;';
  const expected = 'Vien & Giac <news>™';

  // THEN
  expect(decodeHtmlEntities(input)).toBe(expected);
});

test('stripHtml removes tags and trims', () => {
  // GIVEN
  const input = '  <p>Hello <strong>world</strong></p>  ';
  const expected = 'Hello world';

  // THEN
  expect(stripHtml(input)).toBe(expected);
  expect(stripHtml('')).toBe('');
});
