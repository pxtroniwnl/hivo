// Editor de Workout — placeholder hasta Task 6 (WorkoutDetail, train.jsx:660+).
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, ScreenHeader } from '@/components/ui';
import { useAppState } from '@/state/app-state';
import { colors, radii } from '@/theme';

export default function WorkoutEditorRoute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { draftWorkout } = useAppState();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <ScreenHeader
        title={draftWorkout?.name ?? 'Workout'}
        subtitle="Editor coming soon"
        right={
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Icon.close size={16} color={colors.fgMid} />
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
