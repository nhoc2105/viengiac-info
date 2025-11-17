import { render } from '@testing-library/react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated } from 'react-native';
import SkeletonShimmer from './SkeletonShimmer';

jest.mock('expo-linear-gradient', () => ({
    LinearGradient: jest.fn(() => null),
}));


describe('SkeletonShimmer', () => {
    beforeEach(() => {
        jest.spyOn(Animated, 'loop').mockImplementation(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            reset: jest.fn(),
        }));

        jest.spyOn(Animated, 'timing').mockImplementation(() => ({
            start: jest.fn(),
            stop: jest.fn(),
            reset: jest.fn(),
        }));
    });

    it('should render with default colors', () => {
        // WHEN
        const { getByTestId } = render(<SkeletonShimmer testID='skeleton-shimmer' style={{ width: 100, height: 20 }} />);

        // THEN
        expect(getByTestId('skeleton-shimmer')).toBeTruthy();
        expect(LinearGradient).toHaveBeenCalledWith(
            expect.objectContaining({
                colors: ['rgba(255,255,255,0)', '#F5F5F5', 'rgba(255,255,255,0)'],
            }),
            undefined
        );
    });

    it('should render with custom colors', () => {
        // WHEN
        render(
            <SkeletonShimmer
                shimmerBaseColor="#CCC"
                shimmerHighlightColor="#EEE"
                style={{ width: 100 }}
            />
        );

        // THEN
        expect(LinearGradient).toHaveBeenCalledWith(
            expect.objectContaining({
                colors: ['rgba(255,255,255,0)', '#EEE', 'rgba(255,255,255,0)'],
            }),
            undefined
        );
    });

    it('should start animation loop', () => {
        // WHEN
        render(<SkeletonShimmer />);

        // THEN
        expect(Animated.loop).toHaveBeenCalled();
    });
});