import type { Post } from '@/src/features/posts/post.types';
import { timeAgo } from '@/src/utils/date-time.utils';
import { decodeHtmlEntities } from '@/src/utils/html.utils';
import { t } from 'i18next';
import React, { useMemo } from 'react';
import { Image } from 'react-native';
import { List, Surface, Text, useTheme } from 'react-native-paper';

export const COVER_SIZE = { width: 112, height: 88 } as const;

/** UI component for rendering a Post Item. */
function PostItem({ post }: { post: Post }) {
  const theme = useTheme();
  const title = useMemo(() => decodeHtmlEntities(post.title ?? ''), [post.title]);
  const elapsed = timeAgo(post.publishedAt);
  const sourceName = t(`organizations.${post.sourceId}`);
  const meta = [sourceName, elapsed].filter(Boolean).join(' · ');

  return (
    <List.Item
      accessibilityRole="button"
      accessibilityLabel={title}
      contentStyle={{ justifyContent: 'space-between' }}
      title={<Text variant="titleMedium" style={{ lineHeight: 22 }}>{title}</Text>}
      titleNumberOfLines={3}
      titleStyle={{ marginTop: -4 }}
      description={() => (
        <Text
          variant="labelMedium"
          numberOfLines={1}
          style={{ color: theme.colors.onSurface, opacity: 0.6, letterSpacing: 0.4 }}
          accessibilityLabel={meta}
        >
          {meta}
        </Text>
      )}
      left={(props) =>
        post.imageUrl ? (
          <Image
            testID='cover-image'
            accessibilityRole="image"             
            accessibilityLabel="cover"
            source={{ uri: post.imageUrl }}
            resizeMode="cover"
            style={[
              props.style,
              {
                width: COVER_SIZE.width,
                height: COVER_SIZE.height,
                borderRadius: 4,
                backgroundColor: theme.colors.surfaceVariant,
                alignSelf: 'flex-start',
              },
            ]}
          />
        ) : (
          <Surface
            testID='placeholder-image'
            accessibilityRole="image"             
            accessibilityLabel="place"
            elevation={0}
            style={[
              props.style as any,
              {
                width: COVER_SIZE.width,
                height: COVER_SIZE.height,
                borderRadius: 4,
                backgroundColor: theme.colors.surfaceVariant,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-start',
              },
            ]}
          >
            <List.Icon color={theme.colors.onSurfaceVariant} icon="image-off-outline" />
          </Surface>
        )
      }
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