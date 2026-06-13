// Port de ProfileScreen (other-screens.jsx:1245-1360): identidad, mini stats,
// body, settings y reset destructivo. Añade el kill-switch de gamificación
// (CLAUDE.md: única personalización que sobrevive) — apagarlo oculta el tab
// Squad (vía context en (tabs)/_layout) y el streak/clan en Home.
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Avatar, Card, Chip, Icon, ScreenHeader } from '@/components/ui';
import { USER } from '@/data/mock';
import { useAppState } from '@/state/app-state';
import { colors, fonts, radii, screenInset, type } from '@/theme';

import { AccountSheet } from './AccountSheet';
import { DataExportSheet } from './DataExportSheet';
import { MiniStat } from './MiniStat';
import { ResetHistorySheet } from './ResetHistorySheet';

function ExportGlyph() {
  return (
    <Svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={colors.accent} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3v13M8 12l4 4 4-4M5 21h14" />
    </Svg>
  );
}

function TrashGlyph() {
  return (
    <Svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={colors.err} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14M10 11v6M14 11v6" />
    </Svg>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <View style={[styles.track, on && styles.trackOn]}>
      <View style={[styles.knob, on && styles.knobOn]} />
    </View>
  );
}

type ProfileScreenProps = { topPadding?: number; bottomPadding?: number };

export function ProfileScreen({ topPadding = 8, bottomPadding = 24 }: ProfileScreenProps) {
  const { authedUser, setAuthedUser, gamification, setGamification } = useAppState();
  const [accountOpen, setAccountOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const name = authedUser?.name ?? USER.name;
  const handle = authedUser?.handle ?? USER.handle;

  const settingsRows = [
    {
      label: 'Account',
      sub: `${name} · @${handle}`,
      icon: <Icon.user size={16} color={colors.accent} />,
      onPress: () => setAccountOpen(true),
    },
    {
      label: 'My data',
      sub: 'Export your workouts as CSV',
      icon: <ExportGlyph />,
      onPress: () => setDataOpen(true),
    },
    {
      label: 'Privacy & accessibility',
      sub: 'VoiceOver tested',
      icon: <Icon.shield size={16} color={colors.accent} />,
      onPress: () => {},
    },
  ];

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="You"
          right={
            <Pressable onPress={() => setAccountOpen(true)} style={styles.headerBtn}>
              <Icon.more size={18} color={colors.fgMid} />
            </Pressable>
          }
        />

        {/* Identidad */}
        <View style={styles.section}>
          <Card variant="elev" style={styles.identity}>
            <Avatar name={name} size={56} color={colors.accentDeep} />
            <View style={{ flex: 1 }}>
              <Text style={type.h2}>{name}</Text>
              <Text style={[type.sm, { marginTop: 2 }]}>
                @{handle} · {USER.gym}
              </Text>
              {gamification ? (
                <View style={styles.chips}>
                  <Chip variant="acc">Lv {USER.level}</Chip>
                  <Chip>{USER.rank}</Chip>
                </View>
              ) : null}
            </View>
          </Card>
        </View>

        {/* Mini stats */}
        <View style={[styles.section, styles.statRow]}>
          <MiniStat value="312" label="Workouts" />
          <MiniStat value={USER.streak} label="Streak" />
          <MiniStat value="27" label="PRs" />
        </View>

        {/* Body */}
        <View style={[styles.section, styles.topGap]}>
          <Text style={[type.xs, styles.label]}>Body</Text>
          <Card padding={16}>
            <View style={styles.bodyRow}>
              <View>
                <Text style={styles.bw}>
                  {USER.bodyweight}
                  <Text style={styles.bwUnit}> kg</Text>
                </Text>
                <Text style={[type.sm, { marginTop: 2 }]}>−0.4 kg this month · 14.2% BF</Text>
              </View>
              <Svg width={120} height={40} viewBox="0 0 120 40" preserveAspectRatio="none">
                <Path
                  d="M0 28 L20 26 L40 24 L60 25 L80 22 L100 20 L120 18"
                  fill="none"
                  stroke={colors.accent}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          </Card>
        </View>

        {/* Settings */}
        <View style={[styles.section, styles.topGap]}>
          <Text style={[type.xs, styles.label]}>Settings</Text>
          <Card padding={0} style={{ overflow: 'hidden' }}>
            {settingsRows.map((row, i) => (
              <Pressable
                key={row.label}
                onPress={row.onPress}
                style={[styles.settingRow, i < settingsRows.length - 1 && styles.settingBorder]}
              >
                <View style={styles.settingIcon}>{row.icon}</View>
                <View style={{ flex: 1 }}>
                  <Text style={[type.h3, { fontSize: 14 }]}>{row.label}</Text>
                  <Text style={[type.sm, { marginTop: 2 }]}>{row.sub}</Text>
                </View>
                <Icon.arrow size={14} color={colors.fgMute} />
              </Pressable>
            ))}
          </Card>
        </View>

        {/* Kill-switch de gamificación */}
        <View style={[styles.section, styles.topGap]}>
          <Text style={[type.xs, styles.label]}>Cooperative gamification</Text>
          <Pressable onPress={() => setGamification(!gamification)} style={styles.gamRow}>
            <View style={styles.settingIcon}>
              <Icon.trophy size={16} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.h3, { fontSize: 14 }]}>Clans, streaks & raids</Text>
              <Text style={[type.sm, { marginTop: 2 }]}>
                {gamification ? 'On — Squad, streak and ranks visible' : 'Off — hidden across the app'}
              </Text>
            </View>
            <Toggle on={gamification} />
          </Pressable>
        </View>

        {/* Reset destructivo */}
        <View style={[styles.section, { paddingTop: 14 }]}>
          <Pressable onPress={() => setResetOpen(true)} style={styles.resetCta}>
            <View style={styles.resetIcon}>
              <TrashGlyph />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.h3, { fontSize: 14, color: colors.err }]}>Reset all history</Text>
              <Text style={[type.sm, { marginTop: 2 }]}>Delete all logged workouts, PRs and stats</Text>
            </View>
            <Icon.arrow size={14} color={colors.err} />
          </Pressable>
        </View>
      </ScrollView>

      {accountOpen ? (
        <AccountSheet
          name={name}
          handle={handle}
          onClose={() => setAccountOpen(false)}
          onSignOut={() => {
            setAccountOpen(false);
            setAuthedUser(null);
          }}
        />
      ) : null}
      {dataOpen ? <DataExportSheet onClose={() => setDataOpen(false)} /> : null}
      {resetOpen ? (
        <ResetHistorySheet
          done={resetDone}
          onConfirm={() => setResetDone(true)}
          onClose={() => {
            setResetOpen(false);
            setResetDone(false);
          }}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { paddingHorizontal: screenInset },
  topGap: { paddingTop: 20 },
  label: { marginBottom: 10 },
  identity: { padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  chips: { flexDirection: 'row', gap: 6, marginTop: 8 },
  statRow: { flexDirection: 'row', gap: 8, paddingTop: 14 },
  bodyRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  bw: { ...type.mono, fontFamily: fonts.monoSemiBold, fontSize: 32, color: colors.fg, letterSpacing: -0.96 },
  bwUnit: { fontSize: 16, color: colors.fgMute },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  settingBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.xs,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.bg4,
    padding: 3,
    justifyContent: 'center',
  },
  trackOn: { backgroundColor: colors.accent },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.fg },
  knobOn: { backgroundColor: colors.accentFg, alignSelf: 'flex-end' },
  resetCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,107,107,0.25)',
  },
  resetIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.xs,
    backgroundColor: 'rgba(255,107,107,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
