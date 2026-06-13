// Tab You — port de ProfileScreen (other-screens.jsx:1245-1360).
import { useBottomTabBarHeight } from 'expo-router/build/react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { colors } from '@/theme';

export default function YouTab() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg0 }}>
      <ProfileScreen topPadding={insets.top + 8} bottomPadding={tabBarHeight + 24} />
    </View>
  );
}
