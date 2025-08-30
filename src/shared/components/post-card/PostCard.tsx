import { WPPost } from '@/src/features/posts/domain.types';
import React from 'react';
import { Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { stripHtml } from '../../utils/html';
import { getFeaturedImage } from '../../utils/media';

export default function PostCard({ post }: { post: WPPost }) {
  const title = stripHtml(post.title?.rendered || '');
  const excerpt = stripHtml(post.excerpt?.rendered || '').slice(0, 180) + '…';
  const author = post._embedded?.author?.[0]?.name || '';
  const featured = getFeaturedImage(post);

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(post.link)}
      style={styles.card}
      activeOpacity={0.7}
    >
      {featured ? (
        <Image source={{ uri: featured }} style={styles.image} resizeMode="cover" />
      ) : null}
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {!!author && <Text style={styles.meta}>Tác giả: {author}</Text>}
        <Text style={styles.excerpt}>{excerpt}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9fb',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  image: { width: '100%', height: 180, backgroundColor: '#eee' },
  textWrap: { padding: 12 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  meta: { fontSize: 12, color: '#666', marginBottom: 6 },
  excerpt: { fontSize: 14, color: '#333' },
});