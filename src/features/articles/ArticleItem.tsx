import type { Article } from '@/src/features/articles/article.types';
import { timeAgo } from '@/src/utils/date-time.utils';
import { decodeHtmlEntities } from '@/src/utils/html.utils';
import React, { useMemo } from 'react';
import { Image, Linking, Platform } from 'react-native';
import { List, Surface, Text, useTheme } from 'react-native-paper';

const COVER_SIZE = { width: 112, height: 88 } as const;

export default function ArticleItem({ article }: { article: Article }) {
  const theme = useTheme();
  const title = useMemo(() => decodeHtmlEntities(article.title ?? ''), [article.title]);
  const author = article.author ?? '';
  const elapsed = timeAgo(article.publishedAt);
  const meta = [article.sourceName, elapsed].filter(Boolean).join(' · ');
  const open = () => Linking.openURL(article.url);

  return (
    <List.Item
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={title}
      contentStyle={{ justifyContent: 'space-between' }}
      title={<Text variant="bodyLarge">{title}</Text>}
      titleNumberOfLines={3}
      titleStyle={[Platform.OS === 'android' ? { marginTop: -5 } : null]}
      description={() => (
        <Text
          variant="bodySmall"
          numberOfLines={1}
          style={{ color: theme.colors.onSurfaceVariant }}
          accessibilityLabel={meta}
        >
          {meta}
        </Text>
      )}
      left={(props) =>
        article.imageUrl ? (
          <Image
            source={{ uri: article.imageUrl }}
            resizeMode="cover"
            style={[
              props.style as any,
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