import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

interface SkeletonShimmerProps {
  style?: ViewStyle;
  shimmerBaseColor?: string;      // Background color
  shimmerHighlightColor?: string; // Gradient highlight color
}

export default function SkeletonShimmer({
  style,
  shimmerBaseColor = '#E0E0E0',
  shimmerHighlightColor = '#F5F5F5', // lighter highlight
}: SkeletonShimmerProps) {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[style, { backgroundColor: shimmerBaseColor, overflow: 'hidden' }]}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateX: shimmerTranslate }],
        }}
      >
        <LinearGradient
          colors={['transparent', shimmerHighlightColor, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
}
