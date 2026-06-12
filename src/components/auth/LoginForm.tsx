// Port de LoginForm (hivo-design/auth.jsx:117-158).
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Icon } from '@/components/ui';
import { colors, type } from '@/theme';

import { Field } from './Field';

export type AuthedUser = { name: string; handle: string };

export function LoginForm({ onAuthed }: { onAuthed: (u: AuthedUser) => void }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setError(null);
    if (!email || !pw) {
      setError('Email and password required');
      return;
    }
    if (!email.includes('@')) {
      setError('Email must include @');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const name = email
        .split('@')[0]
        .replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      onAuthed({ name, handle: email.split('@')[0] });
    }, 800);
  };

  return (
    <View style={styles.col}>
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
        placeholder="••••••••"
        right={
          <Pressable onPress={() => setShowPw((s) => !s)} hitSlop={8}>
            <Text style={styles.showHide}>{showPw ? 'Hide' : 'Show'}</Text>
          </Pressable>
        }
      />
      {error != null && <Text style={[type.sm, styles.error]}>{error}</Text>}
      <Button
        variant="primary"
        block
        disabled={loading}
        onPress={submit}
        style={styles.submit}
        iconRight={<Icon.arrow size={15} color={colors.accentFg} />}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
      <Pressable style={styles.forgot} hitSlop={8}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </Pressable>
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
  error: {
    color: colors.err,
    fontSize: 12,
  },
  submit: {
    marginTop: 6,
  },
  forgot: {
    alignSelf: 'center',
    marginTop: 4,
  },
  forgotText: {
    fontSize: 12,
    color: colors.fgMid,
  },
});
