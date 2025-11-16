import SkeletonShimmer from '@/src/shared/components/basic/skeleton-shimmer/SkeletonShimmer';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

const COVER_SIZE = { width: 112, height: 88 };

export default function PostItemSkeleton({ testID }: { testID: string }) {
  const shimmerColor = useTheme().colors.outlineVariant;
  const shimmerHighlightColor = useTheme().colors.surfaceVariant;

  return (
    <View testID={testID}>
      <View style={{ flexDirection: 'row', padding: 16 }}>
        {/* Cover image */}
        <SkeletonShimmer
          style={{
            width: COVER_SIZE.width,
            height: COVER_SIZE.height,
            borderRadius: 4,
          }}
          shimmerBaseColor={shimmerColor}
          shimmerHighlightColor={shimmerHighlightColor}
        />

        <View style={{ flex: 1, marginLeft: 12, height: COVER_SIZE.height, justifyContent: 'space-between' }}>
          {/* Post title */}
          <SkeletonShimmer
            style={{
              height: COVER_SIZE.height * 0.6,
              borderRadius: 4,
            }}
            shimmerBaseColor={shimmerColor}
            shimmerHighlightColor={shimmerHighlightColor}
          />
          {/* Post subtitle */}
          <SkeletonShimmer
            style={{
              height: COVER_SIZE.height * 0.2,
              width: '80%',
              borderRadius: 4,
            }}
            shimmerBaseColor={shimmerColor}
            shimmerHighlightColor={shimmerHighlightColor}
          />
        </View>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: shimmerColor }} />
    </View>
  );
}