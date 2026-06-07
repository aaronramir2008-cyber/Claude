import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

import { AppText } from '@/components';
import { colors, fonts, shadows } from '@/theme';

/**
 * The hero of the bottom bar — a raised, fiery circle that reads as "the main
 * thing." Tapping it opens the Cook hub (play the decision game or find a
 * recipe). Modeled on the standout center button in TikTok / Instagram.
 */
function CookTabButton({ onPress, accessibilityState }: BottomTabBarButtonProps) {
  const focused = accessibilityState?.selected;
  return (
    <Pressable
      style={styles.cookWrap}
      accessibilityRole="button"
      accessibilityLabel="Cook"
      onPress={(e) => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress?.(e);
      }}
    >
      <LinearGradient
        colors={['#F2A65A', '#E06B4F', '#C0392B']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.cookCircle, focused && styles.cookCircleActive]}
      >
        <Ionicons name="flame" size={30} color="#FFF7EF" />
      </LinearGradient>
      <AppText variant="caption" color={focused ? colors.primary : colors.textMuted} style={styles.cookLabel}>
        Cook
      </AppText>
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'restaurant' : 'restaurant-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: 'Reels',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'play-circle' : 'play-circle-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cook"
        options={{
          title: 'Cook',
          tabBarButton: (props) => <CookTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Crew',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'You',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    backgroundColor: colors.backgroundElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: 8,
    ...shadows.floating,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 0.3,
    marginTop: 2,
  },
  item: { paddingTop: 4 },
  cookWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -16 }],
    borderWidth: 3,
    borderColor: colors.backgroundElevated,
    shadowColor: '#C0392B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  cookCircleActive: { transform: [{ translateY: -16 }, { scale: 1.04 }] },
  cookLabel: { fontSize: 11, marginTop: -10 },
});
