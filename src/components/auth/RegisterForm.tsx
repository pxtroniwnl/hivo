// Port de RegisterForm (hivo-design/auth.jsx:160-239), con medidor de fuerza
// de contraseña (4 segmentos) y checkbox de términos.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Icon } from '@/components/ui';
import { colors, type } from '@/theme';

import { Field } from './Field';
import type { AuthedUser } from './LoginForm';

function pwStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STRENGTH_COLORS: Record<number, string> = {
  1: colors.err,
  2: colors.warn,
  3: '#f5d54a',
  4: colors.ok,
};

export function RegisterForm({ onAuthed }: { onAuthed: (u: AuthedUser) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = pwStrength(pw);

  const submit = () => {
    setError(null);
    if (!name || !email || !pw) {
      setError('All fields required');
      return;
    }
    if (!email.includes('@')) {
      setError('Email must include @');
      return;
    }
    if (pw.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!agree) {
      setError('You must accept the terms');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onAuthed({ name, handle: email.split('@')[0] });
    }, 900);
  };

  return (
    <View style={styles.col}>
      <Field label="Name" value={name} onChange={setName} placeholder="Mara Vidal" />
      <Field
        label="Email"
        keyboardType="email-address"
        value={email}
        onChange={setEmail}
        placeholder="you@gym.com"
      />
      <Field
        label="Password"
        secure={!showPw}
        value={pw}
        onChange={setPw}
        placeholder="At least 8 characters"
        right={
          <Pressable onPress={() => setShowPw((s) => !s)} hitSlop={8}>
            <Text style={styles.showHide}>{showPw ? 'Hide' : 'Show'}</Text>
          </Pressable>
        }
      />

      {/* Strength meter */}
      <View style={styles.meter}>
        {[1, 2, 3, 4].map((n) => (
          <View
            key={n}
            style={[
              styles.meterSeg,
              { backgroundColor: n <= strength ? STRENGTH_COLORS[strength] : colors.bg3 },
            ]}
          />
        ))}
      </View>

      {/* Terms */}
      <View style={styles.terms}>
        <Pressable
          onPress={() => setAgree((a) => !a)}
          style={[styles.checkbox, agree && styles.checkboxOn]}
          hitSlop={6}
        >
          {agree && <Icon.check size={12} color={colors.accentFg} />}
        </Pressable>
        <Text style={[type.sm, styles.termsText]}>
          I agree to the <Text style={styles.termsLink}>Terms</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>.
        </Text>
      </View>

      {error != null && <Text style={[type.sm, styles.error]}>{error}</Text>}
      <Button
        variant="primary"
        block
        disabled={loading}
        onPress={submit}
        style={styles.submit}
        iconRight={<Icon.arrow size={15} color={colors.accentFg} />}
      >
        {loading ? 'Creating account…' : 'Create account'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    gap: 12,
  },
  showHide: {
    fontSize: 11,
    color: colors.fgMute,
  },
  meter: {
    flexDirection: 'row',
    gap: 3,
  },
  meterSeg: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  terms: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  termsText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 11.5 * 1.4,
  },
  termsLink: {
    color: colors.accent,
  },
  error: {
    color: colors.err,
    fontSize: 12,
  },
  submit: {
    marginTop: 4,
  },
});
