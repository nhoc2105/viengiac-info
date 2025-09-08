import { NewsProvider } from "./provider.types";
import { createWordPressProvider } from "./wordpress/wordpress.provider";

/**
 * Central place to register all your news sources. Add/remove providers here.
 * You can instantiate multiple providers of the same type (e.g., multiple WP sites).
 */
export const providers: NewsProvider[] = [
  createWordPressProvider({
    site: 'https://viengiac.info',
    label: 'Chua Vien Giac',
    useEmbed: true,
  }),
  createWordPressProvider({
    site: 'https://vienlac.de',
    label: 'Chua Vien Lac',
    useEmbed: true,
  }),
  createWordPressProvider({
    site: 'https://amitayus.net/viet',
    label: 'Tu Vien Vo Luong Tho',
    useEmbed: true,
  }),
  createWordPressProvider({
    site: 'https://www.vienminh.ch/',
    label: 'Chua Vien Minh',
    useEmbed: true,
  }),
];