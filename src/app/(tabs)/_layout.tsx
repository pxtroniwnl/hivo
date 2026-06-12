// Tab bar del prototipo (tokens.css:177-195 + app.jsx:143-161):
// glass translúcido, iconos 22px, label 10px, activo en accent.
import { BlurView } from 'expo-blur';
import { Redirect, Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { Icon, type IconProps } from '@/components/ui';
import { useAppState } from '@/state/app-state';
import { colors, fonts } from '@/theme';

function TabBarBackground() {
  // backdrop-filter solo es fiable en iOS; Android usa fondo casi opaco.
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        tint="dark"
        intensity={40}
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,8,10,0.85)' }]}
      />
    );
  }
  return <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,8,10,0.92)' }]} />;
}

const TABS: { name: string; title: string; icon: (p: IconProps) => React.ReactNode }[] = [
  { name: 'index', title: 'Today', icon: Icon.home },
  { name: 'train', title: 'Train', icon: Icon.dumb },
  { name: 'squad', title: 'Squad', icon: Icon.squad },
  { name: 'stats', title: 'Stats', icon: Icon.chart },
  { name: 'profile', title: 'You', icon: Icon.user },
];

export default function TabsLayout() {
  const { gamification, authedUser } = useAppState();
  // Gate de auth, como el prototipo (app.jsx:70-88).
  if (!authedUser) return <Redirect href="/auth" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg0 },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.fgMute,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.line,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 10,
          letterSpacing: 10 * 0.02,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => tab.icon({ size: 22, color: String(color) }),
            // Kill-switch de gamificación (app.jsx:147): sin Squad si está apagado.
            ...(tab.name === 'squad' && !gamification ? { href: null } : null),
          }}
        />
      ))}
    </Tabs>
  );
}
