// Editor de Routine — placeholder hasta Task 5 (RoutineDetail, train.jsx:972+).
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, ScreenHeader } from '@/components/ui';
import { useAppState } from '@/state/app-state';
import { colors, radii } from '@/theme';

export default function RoutineEditorRoute() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { draftRoutine } = useAppState();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <ScreenHeader
        title={draftRoutine?.name ?? 'Routine'}
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
