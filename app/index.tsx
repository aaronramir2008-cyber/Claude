import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth, useIsAuthenticated } from '@/features/auth/AuthProvider';
import { colors } from '@/theme';

/** Decides where to send the user once auth has initialized. */
export default function Index() {
  const { initializing } = useAuth();
  const isAuthed = useIsAuthenticated();

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <Redirect href={isAuthed ? '/(tabs)' : '/(auth)/welcome'} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
