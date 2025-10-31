// src/components/CategoryCard/index.tsx
import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const numColumns = 3;
const cardMargin = 10;
const containerPadding = 32;
const CARD_SIZE = (width - containerPadding - (cardMargin * numColumns * 2)) / numColumns;

interface CategoryCardProps {
  title: string;
  icon: any;
  url?: string;
  gradientColors?: [string, string, ...string[]]; // ✅ FIX: Proper tuple type (at least 2 colors)
  onPress?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  icon,
  url,
  gradientColors = ['#16a34a', '#22c55e'], // ✅ Default with 2 colors
  onPress,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (url) {
      router.push(url as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <LinearGradient
        colors={gradientColors} // ✅ Now properly typed
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { width: CARD_SIZE, height: CARD_SIZE }]}
      >
        <Image 
          source={icon} 
          style={styles.icon}
          resizeMode="contain"
        />
      </LinearGradient>
      
      <Text style={[styles.title, { width: CARD_SIZE }]} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: cardMargin,
    alignItems: 'center',
  },
  gradient: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    width: 60,
    height: 60,
  },
  title: {
    color: '#4b5563',
    fontSize: 12,
    fontFamily: 'IRANSans-Bold',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
});

export default CategoryCard;