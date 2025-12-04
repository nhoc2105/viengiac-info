
import { timeAgoLong } from '@/src/utils/date-time.utils';
import { decodeHtmlEntities } from '@/src/utils/html.utils';
import { useCallback, useMemo } from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PostStorageService from '../services/post-storage.service';
import { customHtmlModels, CustomHtmlRenderers } from './html-renderer/CustomHtmlRenderers';

export default function PostDetails() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const post = PostStorageService.getInstance().getSelectedPost();

  const decodedHtml = useMemo(
    () => decodeHtmlEntities(post?.content || ''),
    [post?.content]
  );

  const chunks = useMemo(() => {
    const splitTags = [
      '</p>', 
      '<br\\s*/?>', 
      '(<img[^>]*>)', 
      '(<iframe[^>]*>)', 
      '(</audio>)',
      '(<audio[^>]*src=["\'][^"\']+["\'][^>]*>)',
      '(</video>)',
      '(<video[^>]*src=["\'][^"\']+["\'][^>]*>)',
    ];
    const regex = new RegExp(splitTags.join('|'), 'i');
    return decodedHtml
      .split(regex)
      .map(s => s?.trim())
      .filter(Boolean);
  }, [decodedHtml]);

  const windowWidth = useWindowDimensions().width;
  const contentWidth = windowWidth - 16 * 2;

  const renderers = CustomHtmlRenderers(contentWidth);

  const renderItem = useCallback(
    ({ item, index }: { item: string, index: number }) => (
      <View
        testID={`post-chunk-${index}`}
        style={{ marginBottom: 8 }}
      >
        <RenderHtml
          contentWidth={contentWidth}
          source={{ html: item }}
          baseStyle={{
            ...theme.fonts.titleMedium,
          }}
          renderersProps={{
            img: {
              enableExperimentalPercentWidth: true
            }
          }}
          renderers={renderers} // Use custom renderers
          customHTMLElementModels={customHtmlModels}
        />
      </View>
    ),
    [theme.fonts, contentWidth, renderers]
  );

  if (!post) return null;

  const header = (
    <View>
      <Text
        testID="post-title"
        variant="headlineMedium"
        style={{ fontWeight: '700', marginBottom: 16 }}
      >
        {decodeHtmlEntities(post.title)}
      </Text>
      <Text
        testID="post-meta"
        style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16, opacity: 0.6 }}
      >
        {timeAgoLong(post.publishedAt)} · {post.author.join(', ')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.surface,
      }}
      edges={[]}
    >
      <FlatList
        testID="post-content-list"
        style={{ paddingHorizontal: 16 }}
        ListHeaderComponent={header}
        data={chunks}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        maxToRenderPerBatch={5}
        initialNumToRender={2}
        windowSize={11}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}
