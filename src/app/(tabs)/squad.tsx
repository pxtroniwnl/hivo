// Tab Squad — sin clan muestra el onboarding (clan-onboarding.jsx); con clan,
// la pantalla del clan (Task 10, placeholder por ahora).
import { useBottomTabBarHeight } from 'expo-router/build/react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClanOnboarding } from '@/components/clan/ClanOnboarding';
import { PlaceholderScreen } from '@/components/ui';
import { useAppState } from '@/state/app-state';
import { colors } from '@/theme';

export default function SquadScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { userClan, setUserClan } = useAppState();

  if (!userClan) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg0 }}>
        <ClanOnboarding
          onJoined={setUserClan}
          topPadding={insets.top + 8}
          bottomPadding={tabBarHeight + 24}
        />
      </View>
    );
  }

  return <PlaceholderScreen title={userClan.name} />;
}
