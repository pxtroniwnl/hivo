// Port de CreateClanSheet + FieldC (clan-onboarding.jsx:402-530): preview con
// tag/ID en vivo, formulario (nombre, descripción, color, privacidad) y CTA.
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, Icon, Segmented, Sheet } from '@/components/ui';
import { CLAN_COLORS, makeClanId } from '@/data/discover-clans';
import type { Clan } from '@/data/types';
import { colors, fonts, radii, type } from '@/theme';

import { ClanGlyph } from './ClanGlyph';

const SHEET_WIDTH = Dimensions.get('window').width - 36;

type CreateClanSheetProps = {
  onClose: () => void;
  onCreate: (clan: Clan) => void;
};

export function CreateClanSheet({ onClose, onCreate }: CreateClanSheetProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colorIdx, setColorIdx] = useState(0);
  const [privacy, setPrivacy] = useState<'open' | 'invite'>('open');

  const tag = (name.trim().slice(0, 3) || 'NEW').toUpperCase();
  const id = makeClanId(name);
  const canCreate = name.trim().length >= 3;

  const create = () => {
    onCreate({
      id,
      name: name.trim(),
      tag,
      members: 1,
      max: 8,
      rank: 'Bronze',
      rankProgress: 0,
      week: 'Week 1 · founding',
      online: 1,
      color: CLAN_COLORS[colorIdx],
      description,
      raid: {
        name: 'First Raid · Choose target',
        target: 10000,
        current: 0,
        unit: 'kg',
        daysLeft: 7,
        contributions: [{ name: 'You', value: 0, you: true }],
      },
      missions: [
        {
          id: 'm1',
          title: 'Onboard the founders',
          subtitle: 'Invite at least 1 friend this week',
          progress: 0,
          members: 0,
        },
      ],
      isFounder: true,
    });
  };

  return (
    <Sheet onClose={onClose} title="Create a clan" subtitle="You'll be the founder">
      {/* Preview banner */}
      <ClanGlyph color={CLAN_COLORS[colorIdx]} width={SHEET_WIDTH} height={90} radius={14} style={styles.banner}>
        <Text style={styles.bannerTag}>{tag}</Text>
        <Text style={styles.bannerId}>{id}</Text>
      </ClanGlyph>

      {/* Form */}
      <View style={styles.form}>
        <FieldC label="Clan name" value={name} onChange={setName} placeholder="e.g. Bench Brigade" max={24} />
        <FieldC
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="What is your clan about? (optional)"
          multi
        />

        {/* Color */}
        <View>
          <Text style={[type.xs, styles.fieldLabel]}>Color</Text>
          <View style={styles.colorRow}>
            {CLAN_COLORS.map((c, i) => (
              <Pressable key={i} onPress={() => setColorIdx(i)} style={styles.swatchWrap}>
                <ClanGlyph
                  color={c}
                  width={32}
                  height={32}
                  radius={8}
                  style={i === colorIdx ? styles.swatchActive : styles.swatch}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Privacy */}
        <View>
          <Text style={[type.xs, styles.fieldLabel]}>Joining</Text>
          <Segmented
            options={[
              { id: 'open', label: 'Open · approve' },
              { id: 'invite', label: 'Invite only' },
            ]}
            value={privacy}
            onChange={(id) => setPrivacy(id as 'open' | 'invite')}
          />
        </View>
      </View>

      <Button
        variant="primary"
        block
        disabled={!canCreate}
        onPress={create}
        style={[styles.createBtn, !canCreate && { opacity: 0.4 }]}
        iconRight={<Icon.arrow size={15} color={colors.accentFg} />}
      >
        Create clan
      </Button>
      <Text style={styles.footnote}>You&apos;ll be able to invite friends after creating.</Text>
    </Sheet>
  );
}

function FieldC({
  label,
  value,
  onChange,
  placeholder,
  multi,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  multi?: boolean;
  max?: number;
}) {
  return (
    <View>
      <View style={styles.fieldHeader}>
        <Text style={[type.xs, styles.fieldLabel, { marginBottom: 0 }]}>{label}</Text>
        {max ? (
          <Text style={styles.counter}>
            {value.length}/{max}
          </Text>
        ) : null}
      </View>
      <TextInput
        value={value}
        onChangeText={(t) => onChange(max ? t.slice(0, max) : t)}
        placeholder={placeholder}
        placeholderTextColor={colors.fgDim}
        multiline={multi}
        style={[styles.input, multi && styles.inputMulti]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { marginBottom: 14 },
  bannerTag: { fontFamily: fonts.sansSemiBold, fontSize: 36, letterSpacing: -0.72, color: '#fff' },
  bannerId: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
  },
  form: { gap: 12 },
  fieldHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  fieldLabel: { fontSize: 10, marginBottom: 8 },
  counter: { fontFamily: fonts.mono, fontSize: 10, color: colors.fgMute },
  input: {
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    color: colors.fg,
    fontFamily: fonts.sans,
    fontSize: 14,
  },
  inputMulti: { minHeight: 60, textAlignVertical: 'top' },
  colorRow: { flexDirection: 'row', gap: 6 },
  swatchWrap: { borderRadius: 8 },
  swatch: { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 8 },
  swatchActive: { borderWidth: 2, borderColor: colors.fg, borderRadius: 8 },
  createBtn: { marginTop: 18 },
  footnote: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.fgMute,
    textAlign: 'center',
    marginTop: 8,
  },
});
