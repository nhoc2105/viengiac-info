import { firebaseDb } from '@/firebase.config';
import type { Post } from '@/src/features/posts/post.types';
import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { LoadPageResult, PostProvider } from '../post-provider.types';
import { mapFirebasePost } from './firebase-post.mapper';
import { FirebasePost } from './firebase-post.type';

export function createFirebaseProvider(): PostProvider {
  let lastVisible: any = null;

  return {
    id: 'firebase:posts',
    label: 'Firebase Posts',
    async loadPage(_page: number, pageSize: number): Promise<LoadPageResult> {
      let postQuery = query(collection(firebaseDb, 'posts'), orderBy('modifiedGmt', 'desc'), limit(pageSize));
      if (lastVisible) {
        postQuery = query(postQuery, startAfter(lastVisible));
      }

      const snapshot = await getDocs(postQuery);
      const items: Post[] = snapshot.docs.map(doc => mapFirebasePost(doc.data() as FirebasePost));
      lastVisible = snapshot.docs[snapshot.docs.length - 1];

      return {
        items,
        canLoadMore: snapshot.docs.length === pageSize,
      };
    },
  };
}