// Port de AICoachFeedbackSheet (other-screens.jsx:964-1117): analiza los datos
// de entreno (mock) → summary, insights y follow-ups expandibles. Enmarcado
// como guía, no consejo médico (CLAUDE.md §autoreg/medical).
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Card, Chip, Icon, Sheet } from '@/components/ui';
import { colors, fonts, radii, type } from '@/theme';

import { InsightCard, type Insight } from './InsightCard';
import { SparklesIcon } from './SparklesIcon';

const INSIGHTS: Insight[] = [
  {
    kind: 'good',
    title: 'Strong bench progression',
    body: 'Bench press e1RM is up 8.4% over the last 12 weeks (88 → 110 kg). The last 3 weeks show clean linear gains. Keep the current loading and consider adding a third weekly bench exposure.',
    metric: '+8.4%',
  },
  {
    kind: 'warn',
    title: 'Posterior chain underdosed',
    body: 'Your back, hamstrings and rear delts are 32% below anterior volume. This usually shows up as plateaued squats and lower-back tightness on deadlift. Add 8–12 sets/week of Romanian DL + face pulls.',
    metric: '−32%',
  },
  {
    kind: 'good',
    title: 'Streak + consistency',
    body: 'You logged 4 of 5 planned sessions this week. Your 47-day streak puts you in the top 8% of intermediate lifters. Consistency is the lever doing the most work right now.',
    metric: '4/5',
  },
  {
    kind: 'info',
    title: 'RPE slightly high',
    body: 'Average RPE this week was 7.4 versus a prescribed 7.2. Not concerning alone, but if HRV drops below 55 ms or sleep dips below 7h, consider a deload week.',
    metric: '7.4',
  },
];

const FOLLOWUPS = [
  {
    id: 'plateau',
    label: 'Am I plateauing?',
    answer:
      "Your bench press e1RM jumped 8.4% over 12 weeks — that's solid for an intermediate. Squat is flat the last 3 weeks, which is the usual signal to deload one week, then push +2.5 kg microloads. Deadlift is on schedule.",
  },
  {
    id: 'priority',
    label: 'What should I prioritize?',
    answer:
      'Two things: (1) hamstring volume — your posterior chain heatmap is 32% below anterior, add one Romanian DL day. (2) Calf and rear-delt work — both are in your bottom 3. A weekly accessory day fixes this in ~4 weeks.',
  },
  {
    id: 'recovery',
    label: 'How is my recovery?',
    answer:
      "Your average RPE (7.4) is just above prescribed (7.2) — you're pushing slightly hard. HRV is normal. Sleep is averaging 7.2h. If you bump sleep to 8h for 2 weeks, expect your RPE for the same load to drop by ~0.5.",
  },
  {
    id: 'protein',
    label: 'Am I eating enough?',
    answer:
      "I don't track food yet — connect a nutrition app to get this analysis. For your bodyweight (71.3 kg) and goal (hypertrophy), target 1.6–2.2 g/kg protein = 114–157 g/day, and a 200–300 kcal surplus.",
  },
];

const STEPS = ['Volume trends', 'Recovery patterns', 'Imbalances', 'Strength curves'];

function Chevron({ open }: { open: boolean }) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={14}
      height={14}
      fill="none"
      stroke={colors.fgMute}
      strokeWidth={2}
      strokeLinecap="round"
      style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
    >
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function AICoachFeedbackSheet({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'loading' | 'ready'>('loading');
  const [activeFollowup, setActiveFollowup] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase('ready'), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <Sheet
      onClose={onClose}
      title="AI Coach feedback"
      subtitle={phase === 'loading' ? 'Reading your training data…' : 'Based on your last 12 weeks'}
    >
      {phase === 'loading' ? (
        <View style={styles.loading}>
          <View style={styles.loadingBubble}>
            <SparklesIcon size={24} />
          </View>
          <Text style={[type.h2, { marginTop: 18 }]}>Analyzing</Text>
          <Text style={[type.sm, { marginTop: 6 }]}>312 workouts · 27 PRs · 12 weeks of data</Text>
          <View style={styles.steps}>
            {STEPS.map((step) => (
              <View key={step} style={styles.step}>
                <View style={styles.dot} />
                <Text style={styles.stepText}>{step}…</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View>
          {/* Summary */}
          <Card variant="elev" style={styles.summary}>
            <View style={styles.summaryGlow} />
            <Chip variant="acc" textStyle={{ fontSize: 9.5 }}>
              Summary
            </Chip>
            <Text style={styles.summaryText}>
              You&apos;re progressing steadily. Strength is up{' '}
              <Text style={styles.acc}>+8.4%</Text> on bench and you&apos;ve hit{' '}
              <Text style={styles.acc}>2 PRs</Text> this week. Your main opportunity is{' '}
              <Text style={styles.bold}>posterior-chain volume</Text>.
            </Text>
          </Card>

          {/* Insights */}
          <Text style={[type.xs, styles.sectionLabel]}>Insights</Text>
          <View style={{ gap: 8, marginBottom: 14 }}>
            {INSIGHTS.map((ins) => (
              <InsightCard key={ins.title} insight={ins} />
            ))}
          </View>

          {/* Follow-ups */}
          <Text style={[type.xs, styles.sectionLabel]}>Ask a follow-up</Text>
          <View style={{ gap: 6 }}>
            {FOLLOWUPS.map((f) => {
              const open = activeFollowup === f.id;
              return (
                <Card key={f.id} padding={0} style={{ overflow: 'hidden' }}>
                  <Pressable
                    onPress={() => setActiveFollowup(open ? null : f.id)}
                    style={styles.followBtn}
                  >
                    <View style={styles.qBadge}>
                      <Text style={styles.qMark}>?</Text>
                    </View>
                    <Text style={styles.followLabel}>{f.label}</Text>
                    <Chevron open={open} />
                  </Pressable>
                  {open ? (
                    <View style={styles.answer}>
                      <View style={styles.answerBadge}>
                        <SparklesIcon size={13} />
                      </View>
                      <Text style={styles.answerText}>{f.answer}</Text>
                    </View>
                  ) : null}
                </Card>
              );
            })}
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Icon.info size={13} color={colors.accent} />
            <Text style={styles.disclaimerText}>
              AI Coach is a guide, not a doctor. For pain or persistent fatigue, talk to a coach or medical
              professional.
            </Text>
          </View>
        </View>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: 34, alignItems: 'center' },
  loadingBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  steps: { marginTop: 18, gap: 8, alignItems: 'flex-start' },
  step: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  stepText: { fontFamily: fonts.sans, fontSize: 12, color: colors.fgMid },
  summary: { padding: 14, overflow: 'hidden', marginBottom: 14 },
  summaryGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.accent,
    opacity: 0.18,
  },
  summaryText: { ...type.h3, fontSize: 14, marginTop: 8, lineHeight: 20 },
  acc: { color: colors.accent },
  bold: { fontFamily: fonts.sansSemiBold },
  sectionLabel: { marginBottom: 8 },
  followBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  qBadge: {
    width: 26,
    height: 26,
    borderRadius: radii.xs,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qMark: { fontFamily: fonts.sansSemiBold, fontSize: 11, color: colors.accent },
  followLabel: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 13, color: colors.fg },
  answer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  answerBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerText: { flex: 1, fontFamily: fonts.sans, fontSize: 12.5, color: colors.fg, lineHeight: 19 },
  disclaimer: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  disclaimerText: { flex: 1, fontFamily: fonts.sans, fontSize: 11.5, color: colors.fgMute, lineHeight: 17 },
});
