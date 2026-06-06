import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components';
import { PostCard } from '@/components/PostCard';
import { useAuth } from '@/features/auth/AuthProvider';
import { fetchFeed } from '@/features/feed/api';
import { colors, spacing } from '@/theme';
import type { FeedPost } from '@/types';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchFeed();
    setPosts(data);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const firstName = profile?.displayName?.split(' ')[0] ?? 'friend';

  return (
    <View style={styles.fill}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          { paddingTop: insets.top + spacing.base, paddingBottom: 120 },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <AppText variant="overline" color={colors.primary}>
                THE TABLE
              </AppText>
              <AppText variant="title">Hey {firstName} 👋</AppText>
              <AppText variant="body" color={colors.textMuted}>
                What your crew is eating today.
              </AppText>
            </View>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.lg },
  header: { marginBottom: spacing.lg, gap: spacing.xs },
});
