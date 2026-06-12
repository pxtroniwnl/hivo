// Port de ShareSheet + ShareTarget (train.jsx:1420-1622): link compartible,
// quick-share mock y vista previa como receptor con "Copy to my ...".
// El copy al portapapeles es mock (sin expo-clipboard): solo feedback visual.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Icon, Sheet } from '@/components/ui';
import type { Routine, Workout } from '@/data/types';
import { colors, fonts, radii, type } from '@/theme';

import { GradientTile } from './GradientTile';
import { KindBadge, LevelChip, WorkoutGlyph } from './badges';

type ShareItem =
  | { kind: 'routine'; item: Routine }
  | { kind: 'workout'; item: Workout };

type ShareSheetProps = ShareItem & { onClose: () => void };

function LinkGlyph() {
  return (
    <Svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={colors.fgMute} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1.5 1.5" />
      <Path d="M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1.5-1.5" />
    </Svg>
  );
}

function EyeGlyph() {
  return (
    <Svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={colors.fg} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z" />
      <Circle cx={12} cy={12} r={3} />
    </Svg>
  );
}

const TARGET_ICONS: Record<string, React.ReactElement> = {
  Messages: (
    <Svg viewBox="0 0 24 24" width={18} height={18} fill={colors.accent}>
      <Path d="M12 3C6.5 3 2 6.5 2 11c0 2.5 1.5 4.7 4 6L4 22l5-3c1 .2 2 .3 3 .3 5.5 0 10-3.5 10-8.3S17.5 3 12 3z" />
    </Svg>
  ),
  WhatsApp: (
    <Svg viewBox="0 0 24 24" width={18} height={18}>
      <Path d="M20 12a8 8 0 00-13.6-5.7A8 8 0 003.3 17l-1 4 4-1A8 8 0 0020 12z" stroke={colors.accent} strokeWidth={1.6} fill="none" />
      <Path d="M9 9c.3-.7 1-.8 1.5-.5L11 9c.3.3.2.7 0 1l-.5.7a5 5 0 002.8 2.8l.7-.5c.3-.2.7-.3 1 0l.5.5c.3.5.2 1.2-.5 1.5-1.5.7-3.5 0-5-1.5S8.3 10.5 9 9z" fill={colors.accent} />
    </Svg>
  ),
  Email: (
    <Svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={colors.accent} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={5} width={18} height={14} rx={2} />
      <Path d="M3 7l9 6 9-6" />
    </Svg>
  ),
  Twitter: (
    <Svg viewBox="0 0 24 24" width={18} height={18} fill={colors.accent}>
      <Path d="M18 4h3l-7 8 8 8h-6l-5-6-5 6H3l7-9-7-7h6l4 5 5-5z" />
    </Svg>
  ),
  Instagram: (
    <Svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={colors.accent} strokeWidth={1.6}>
      <Rect x={3} y={3} width={18} height={18} rx={5} />
      <Circle cx={12} cy={12} r={4} />
      <Circle cx={17.5} cy={6.5} r={1} fill={colors.accent} />
    </Svg>
  ),
};

function ShareTarget({ label }: { label: string }) {
  return (
    <Pressable style={({ pressed }) => [styles.target, pressed && styles.pressed]}>
      <View>{TARGET_ICONS[label] ?? <Icon.more size={18} color={colors.accent} />}</View>
      <Text style={styles.targetLabel}>{label}</Text>
    </Pressable>
  );
}

export function ShareSheet({ item, kind, onClose }: ShareSheetProps) {
  const isWorkout = kind === 'workout';
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'share' | 'recipient'>('share');
  const [importedAs, setImportedAs] = useState<string | null>(null);

  const slug = (item.id || 'x-1').replace(/^[rw]-/, '');
  const url = `https://hivo.app/${isWorkout ? 'w' : 'r'}/${slug}`;

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (mode === 'recipient') {
    return (
      <Sheet
        onClose={() => {
          setMode('share');
          setImportedAs(null);
        }}
        title="Preview as recipient"
        subtitle={url}
      >
        <View style={styles.senderRow}>
          <View style={styles.senderAvatar}>
            <Text style={styles.senderInitial}>{(item.author || 'A')[0].toUpperCase()}</Text>
          </View>
          <View style={styles.flex1}>
            <Text style={styles.senderText}>
              <Text style={styles.senderName}>{item.author}</Text>
              <Text style={{ color: colors.fgMute }}> shared a {kind}</Text>
            </Text>
            <Text style={styles.senderUrl}>{url}</Text>
          </View>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.badges}>
            <KindBadge kind={kind} />
            <LevelChip level={item.level} />
          </View>
          <Text style={type.h2}>{item.name}</Text>
          <Text style={[type.sm, { marginTop: 4 }]}>
            by {item.author} ·{' '}
            {isWorkout
              ? `${(item as Workout).days.length} days · ${(item as Workout).duration || '—'}`
              : `${(item as Routine).exercises.length} exercises`}
          </Text>
          {!!item.description && <Text style={[type.sm, styles.previewDesc]}>{item.description}</Text>}
          <View style={styles.divider} />
          <View style={styles.previewList}>
            {isWorkout
              ? (item as Workout).days.map((d, i) => (
                  <View key={i} style={styles.previewRow}>
                    <View style={styles.dayChip}>
                      <Text style={styles.dayChipText}>{d.day.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.previewName}>{d.name}</Text>
                  </View>
                ))
              : (item as Routine).exercises.map((ex, i) => (
                  <View key={i} style={styles.previewRow}>
                    <Text style={styles.previewIdx}>{i + 1}</Text>
                    <Text style={styles.previewName}>{ex.name}</Text>
                    <Text style={styles.previewSets}>
                      {ex.sets}×{ex.reps}
                    </Text>
                  </View>
                ))}
          </View>
        </View>

        <View style={{ marginTop: 14 }}>
          {importedAs != null ? (
            <View style={styles.importedCard}>
              <View style={styles.importedIcon}>
                <Icon.check size={18} color={colors.accent} />
              </View>
              <Text style={[type.h3, { fontSize: 14 }]}>
                Added to My {isWorkout ? 'Workouts' : 'Routines'}
              </Text>
              <Text style={[type.sm, { marginTop: 4 }]}>Saved as &ldquo;{importedAs}&rdquo;</Text>
            </View>
          ) : (
            <>
              <Pressable
                onPress={() => setImportedAs(item.name)}
                style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
              >
                <Icon.plus size={14} color={colors.accentFg} />
                <Text style={styles.primaryText}>
                  Copy to my {isWorkout ? 'workouts' : 'routines'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setMode('share')}
                style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
              >
                <Text style={styles.secondaryText}>Back to share</Text>
              </Pressable>
            </>
          )}
        </View>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose} title={`Share ${kind}`} subtitle={item.name}>
      {/* Card del item */}
      <View style={styles.itemCard}>
        <View style={styles.itemGlow} />
        <GradientTile size={50} radius={13}>
          {isWorkout ? (
            <WorkoutGlyph size={22} color={colors.accentFg} />
          ) : (
            <Icon.dumb size={22} color={colors.accentFg} />
          )}
        </GradientTile>
        <View style={styles.flex1}>
          <View style={styles.badges}>
            <KindBadge kind={kind} />
            <LevelChip level={item.level} />
          </View>
          <Text style={[type.h3, { fontSize: 15 }]}>{item.name}</Text>
        </View>
      </View>

      <Text style={[type.xs, { marginBottom: 8 }]}>Shareable link</Text>
      <View style={styles.linkRow}>
        <LinkGlyph />
        <Text style={styles.linkText} numberOfLines={1}>
          {url}
        </Text>
        <Pressable
          onPress={copyLink}
          style={[styles.copyBtn, copied && { backgroundColor: colors.accentSoft }]}
        >
          {copied && <Icon.check size={12} color={colors.accent} />}
          <Text style={[styles.copyText, copied && { color: colors.accent }]}>
            {copied ? 'Copied' : 'Copy'}
          </Text>
        </Pressable>
      </View>

      <Text style={[type.sm, styles.linkHint]}>
        Anyone with the link can preview the {kind} and copy it to their own{' '}
        {isWorkout ? 'workouts' : 'routines'}.
      </Text>

      <Text style={[type.xs, styles.quickShareLabel]}>Quick share</Text>
      <View style={styles.targets}>
        {['Messages', 'WhatsApp', 'Email', 'Twitter', 'Instagram', 'More'].map((t) => (
          <ShareTarget key={t} label={t} />
        ))}
      </View>

      <View style={styles.divider} />

      <Pressable
        onPress={() => setMode('recipient')}
        style={({ pressed }) => [styles.secondaryBtn, { marginTop: 0 }, pressed && styles.pressed]}
      >
        <EyeGlyph />
        <Text style={styles.secondaryText}>Preview as recipient</Text>
      </Pressable>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
    marginVertical: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    marginBottom: 14,
    overflow: 'hidden',
  },
  itemGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent,
    opacity: 0.18,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  linkText: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 12.5,
    color: colors.fg,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.bg2,
  },
  copyText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.fg,
  },
  linkHint: {
    marginTop: 8,
    fontSize: 11.5,
    color: colors.fgMute,
  },
  quickShareLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
  targets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  target: {
    width: '31%',
    flexGrow: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
    gap: 6,
  },
  targetLabel: {
    fontSize: 10,
    color: colors.fg,
    fontFamily: fonts.sansMedium,
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    marginBottom: 14,
  },
  senderAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accentDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderInitial: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    color: colors.accentFg,
  },
  senderText: {
    fontSize: 12.5,
    color: colors.fg,
    fontFamily: fonts.sans,
  },
  senderName: {
    fontFamily: fonts.sansSemiBold,
  },
  senderUrl: {
    marginTop: 2,
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.fgMute,
  },
  previewCard: {
    padding: 16,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
  },
  previewDesc: {
    marginTop: 10,
    fontSize: 12.5,
    color: colors.fgMid,
    lineHeight: 12.5 * 1.45,
  },
  previewList: {
    gap: 6,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dayChip: {
    width: 30,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    letterSpacing: 10 * 0.05,
    color: colors.fgMute,
  },
  previewIdx: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.fgMute,
    minWidth: 16,
  },
  previewName: {
    flex: 1,
    fontSize: 12.5,
    color: colors.fg,
    fontFamily: fonts.sans,
  },
  previewSets: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.fgMute,
    fontVariant: ['tabular-nums'],
  },
  importedCard: {
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    alignItems: 'center',
  },
  importedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
  },
  primaryText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.accentFg,
  },
  secondaryBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
  },
  secondaryText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.fg,
  },
});
