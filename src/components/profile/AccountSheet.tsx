// Port de AccountSheet (other-screens.jsx:1374-1453): editar nombre/email,
// cambiar contraseña (validación) y cerrar sesión.
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Icon, Sheet } from '@/components/ui';
import { colors, fonts, radii, type } from '@/theme';

import { SheetField } from './SheetField';

type Saved = null | 'profile' | 'password' | 'error';

type AccountSheetProps = {
  name: string;
  handle: string;
  onClose: () => void;
  onSignOut: () => void;
};

export function AccountSheet({ name: initName, handle, onClose, onSignOut }: AccountSheetProps) {
  const [name, setName] = useState(initName);
  const [email, setEmail] = useState(`${handle}@hivo.app`);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [saved, setSaved] = useState<Saved>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = (s: Saved) => {
    setSaved(s);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(null), 2000);
  };

  const saveProfile = () => flash('profile');

  const savePassword = () => {
    if (!pwCurrent || !pwNew || pwNew.length < 8 || pwNew !== pwConfirm) {
      flash('error');
      return;
    }
    setPwCurrent('');
    setPwNew('');
    setPwConfirm('');
    setPwOpen(false);
    flash('password');
  };

  const cancelPw = () => {
    setPwOpen(false);
    setPwCurrent('');
    setPwNew('');
    setPwConfirm('');
  };

  return (
    <Sheet onClose={onClose} title="Account" subtitle="Personal information">
      <View style={{ gap: 14 }}>
        <SheetField label="Name" value={name} onChange={setName} placeholder="Your name" />
        <SheetField label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
        <SheetField label="Handle" value={`@${handle}`} disabled />

        {!pwOpen ? (
          <Pressable onPress={() => setPwOpen(true)} style={styles.pwToggle}>
            <Text style={styles.pwToggleText}>Change password</Text>
            <Icon.arrow size={14} color={colors.fgMute} />
          </Pressable>
        ) : (
          <View style={styles.pwBox}>
            <View style={styles.pwHeader}>
              <Text style={[type.h3, { fontSize: 13 }]}>Change password</Text>
              <Pressable onPress={cancelPw}>
                <Text style={styles.cancel}>Cancel</Text>
              </Pressable>
            </View>
            <SheetField label="Current password" type="password" value={pwCurrent} onChange={setPwCurrent} inline />
            <SheetField
              label="New password"
              type="password"
              value={pwNew}
              onChange={setPwNew}
              inline
              help="At least 8 characters"
            />
            <SheetField label="Confirm" type="password" value={pwConfirm} onChange={setPwConfirm} inline />
            <Button variant="primary" block onPress={savePassword} style={{ marginTop: 4 }}>
              Update password
            </Button>
          </View>
        )}

        {saved === 'error' ? (
          <Text style={styles.errText}>
            Check the password fields — at least 8 chars and both must match.
          </Text>
        ) : null}
        {saved === 'profile' ? <Text style={styles.okText}>✓ Profile updated</Text> : null}
        {saved === 'password' ? <Text style={styles.okText}>✓ Password changed</Text> : null}

        <Button variant="primary" block onPress={saveProfile} style={{ marginTop: 4 }}>
          Save changes
        </Button>

        <Pressable onPress={onSignOut} style={styles.signOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  pwToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  pwToggleText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.fg },
  pwBox: {
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    gap: 10,
  },
  pwHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cancel: { fontFamily: fonts.sans, fontSize: 12, color: colors.fgMute },
  errText: { fontFamily: fonts.sans, fontSize: 12, color: colors.err },
  okText: { fontFamily: fonts.sans, fontSize: 12, color: colors.ok },
  signOut: { paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  signOutText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.fgMute,
    textDecorationLine: 'underline',
  },
});
