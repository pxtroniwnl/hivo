// Port de DataExportSheet (other-screens.jsx:1482-1637): rango + qué incluir +
// generar CSV. En RN no hay Blob/descarga de navegador: el flujo de generación
// se simula (sin expo-file-system — YAGNI sin backend), igual de explícito.
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Button, Icon, Segmented, Sheet } from '@/components/ui';
import { colors, fonts, radii, type } from '@/theme';

type Scope = 'last30' | 'year' | 'all';
type IncludeKey = 'workouts' | 'body' | 'prs';

const SCOPES: { id: Scope; label: string }[] = [
  { id: 'last30', label: 'Last 30d' },
  { id: 'year', label: 'Last year' },
  { id: 'all', label: 'All time' },
];

const OPTIONS: { key: IncludeKey; label: string; sub: string }[] = [
  { key: 'workouts', label: 'Workout logs', sub: 'Every set with weight, reps, RPE' },
  { key: 'body', label: 'Body measurements', sub: 'Weight, body fat %, dates' },
  { key: 'prs', label: 'Personal records', sub: 'Top lifts per exercise' },
];

function DownloadGlyph({ color = colors.accentFg }: { color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 3v13M8 12l4 4 4-4M5 21h14" />
    </Svg>
  );
}

export function DataExportSheet({ onClose }: { onClose: () => void }) {
  const [scope, setScope] = useState<Scope>('all');
  const [includes, setIncludes] = useState<Record<IncludeKey, boolean>>({
    workouts: true,
    body: true,
    prs: true,
  });
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const anySelected = Object.values(includes).some(Boolean);

  const generate = () => {
    setDownloading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      timer.current = setTimeout(() => setDownloaded(false), 2400);
    }, 600);
  };

  const toggle = (key: IncludeKey) => setIncludes((s) => ({ ...s, [key]: !s[key] }));

  return (
    <Sheet onClose={onClose} title="My data" subtitle="Export everything you've logged">
      <Text style={[type.xs, styles.label]}>Time range</Text>
      <Segmented
        options={SCOPES}
        value={scope}
        onChange={(id) => setScope(id as Scope)}
        style={styles.rangeSegmented}
      />

      <Text style={[type.xs, styles.label]}>Include</Text>
      <View style={{ gap: 6, marginBottom: 16 }}>
        {OPTIONS.map((opt) => {
          const on = includes[opt.key];
          return (
            <Pressable
              key={opt.key}
              onPress={() => toggle(opt.key)}
              style={[styles.option, { borderColor: on ? colors.accent : 'transparent' }]}
            >
              <View style={[styles.checkbox, on && styles.checkboxOn]}>
                {on ? <Icon.check size={13} color={colors.accentFg} /> : null}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.h3, { fontSize: 13 }]}>{opt.label}</Text>
                <Text style={styles.optionSub}>{opt.sub}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.info}>
        <Icon.info size={13} color={colors.accent} />
        <Text style={styles.infoText}>
          Your data is yours. CSV is portable to Excel, Numbers, Google Sheets and any third-party fitness
          app.
        </Text>
      </View>

      <Button
        variant="primary"
        block
        disabled={downloading || !anySelected}
        onPress={generate}
        icon={downloaded ? <Icon.check size={14} color={colors.accentFg} /> : !downloading ? <DownloadGlyph /> : undefined}
        style={(downloading || !anySelected) && { opacity: 0.6 }}
      >
        {downloading ? 'Generating…' : downloaded ? 'Downloaded' : 'Download CSV'}
      </Button>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 8 },
  rangeSegmented: { marginBottom: 16 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radii.xs,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  optionSub: { fontFamily: fonts.sans, fontSize: 10.5, color: colors.fgMute, marginTop: 2 },
  info: {
    padding: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 14,
  },
  infoText: { flex: 1, ...type.sm, fontSize: 11.5, lineHeight: 16 },
});
