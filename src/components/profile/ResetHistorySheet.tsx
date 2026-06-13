// Port de ResetHistorySheet (other-screens.jsx:1639-1719): confirmación
// destructiva — hay que teclear "RESET". Estado `done` muestra el éxito.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, Icon, Sheet } from '@/components/ui';
import { USER } from '@/data/mock';
import { colors, fonts, radii, type } from '@/theme';

const PHRASE = 'RESET';

type ResetHistorySheetProps = {
  done: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ResetHistorySheet({ done, onConfirm, onClose }: ResetHistorySheetProps) {
  const [confirm, setConfirm] = useState('');
  const canReset = confirm === PHRASE;

  if (done) {
    return (
      <Sheet onClose={onClose} title="History cleared" subtitle="Your account is fresh">
        <View style={styles.doneWrap}>
          <View style={styles.doneIcon}>
            <Icon.check size={30} color={colors.accent} />
          </View>
          <Text style={type.h2}>All clear</Text>
          <Text style={[type.sm, styles.doneText]}>
            All workouts, PRs, body measurements and streak progress have been deleted.
          </Text>
        </View>
        <Button variant="primary" block onPress={onClose} style={{ marginTop: 16 }}>
          Done
        </Button>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose} title="Reset all history" subtitle="This action cannot be undone">
      <View style={styles.warnBox}>
        <Icon.warn size={16} color={colors.err} />
        <View style={{ flex: 1 }}>
          <Text style={styles.warnLead}>You&apos;re about to delete:</Text>
          {[
            'All logged workouts (312)',
            'All PRs and 1RM records',
            'Body measurements and progress photos',
            `Streak (${USER.streak} days) and earned shields`,
          ].map((item) => (
            <Text key={item} style={styles.bullet}>
              • {item}
            </Text>
          ))}
          <Text style={styles.warnKeep}>Your account, routines and clan membership stay intact.</Text>
        </View>
      </View>

      <Text style={styles.confirmLabel}>
        Type <Text style={styles.phrase}>{PHRASE}</Text> to confirm
      </Text>
      <TextInput
        value={confirm}
        onChangeText={(t) => setConfirm(t.toUpperCase())}
        placeholder="Type RESET"
        placeholderTextColor={colors.fgDim}
        autoCapitalize="characters"
        autoCorrect={false}
        style={[styles.input, { borderColor: canReset ? colors.err : colors.line, color: canReset ? colors.err : colors.fg }]}
      />

      <View style={styles.actions}>
        <Button style={{ flex: 1, backgroundColor: colors.bg3 }} onPress={onClose}>
          Cancel
        </Button>
        <Pressable
          onPress={onConfirm}
          disabled={!canReset}
          style={[styles.resetBtn, { backgroundColor: canReset ? colors.err : colors.bg3 }]}
        >
          <Text style={[styles.resetText, { color: canReset ? '#fff' : colors.fgDim }]}>Reset history</Text>
        </Pressable>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  doneWrap: { alignItems: 'center', paddingVertical: 20 },
  doneIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  doneText: { marginTop: 6, maxWidth: 260, textAlign: 'center' },
  warnBox: {
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255,107,107,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,107,107,0.3)',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  warnLead: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.fg, lineHeight: 19 },
  bullet: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.fgMid, lineHeight: 19, marginTop: 2 },
  warnKeep: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.fg, marginTop: 8, lineHeight: 19 },
  confirmLabel: { fontFamily: fonts.sans, fontSize: 12, color: colors.fgMid, marginBottom: 8 },
  phrase: { fontFamily: fonts.monoSemiBold, color: colors.err },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    fontFamily: fonts.monoSemiBold,
    fontSize: 14,
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  actions: { flexDirection: 'row', gap: 8, marginTop: 16 },
  resetBtn: { flex: 1, paddingVertical: 14, paddingHorizontal: 16, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  resetText: { fontFamily: fonts.sansSemiBold, fontSize: 15 },
});
