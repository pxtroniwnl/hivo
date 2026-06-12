// Port de COACH_QUESTIONS + AICoachSheet (train.jsx:1646-1883): intake de 6
// preguntas estilo chat → loading → preview del workout generado.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip, Icon, ProgressBar, Sheet } from '@/components/ui';
import { generateCoachWorkout, type CoachAnswers, type CoachWorkout } from '@/lib/coach';
import { colors, fonts, radii, type } from '@/theme';

import { GradientTile } from './GradientTile';
import { KindBadge, LevelChip, SparklesIcon } from './badges';

type CoachOption = { value: string | number; label: string; sub: string };
type CoachQuestion = { id: keyof CoachAnswers; prompt: string; options: CoachOption[] };

const COACH_QUESTIONS: CoachQuestion[] = [
  {
    id: 'experience',
    prompt:
      "Hi 👋 I'm your AI Coach. Quick intake, then I'll design a workout for you.\n\nFirst — how long have you been training?",
    options: [
      { value: 'new', label: 'New to the gym', sub: 'Less than 3 months' },
      { value: 'casual', label: 'Casual', sub: '3 months – 1 year' },
      { value: 'regular', label: 'Regular', sub: '1 – 3 years' },
      { value: 'veteran', label: 'Veteran', sub: '3+ years' },
    ],
  },
  {
    id: 'goal',
    prompt: "What's your main goal right now?",
    options: [
      { value: 'strength', label: 'Get stronger', sub: 'Heavier compound lifts' },
      { value: 'hypertrophy', label: 'Build muscle', sub: 'Aesthetic, more volume' },
      { value: 'recomp', label: 'Recomposition', sub: 'Lean out while keeping strength' },
      { value: 'general', label: 'General fitness', sub: 'Stay healthy, feel good' },
    ],
  },
  {
    id: 'days',
    prompt: 'How many days per week can you train?',
    options: [
      { value: 3, label: '3 days', sub: 'Minimum effective dose' },
      { value: 4, label: '4 days', sub: 'Upper / Lower split' },
      { value: 5, label: '5 days', sub: 'Push / Pull / Legs + 2' },
      { value: 6, label: '6 days', sub: 'Full PPL' },
    ],
  },
  {
    id: 'duration',
    prompt: 'How long can each session be?',
    options: [
      { value: 30, label: '30 min', sub: 'Short, focused' },
      { value: 45, label: '45 min', sub: 'Balanced' },
      { value: 60, label: '60 min', sub: 'Standard hour' },
      { value: 90, label: '75 – 90 min', sub: 'I have time' },
    ],
  },
  {
    id: 'equipment',
    prompt: 'What equipment do you have?',
    options: [
      { value: 'full', label: 'Full gym', sub: 'Barbells, DBs, machines, cables' },
      { value: 'home', label: 'Home gym', sub: 'Barbell + plates + rack' },
      { value: 'dbs', label: 'Dumbbells only', sub: 'Adjustable or rack' },
      { value: 'bw', label: 'Bodyweight only', sub: 'No equipment' },
    ],
  },
  {
    id: 'focus',
    prompt: 'Any specific focus or weak point?',
    options: [
      { value: 'none', label: 'Balanced', sub: 'Hit everything evenly' },
      { value: 'upper', label: 'Upper body', sub: 'Chest, back, arms' },
      { value: 'lower', label: 'Lower body', sub: 'Legs and glutes' },
      { value: 'posterior', label: 'Posterior chain', sub: 'Back, hams, glutes' },
    ],
  },
];

type AICoachSheetProps = {
  onClose: () => void;
  onAddWorkout: (w: CoachWorkout) => void;
};

export function AICoachSheet({ onClose, onAddWorkout }: AICoachSheetProps) {
  const [step, setStep] = useState<number | 'generating' | 'done'>(0);
  const [answers, setAnswers] = useState<CoachAnswers>({});
  const [generated, setGenerated] = useState<CoachWorkout | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const totalSteps = COACH_QUESTIONS.length;

  const choose = (qid: keyof CoachAnswers, value: string | number) => {
    const next = { ...answers, [qid]: value };
    setAnswers(next);
    if (typeof step === 'number' && step + 1 < totalSteps) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setStep('generating');
      setTimeout(() => {
        setGenerated(generateCoachWorkout(next));
        setStep('done');
      }, 1400);
    }
  };

  const back = () => {
    if (typeof step === 'number' && step > 0) setStep(step - 1);
  };

  const saveAndClose = () => {
    if (!generated) return;
    onAddWorkout(generated);
    setSavedFlash(true);
    setTimeout(() => onClose(), 900);
  };

  return (
    <Sheet
      onClose={onClose}
      title="AI Coach"
      subtitle={
        step === 'done'
          ? 'Your custom workout is ready'
          : step === 'generating'
            ? 'Designing your program…'
            : `Step ${(step as number) + 1} of ${totalSteps}`
      }
    >
      {typeof step === 'number' && (
        <>
          <View style={{ marginBottom: 18 }}>
            <ProgressBar value={((step + 1) / totalSteps) * 100} height={3} />
          </View>
          {(() => {
            const q = COACH_QUESTIONS[step];
            return (
              <View key={q.id}>
                <View style={styles.promptCard}>
                  <GradientTile size={30} radius={15}>
                    <SparklesIcon size={14} />
                  </GradientTile>
                  <Text style={styles.promptText}>{q.prompt}</Text>
                </View>
                <View style={styles.options}>
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.value;
                    return (
                      <Pressable
                        key={String(opt.value)}
                        onPress={() => choose(q.id, opt.value)}
                        style={({ pressed }) => [
                          styles.option,
                          selected && styles.optionOn,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View style={[styles.radio, selected && styles.radioOn]}>
                          {selected && <Icon.check size={11} color={colors.accentFg} />}
                        </View>
                        <View style={styles.flex1}>
                          <Text style={styles.optionLabel}>{opt.label}</Text>
                          <Text style={styles.optionSub}>{opt.sub}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
                {step > 0 && (
                  <Pressable onPress={back} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
                    <Icon.back size={13} color={colors.fg} />
                    <Text style={styles.backText}>Back</Text>
                  </Pressable>
                )}
              </View>
            );
          })()}
        </>
      )}

      {step === 'generating' && (
        <View style={styles.generating}>
          <GradientTile size={60} radius={30}>
            <SparklesIcon size={24} />
          </GradientTile>
          <Text style={[type.h2, { marginTop: 18 }]}>Designing your workout</Text>
          <Text style={[type.sm, { marginTop: 6 }]}>Matching exercises to your goals…</Text>
        </View>
      )}

      {step === 'done' && generated && (
        <View>
          <View style={styles.resultCard}>
            <View style={styles.resultGlow} />
            <View style={styles.badges}>
              <KindBadge kind="workout" />
              <LevelChip level={generated.level} />
              <Chip variant="acc">AI-built</Chip>
            </View>
            <Text style={type.h2}>{generated.name}</Text>
            <Text style={[type.sm, { marginTop: 4 }]}>
              {generated.days.length} days · ~{generated.estMin} min/session · {generated.duration}
            </Text>
            <Text style={[type.sm, styles.resultDesc]}>{generated.description}</Text>
          </View>

          <Text style={[type.xs, styles.scheduleLabel]}>Weekly schedule</Text>
          <View style={styles.schedule}>
            {generated.days.map((d, i) => (
              <View key={i} style={styles.scheduleRow}>
                <View style={styles.dayChip}>
                  <Text style={styles.dayChipText}>{d.day.toUpperCase()}</Text>
                </View>
                <Text style={styles.scheduleName}>{d.name}</Text>
                <Text style={styles.scheduleCount}>{d._routineData.exercises.length} ex</Text>
              </View>
            ))}
          </View>

          {savedFlash ? (
            <View style={styles.savedCard}>
              <View style={styles.savedIcon}>
                <Icon.check size={18} color={colors.accent} />
              </View>
              <Text style={[type.h3, { fontSize: 14 }]}>Added to My Workouts</Text>
            </View>
          ) : (
            <>
              <Pressable onPress={saveAndClose} style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}>
                <Icon.plus size={14} color={colors.accentFg} />
                <Text style={styles.primaryText}>Add to My Workouts</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setStep(0);
                  setAnswers({});
                  setGenerated(null);
                }}
                style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
              >
                <Text style={styles.secondaryText}>Start over</Text>
              </Pressable>
            </>
          )}
        </View>
      )}
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
  promptCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    marginBottom: 14,
  },
  promptText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 14 * 1.5,
    color: colors.fg,
    fontFamily: fonts.sans,
  },
  options: {
    gap: 6,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  optionOn: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  optionLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13.5,
    color: colors.fg,
  },
  optionSub: {
    marginTop: 2,
    fontSize: 11,
    color: colors.fgMute,
    fontFamily: fonts.sans,
  },
  backBtn: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
  },
  backText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.fg,
  },
  generating: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  resultCard: {
    padding: 16,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    overflow: 'hidden',
  },
  resultGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.accent,
    opacity: 0.18,
  },
  resultDesc: {
    marginTop: 8,
    fontSize: 12.5,
    color: colors.fgMid,
    lineHeight: 12.5 * 1.45,
  },
  scheduleLabel: {
    marginTop: 14,
    marginBottom: 8,
  },
  schedule: {
    gap: 6,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  dayChip: {
    width: 30,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    letterSpacing: 10 * 0.05,
    color: colors.accent,
  },
  scheduleName: {
    flex: 1,
    fontSize: 12.5,
    color: colors.fg,
    fontFamily: fonts.sans,
  },
  scheduleCount: {
    fontSize: 10,
    color: colors.fgMute,
    fontFamily: fonts.sans,
  },
  savedCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    alignItems: 'center',
  },
  savedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  primaryBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
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
    paddingVertical: 14,
    borderRadius: radii.md,
    backgroundColor: colors.bg3,
  },
  secondaryText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.fg,
  },
});
