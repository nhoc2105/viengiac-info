import { WPPost } from '@/src/features/posts/post.types';
import { timeAgo } from '@/src/utils/date-time.utils';
import { stripHtml } from '@/src/utils/html.utils';
import { getFeaturedImage } from '@/src/utils/media.utils';
import React, { useMemo } from 'react';
import { Image, Linking, Platform } from 'react-native';
import { List, Surface, Text, useTheme } from 'react-native-paper';

const COVER_SIZE = {
    width: 112,
    height: 88
};

export default function PostItem({ post }: { post: WPPost }) {
  const theme = useTheme();

  const title = useMemo(
    () => stripHtml(post.title?.rendered ?? '').trim(),
    [post.title?.rendered]
  );
  const author = post._embedded?.author?.[0]?.name ?? '';
  const elapsed = timeAgo(post.date);
  const meta = [author, elapsed].filter(Boolean).join(' - ');
  const featured = getFeaturedImage(post);

  const open = () => Linking.openURL(post.link);

  return (
    <List.Item
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={title}
      contentStyle={{ justifyContent: 'space-between' }}
      title={
        <Text
          variant="bodyLarge"
        >
          {title}
        </Text>
      }
      titleNumberOfLines={3}
      titleStyle={[Platform.OS === 'android' ? { marginTop: -5 } : null]}
      titleEllipsizeMode='tail'
      description={() => (
        <Text
          variant="bodySmall"
          numberOfLines={1}
          style={{ color: theme.colors.onSurfaceVariant }}
          accessibilityLabel={
            [author ? `Author ${author}` : '', elapsed ? `Published ${elapsed}` : '']
              .filter(Boolean)
              .join(', ')
          }
        >
          {meta}
        </Text>
      )}
      left={(props) =>
        featured ? (
          <Image
            source={{ uri: featured }}
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