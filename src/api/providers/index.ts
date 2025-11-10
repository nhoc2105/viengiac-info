import { createFirebaseProvider } from "./firebase/firebase.provider";
import { PostProvider } from "./post-provider.types";

/**
 * Central place to register all your news sources. Add/remove providers here.
 * You can instantiate multiple providers of the same type (e.g., multiple WP sites).
 */
export const providers: PostProvider[] = [
  createFirebaseProvider(),
];