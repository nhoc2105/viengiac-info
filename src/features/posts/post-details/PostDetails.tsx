import { timeAgoLong } from '@/src/utils/date-time.utils';
import { decodeHtmlEntities } from '@/src/utils/html.utils';
import { useCallback, useMemo } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostStorageService from '../services/post-storage.service';

export default function PostDetails() {
  const theme = useTheme();

  const post = PostStorageService.getInstance().getSelectedPost()

  const decodedHtml = useMemo(
    () => decodeHtmlEntities(post?.content || ''),
    [post?.content]
  );


  const chunks = useMemo(() => {
    return decodedHtml
      .split('</p>')
      .filter(Boolean)
      .map(p => p + '</p>');
  }, [decodedHtml]);

  const windowWidth = useWindowDimensions().width;
  const renderItem = useCallback(({ item }: { item: string }) => (
    <View style={{ marginBottom: 8 }}>
      <RenderHtml
        contentWidth={windowWidth}
        source={{ html: item }}
        baseStyle={{
          ...theme.fonts.titleLarge,
          fontSize: 20,
        }}
      />
    </View>
  ), [windowWidth, theme.fonts]);

  if (!post) return null;

  const header = (
    <View>
      <Text variant="headlineMedium" style={{ fontWeight: 700, marginBottom: 16 }}>
        {decodeHtmlEntities(post.title)}
      </Text>
      <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16, opacity: 0.6 }}>
        {timeAgoLong(post.publishedAt)} · {post.author}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <FlatList style={{ paddingHorizontal: 16 }}
        ListHeaderComponent={header}
        data={chunks}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        maxToRenderPerBatch={2}
        initialNumToRender={1}
        windowSize={5}
        removeClippedSubviews={false}
      />
    </SafeAreaView>
  );
}
