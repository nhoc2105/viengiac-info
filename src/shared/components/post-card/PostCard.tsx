// src/shared/components/post-card/PostCard.tsx
import React, { useMemo } from 'react';
import { Linking } from 'react-native';
import { Card, Chip, IconButton, Text, useTheme } from 'react-native-paper';

import type { WPPost } from '@/src/features/posts/post.types';
import { stripHtml } from '../../utils/html';
import { getFeaturedImage } from '../../utils/media';

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(date));
  } catch {
    return '';
  }
}

export default function PostCard({ post }: { post: WPPost }) {
  const theme = useTheme();

  const title = useMemo(
    () => stripHtml(post.title?.rendered ?? '').trim(),
    [post.title?.rendered]
  );

  const excerpt = useMemo(() => {
    const raw = stripHtml(post.excerpt?.rendered ?? '').trim();
    // Shorter, but with better readability
    return raw.length > 180 ? raw.slice(0, 180).trimEnd() + '…' : raw;
  }, [post.excerpt?.rendered]);

  const author = post._embedded?.author?.[0]?.name ?? '';
  const dateStr = formatDate(post.date);
  const featured = getFeaturedImage(post);

  const open = () => Linking.openURL(post.link);

  return (
    <Card mode="elevated" onPress={open} elevation={1} style={{ borderRadius: 16 }}>
      {featured ? (
        <Card.Cover
          source={{ uri: featured }}
          resizeMode="cover"
          style={{ backgroundColor: theme.colors.surfaceVariant }}
        />
      ) : null}

      <Card.Content style={{ paddingVertical: 12 }}>
        <Text variant="titleMedium" style={{ marginBottom: 4, letterSpacing: 0.1 }}>
          {title}
        </Text>

        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
            marginTop: 4,
            lineHeight: 20,
          }}
          numberOfLines={4}
        >
          {excerpt}
        </Text>

        <Text
          variant="bodySmall"
          style={{
            color: theme.colors.onSurfaceVariant,
            marginTop: 8,
            marginBottom: 6,
          }}
        >
          {/* Fallback to date only if no author */}
          {author ? `Tác giả: ${author}` : undefined}
          {author && dateStr ? ' • ' : ''}
          {dateStr}
        </Text>

        {/* Optional chips for quick scanning */}
        <Chip
          compact
          icon="account"
          style={{ marginRight: 8, alignSelf: 'flex-start' }}
          showSelectedOverlay={false}
        >
          {author || '—'}
        </Chip>
      </Card.Content>

      <Card.Actions style={{ justifyContent: 'space-between' }}>
        <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          Đọc bài viết
        </Text>
        <IconButton icon="open-in-new" onPress={open} accessibilityLabel="Mở trên web" />
      </Card.Actions>
    </Card>
  );
}