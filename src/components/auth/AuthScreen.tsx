// Port de AuthScreen (hivo-design/auth.jsx:4-97): hero con glow + watermark,
// segmented Sign in / Create account, formulario, OAuth y skip demo.
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, type } from '@/theme';

import { HivoMark } from './HivoMark';
import { LoginForm, type AuthedUser } from './LoginForm';
import { OAuthButton } from './OAuthButton';
import { RegisterForm } from './RegisterForm';

const TABS = [
  { id: 'login' as const, label: 'Sign in' },
  { id: 'register' as const, label: 'Create account' },
];

export function AuthScreen({ onAuthed }: { onAuthed: (u: AuthedUser) => void }) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      {/* Glow superior (proto: blur 80px — aproximado con círculo accent 0.15,
          mismo criterio que TodayHero). */}
      <View style={styles.glow} pointerEvents="none" />
      {/* Watermark del logo (animación float del proto omitida: decorativa). */}
      <Image
        source={require('../../../assets/images/hivo-mark.png')}
        style={styles.watermark}
      />

      {/* Logo + hero */}
      <View style={styles.hero}>
        <HivoMark />
        <Text style={[type.display, styles.heroTitle]}>
          Train hard.{'\n'}
          <Text style={{ color: colors.accent }}>Together.</Text>
        </Text>
        <Text style={[type.sm, styles.heroSub]}>
          A strength training app with adaptive coaching and clans that lift with you.
        </Text>
      </View>

      {/* Segmented login/register */}
      <View style={styles.tabsWrap}>
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setMode(t.id)}
              style={[styles.tab, mode === t.id && styles.tabOn]}
            >
              <Text style={[styles.tabLabel, mode === t.id && styles.tabLabelOn]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.formWrap}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.form, { paddingBottom: insets.bottom + 24 }]}
        >
          {mode === 'login' ? <LoginForm onAuthed={onAuthed} /> : <RegisterForm onAuthed={onAuthed} />}

          {/* OR divider */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={[type.xs, styles.orLabel]}>OR</Text>
            <View style={styles.orLine} />
          </View>
          <View style={styles.oauthCol}>
            <OAuthButton kind="apple" onAuthed={onAuthed} />
            <OAuthButton kind="google" onAuthed={onAuthed} />
          </View>

          {/* Skip */}
          <Pressable onPress={() => onAuthed({ name: 'Demo User', handle: 'demo' })} hitSlop={8}>
            <Text style={styles.skip}>Skip — try the demo</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg0,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -100,
    alignSelf: 'center',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: colors.accent,
    opacity: 0.15,
  },
  watermark: {
    position: 'absolute',
    top: 230,
    right: -90,
    width: 320,
    height: 320,
    opacity: 0.06,
    pointerEvents: 'none',
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  heroTitle: {
    marginTop: 28,
    fontSize: 36,
    lineHeight: 36 * 1.02,
  },
  heroSub: {
    marginTop: 10,
    maxWidth: 280,
  },
  tabsWrap: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderRadius: 12,
    padding: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabOn: {
    backgroundColor: colors.bg3,
  },
  tabLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.fgMute,
  },
  tabLabelOn: {
    color: colors.fg,
  },
  formWrap: {
    flex: 1,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  orRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
  },
  orLabel: {
    fontSize: 10,
  },
  oauthCol: {
    marginTop: 14,
    gap: 8,
  },
  skip: {
    marginTop: 22,
    paddingVertical: 12,
    textAlign: 'center',
    fontSize: 12,
    color: colors.fgMute,
    textDecorationLine: 'underline',
  },
});
