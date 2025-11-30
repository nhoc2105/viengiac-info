import { createFirebaseProvider } from "./firebase/firebase.provider";
import { PostProvider } from "./post-provider.types";

export const postProviders: PostProvider = createFirebaseProvider();