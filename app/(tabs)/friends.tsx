import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText, Avatar, Button, Card, Screen } from '@/components';
import { colors, radius, spacing } from '@/theme';

const GROUPS = [
  { id: 'g1', name: 'Station 12', emoji: '🚒', members: 8 },
  { id: 'g2', name: 'Gym Crew', emoji: '💪', members: 5 },
  { id: 'g3', name: 'Family', emoji: '❤️', members: 4 },
];

const FRIENDS = [
  { id: 'f1', name: 'Maya Brooks', handle: '@maya' },
  { id: 'f2', name: 'Diego Salas', handle: '@diego' },
  { id: 'f3', name: 'Kenji Ito', handle: '@kenji' },
  { id: 'f4', name: 'Rosa Mendez', handle: '@rosa' },
];

export default function FriendsScreen() {
  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="overline" color={colors.primary}>
          YOUR PEOPLE
        </AppText>
        <AppText variant="title">Crew</AppText>
      </View>

      <View style={styles.sectionHead}>
        <AppText variant="heading">Groups</AppText>
        <AppText variant="label" color={colors.primary}>
          + New
        </AppText>
      </View>

      <View style={styles.groups}>
        {GROUPS.map((g) => (
          <Card key={g.id} style={styles.group} onPress={() => {}}>
            <View style={styles.groupEmoji}>
              <AppText style={{ fontSize: 26 }}>{g.emoji}</AppText>
            </View>
            <View style={styles.flex}>
              <AppText variant="bodyLarge">{g.name}</AppText>
              <AppText variant="caption" color={colors.textMuted}>
                {g.members} members
              </AppText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Card>
        ))}
      </View>

      <View style={styles.sectionHead}>
        <AppText variant="heading">Friends</AppText>
        <AppText variant="label" color={colors.primary}>
          Add
        </AppText>
      </View>

      <View style={styles.friends}>
        {FRIENDS.map((f) => (
          <Card key={f.id} style={styles.friend}>
            <Avatar name={f.name} size={44} />
            <View style={styles.flex}>
              <AppText variant="label">{f.name}</AppText>
              <AppText variant="caption" color={colors.textMuted}>
                {f.handle}
              </AppText>
            </View>
            <View style={styles.inviteBtn}>
              <AppText variant="label" color={colors.primary}>
                Invite
              </AppText>
            </View>
          </Card>
        ))}
      </View>

      <Button label="Share your invite link" variant="secondary" onPress={() => {}} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: spacing.lg, marginBottom: spacing.lg, gap: spacing.xs },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  groups: { gap: spacing.sm },
  group: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  groupEmoji: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  friends: { gap: spacing.sm, marginBottom: spacing.lg },
  friend: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  inviteBtn: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSunken,
  },
});
