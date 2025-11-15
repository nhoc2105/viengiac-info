import de from '../locales/de.json';
import en from '../locales/en.json';
import vi from '../locales/vi.json';

function getKeys(obj: Record<string, any>, prefix = ''): string[] {
  return Object.keys(obj).flatMap(key => {
    const value = obj[key];
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'object' && value !== null
      ? getKeys(value, newPrefix)
      : [newPrefix];
  });
}

describe('Translation keys consistency', () => {
  it('de should match en', () => {
    // GIVEN
    const enKeys = getKeys(en).sort();
    const deKeys = getKeys(de).sort();

    // THEN
    expect(deKeys).toEqual(enKeys);
  });

  it('vi should match en', () => {
    // GIVEN
    const enKeys = getKeys(en).sort();
    const viKeys = getKeys(vi).sort();

    // THEN
    expect(viKeys).toEqual(enKeys);
  });

});