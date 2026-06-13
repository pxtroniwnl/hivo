// Tab Squad — sin clan muestra el onboarding (clan-onboarding.jsx); con clan,
// la home del clan (raid, misiones, feed). Leave → vuelve al onboarding.
import { useBottomTabBarHeight } from 'expo-router/build/react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClanOnboarding } from '@/components/clan/ClanOnboarding';
import { SquadScreen } from '@/components/squad/SquadScreen';
import { useAppState } from '@/state/app-state';
import { colors } from '@/theme';

export default function SquadTab() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { userClan, setUserClan } = useAppState();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg0 }}>
      {userClan ? (
        <SquadScreen
          clan={userClan}
          onLeave={() => setUserClan(null)}
          topPadding={insets.top + 8}
          bottomPadding={tabBarHeight + 24}
        />
      ) : (
        <ClanOnboarding
          onJoined={setUserClan}
          topPadding={insets.top + 8}
          bottomPadding={tabBarHeight + 24}
        />
      )}
    </View>
  );
}
