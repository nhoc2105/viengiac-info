
import type { Post } from '@/src/features/posts/post.types';
import { timeAgoShort } from '@/src/utils/date-time.utils';
import { decodeHtmlEntities } from '@/src/utils/html.utils';
import { useRouter } from 'expo-router';
import { t } from 'i18next';
import React, { useCallback, useMemo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { List, Surface, Text, useTheme } from 'react-native-paper';
import PostStorageService from './services/post-storage.service';

export const COVER_SIZE = { width: 112, height: 88 } as const;

function PostItem({ post }: { post: Post }) {
  const theme = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    contentStyle: { justifyContent: 'space-between' },
    title: { lineHeight: 22 },
    titleStyle: { marginTop: -4 },
    description: {
      color: theme.colors.onSurface,
      opacity: 0.6,
      letterSpacing: 0.4
    },
    cover: {
      width: COVER_SIZE.width,
      height: COVER_SIZE.height,
      borderRadius: 4,
      alignSelf: 'flex-start',
    },
    placeholder: {
      width: COVER_SIZE.width,
      height: COVER_SIZE.height,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    },
  });

  // Derived values
  const title = useMemo(() => decodeHtmlEntities(post.title ?? ''), [post.title]);
  const elapsed = useMemo(() => timeAgoShort(post.publishedAt), [post.publishedAt]);
  const sourceName = useMemo(() => t(`organizations.${post.sourceId}.short`), [post.sourceId]);
  const meta = useMemo(() => [sourceName, elapsed].filter(Boolean).join(' · '), [sourceName, elapsed]);

  // Stable callbacks
  const handlePress = useCallback(() => {
    PostStorageService.getInstance().setSelectedPost(post);
    router.push({ pathname: '/post/details', params: { id: post.id } });
  }, [post, router]);

  const renderDescription = useCallback(
    () => (
      <Text
        variant="labelMedium"
        numberOfLines={1}
        style={[styles.description, { color: theme.colors.onSurface }]}
        accessibilityLabel={meta}
      >
        {meta}
      </Text>
    ),
    [meta, theme.colors.onSurface, styles.description]
  );

  const renderLeft = useCallback(
    (props: { style?: object }) =>
      post.imageUrl ? (
        <Image
          testID="cover-image"
          accessibilityRole="image"
          accessibilityLabel="cover"
          source={{ uri: post.imageUrl }}
          resizeMode="cover"
          style={[props.style, styles.cover, { backgroundColor: theme.colors.surfaceVariant }]}
        />
      ) : (
        <Surface
          testID="placeholder-image"
          accessibilityRole="image"
          accessibilityLabel="place"
          elevation={0}
          style={[props.style as any, styles.placeholder, { backgroundColor: theme.colors.surfaceVariant }]}
        >
          <List.Icon color={theme.colors.onSurfaceVariant} icon="image-off-outline" />
        </Surface>
      ),
    [post.imageUrl, theme.colors.surfaceVariant, theme.colors.onSurfaceVariant, styles]
  );

  return (
    <List.Item
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={title}
      contentStyle={styles.contentStyle}
      title={<Text variant="titleMedium" style={styles.title}>{title}</Text>}
      titleNumberOfLines={3}
      titleStyle={styles.titleStyle}
      description={renderDescription}
      left={renderLeft}
    />
  );
}

export default React.memo(
  PostItem,
  (prev, next) =>
    prev.post.id === next.post.id &&
    prev.post.title === next.post.title &&
    prev.post.imageUrl === next.post.imageUrl &&
    prev.post.publishedAt === next.post.publishedAt &&
    prev.post.sourceId === next.post.sourceId &&
    prev.post.url === next.post.url
);
