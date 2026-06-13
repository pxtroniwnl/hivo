// Port de StatsScreen (other-screens.jsx:794-949): AI Coach feedback, volumen
// por músculo, PRs recientes, peso corporal, strength map personal y resumen.
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BodyHeatmap, HeatmapLegend } from '@/components/body/BodyHeatmap';
import { Card, Chip, Icon, ScreenHeader } from '@/components/ui';
import { BODYWEIGHT_SERIES, PERSONAL_BODY } from '@/data/body-stats';
import { USER } from '@/data/mock';
import { colors, fonts, radii, screenInset, type } from '@/theme';

import { AICoachFeedbackSheet } from './AICoachFeedbackSheet';
import { BodyweightChart } from './BodyweightChart';
import { MuscleHeatmap } from './MuscleHeatmap';
import { SparklesIcon } from './SparklesIcon';
import { SummaryStat } from './SummaryStat';

const RECENT_PRS = [
  { exercise: 'Deadlift', value: '180 kg', sub: '× 3', delta: '+5 kg' },
  { exercise: 'Bench', value: '92.5 kg', sub: '× 5', delta: '+2.5 kg' },
  { exercise: 'Squat', value: '140 kg', sub: '× 4', delta: '+5 kg' },
];

const RANGES = ['1M', '3M', '6M', '1Y'];

type StatsScreenProps = { topPadding?: number; bottomPadding?: number };

export function StatsScreen({ topPadding = 8, bottomPadding = 24 }: StatsScreenProps) {
  const [coachOpen, setCoachOpen] = useState(false);

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Progress"
          subtitle="Last 12 weeks"
          right={
            <Pressable style={styles.headerBtn}>
              <Icon.swap size={16} color={colors.fgMid} />
            </Pressable>
          }
        />

        {/* AI Coach feedback */}
        <View style={styles.section}>
          <Pressable
            onPress={() => setCoachOpen(true)}
            style={({ pressed }) => [styles.coachCard, pressed && { transform: [{ scale: 0.99 }] }]}
          >
            <View style={styles.coachGlow} />
            <View style={styles.coachIcon}>
              <SparklesIcon size={20} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={styles.coachTitleRow}>
                <Text style={[type.h3, { fontSize: 15 }]}>AI Coach feedback</Text>
                <Chip variant="acc" textStyle={{ fontSize: 9.5 }}>
                  Insights
                </Chip>
              </View>
              <Text style={[type.sm, { marginTop: 3, fontSize: 12 }]}>
                Get a personalized analysis of your last 12 weeks.
              </Text>
            </View>
            <Icon.arrow size={18} color={colors.fgMute} />
          </Pressable>
        </View>

        {/* Volume per muscle heatmap */}
        <View style={styles.section}>
          <Card padding={16}>
            <View style={styles.cardHeader}>
              <Text style={type.h3}>Volume · weekly</Text>
              <Text style={[type.sm, { color: colors.fgMute }]}>kg × reps</Text>
            </View>
            <MuscleHeatmap />
            <View style={styles.note}>
              <Icon.warn size={14} color={colors.warn} />
              <Text style={styles.noteText}>
                Posterior chain volume is <Text style={styles.warnBold}>32% below</Text> anterior — add a
                hamstring or back set this week.
              </Text>
            </View>
          </Card>
        </View>

        {/* Recent PRs */}
        <View style={styles.sectionNoPadBottom}>
          <Text style={[type.xs, styles.prLabel]}>Recent PRs</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.prRow}
        >
          {RECENT_PRS.map((p) => (
            <View key={p.exercise} style={styles.prCard}>
              <Text style={type.xs}>{p.exercise}</Text>
              <Text style={styles.prValue}>{p.value}</Text>
              <Text style={[type.sm, { marginTop: 2 }]}>{p.sub}</Text>
              <Chip variant="acc" style={{ marginTop: 8 }} textStyle={{ fontSize: 10 }}>
                {p.delta}
              </Chip>
            </View>
          ))}
        </ScrollView>

        {/* Bodyweight trend */}
        <View style={[styles.section, styles.topGap]}>
          <Card padding={16}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={type.h3}>Body weight</Text>
                <Text style={[type.sm, { marginTop: 2 }]}>
                  {USER.bodyweight} kg <Text style={{ color: colors.accent }}>−1.1 kg</Text>
                </Text>
              </View>
              <View style={styles.ranges}>
                {RANGES.map((r) => {
                  const active = r === '3M';
                  return (
                    <Text key={r} style={[styles.range, active && styles.rangeActive]}>
                      {r}
                    </Text>
                  );
                })}
              </View>
            </View>
            <BodyweightChart data={BODYWEIGHT_SERIES} />
          </Card>
        </View>

        {/* Personal strength map */}
        <View style={styles.section}>
          <Card padding={16}>
            <View style={styles.cardHeaderSm}>
              <Text style={type.h3}>Your strength map</Text>
              <Text style={[type.sm, { color: colors.fgMute }]}>e1RM · volume</Text>
            </View>
            <Text style={styles.mapSub}>Where you&apos;re personally strong, by muscle group.</Text>
            <BodyHeatmap values={PERSONAL_BODY.values} />
            <HeatmapLegend />
            <View style={styles.lifts}>
              {PERSONAL_BODY.topLifts.map((l) => (
                <View key={l.name} style={styles.liftRow}>
                  <Text style={[type.sm, { color: colors.fg }]}>{l.name}</Text>
                  <Text style={styles.liftValue}>{l.value}</Text>
                </View>
              ))}
            </View>
            <View style={styles.note}>
              <Icon.warn size={13} color={colors.warn} />
              <Text style={styles.noteText}>
                Lagging: <Text style={styles.warnBold}>{PERSONAL_BODY.weak.join(' · ')}</Text>
              </Text>
            </View>
          </Card>
        </View>

        {/* Weekly summary */}
        <View style={styles.section}>
          <Card padding={16}>
            <Text style={[type.h3, { marginBottom: 14 }]}>This week</Text>
            <View style={styles.summaryGrid}>
              <SummaryStat label="Sessions" value="4" sub="of 5 planned" />
              <SummaryStat label="Volume" value="42.1k" sub="kg, +6.2%" />
              <SummaryStat label="PRs" value="2" sub="bench, deadlift" />
              <SummaryStat label="Avg RPE" value="7.4" sub="prescribed 7.2" />
            </View>
          </Card>
        </View>
      </ScrollView>

      {coachOpen ? <AICoachFeedbackSheet onClose={() => setCoachOpen(false)} /> : null}
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
  section: { paddingHorizontal: screenInset, paddingBottom: 14 },
  sectionNoPadBottom: { paddingHorizontal: screenInset },
  topGap: { paddingTop: 6 },
  coachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    overflow: 'hidden',
  },
  coachGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.accent,
    opacity: 0.18,
  },
  coachIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 },
  cardHeaderSm: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  noteText: { flex: 1, ...type.sm, fontSize: 12 },
  warnBold: { fontFamily: fonts.sansSemiBold, color: colors.warn },
  prLabel: { marginBottom: 10 },
  prRow: { paddingHorizontal: screenInset, gap: 8, paddingBottom: 4 },
  prCard: {
    width: 150,
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  prValue: { ...type.mono, fontFamily: fonts.monoSemiBold, fontSize: 22, color: colors.fg, marginTop: 6, letterSpacing: -0.44 },
  ranges: { flexDirection: 'row', gap: 2 },
  range: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: radii.xs, fontFamily: fonts.sansMedium, fontSize: 11, color: colors.fgMute },
  rangeActive: { backgroundColor: colors.bg3, color: colors.fg },
  mapSub: { ...type.sm, fontSize: 12, marginBottom: 6 },
  lifts: { marginTop: 14, gap: 0 },
  liftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  liftValue: { ...type.mono, fontFamily: fonts.monoMedium, fontSize: 13, color: colors.fg },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 14, justifyContent: 'space-between' },
});
