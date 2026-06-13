// Tab Stats — port de StatsScreen (other-screens.jsx:794-949).
import { useBottomTabBarHeight } from 'expo-router/build/react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatsScreen } from '@/components/stats/StatsScreen';
import { colors } from '@/theme';

export default function StatsTab() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg0 }}>
      <StatsScreen topPadding={insets.top + 8} bottomPadding={tabBarHeight + 24} />
    </View>
  );
}
