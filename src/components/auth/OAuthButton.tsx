// Port de OAuthButton + AppleIcon/GoogleIcon (hivo-design/auth.jsx:265-301).
// Mock: autentica directo con un usuario demo, igual que el prototipo.
import { Pressable, StyleSheet, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, fonts } from '@/theme';

import type { AuthedUser } from './LoginForm';

function AppleIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={16} height={16} fill="#000">
      <Path d="M17.05 12.74c-.04-3.6 2.94-5.32 3.08-5.41-1.68-2.46-4.3-2.8-5.23-2.83-2.22-.22-4.34 1.31-5.47 1.31-1.15 0-2.88-1.28-4.74-1.25-2.43.04-4.7 1.42-5.95 3.6C-3.78 12.51-1.83 19.04.62 22.66c1.2 1.77 2.61 3.75 4.47 3.68 1.8-.07 2.48-1.16 4.65-1.16 2.15 0 2.77 1.16 4.66 1.12 1.93-.03 3.15-1.79 4.32-3.57.13-.21 2.5-3.42.05-6.99zM13.6 2.93c.99-1.21 1.66-2.88 1.48-4.55-1.43.06-3.16.95-4.18 2.15-.92 1.06-1.72 2.77-1.51 4.4 1.6.13 3.23-.81 4.21-2z" />
    </Svg>
  );
}

function GoogleIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={16} height={16}>
      <Path
        fill="#4285F4"
        d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <Path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z"
      />
      <Path
        fill="#FBBC05"
        d="M5.84 14.1A6.59 6.59 0 015.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 001 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z"
      />
      <Path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.2 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 002.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </Svg>
  );
}

export function OAuthButton({
  kind,
  onAuthed,
}: {
  kind: 'apple' | 'google';
  onAuthed: (u: AuthedUser) => void;
}) {
  const config =
    kind === 'apple'
      ? { label: 'Continue with Apple', icon: <AppleIcon />, bg: '#fff', fg: '#000' }
      : { label: 'Continue with Google', icon: <GoogleIcon />, bg: colors.bg2, fg: colors.fg };
  return (
    <Pressable
      onPress={() => onAuthed({ name: 'Demo User', handle: 'demo' })}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: config.bg },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      {config.icon}
      <Text style={[styles.label, { color: config.fg }]}>{config.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
  },
});
