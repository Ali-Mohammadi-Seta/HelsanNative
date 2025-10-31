// src/components/Loading/index.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/styles/theme';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color,
  style,
  fullScreen = false,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        fullScreen ? styles.fullScreen : styles.container,
        style,
      ]}
    >
      <ActivityIndicator
        size={size}
        color={color || colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;