// Port de TechniqueSheet (active.jsx:511-619): placeholder de vídeo + cues +
// error común + protocolo beginner + preferencia (en memoria — sin storage,
// YAGNI hasta que haya backend).
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, Sheet } from '@/components/ui';
import { TECHNIQUE } from '@/data/mock';
import { colors, fonts, type } from '@/theme';

// Preferencia compartida durante la sesión (el proto usaba localStorage).
let techniquePref = true;

export function TechniqueSheet({ exerciseName, onClose }: { exerciseName: string; onClose: () => void }) {
  const tech = TECHNIQUE[exerciseName] || TECHNIQUE.default;
  const [muted, setMuted] = useState(true);
  const [autoShow, setAutoShow] = useState(techniquePref);
  const togglePref = () => {
    techniquePref = !autoShow;
    setAutoShow(techniquePref);
  };

  return (
    <Sheet onClose={onClose} title="How to do this" subtitle={exerciseName}>
      {/* Placeholder de vídeo */}
      <View style={styles.video}>
        <View style={styles.playBtn}>
          <Icon.play size={24} color={colors.accentFg} />
        </View>
        <Text style={styles.caption}>HD · 0:42 · slow-mo & cues</Text>
        <Pressable onPress={() => setMuted((m) => !m)} style={styles.muteBtn}>
          <Text style={styles.muteIcon}>{muted ? '🔇' : '🔊'}</Text>
        </Pressable>
      </View>

      {/* Cues */}
      <View style={{ marginTop: 14 }}>
        <Text style={[type.xs, { marginBottom: 8 }]}>Key cues</Text>
        <View style={styles.cues}>
          {tech.cues.map((c, i) => (
            <View key={i} style={styles.cueRow}>
              <View style={styles.cueIdx}>
                <Text style={styles.cueIdxText}>{i + 1}</Text>
              </View>
              <Text style={styles.cueText}>{c}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Error común */}
      <View style={styles.mistake}>
        <Icon.warn size={14} color={colors.warn} />
        <View style={styles.flex1}>
          <Text style={[type.xs, styles.mistakeLabel]}>Common mistake</Text>
          <Text style={styles.mistakeText}>{tech.common}</Text>
        </View>
      </View>

      {/* Protocolo beginner */}
      <View style={styles.protocol}>
        <Text style={[type.xs, { marginBottom: 4 }]}>Beginner protocol</Text>
        <Text style={styles.protocolText}>{tech.sets}</Text>
      </View>

      {/* Preferencia */}
      <View style={styles.pref}>
        <View style={styles.flex1}>
          <Text style={[type.h3, { fontSize: 13 }]}>Show technique automatically</Text>
          <Text style={styles.prefSub}>Before each new exercise during a workout</Text>
        </View>
        <Pressable
          onPress={togglePref}
          style={[styles.toggle, { backgroundColor: autoShow ? colors.accent : colors.bg4 }]}
        >
          <View style={[styles.knob, autoShow && { transform: [{ translateX: 18 }] }]} />
        </Pressable>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  video: {
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#11111a',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
  },
  caption: {
    position: 'absolute',
    left: 12,
    bottom: 10,
    fontSize: 11,
    color: colors.fgMid,
    fontFamily: fonts.mono,
  },
  muteBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  muteIcon: {
    fontSize: 14,
  },
  cues: {
    gap: 8,
  },
  cueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  cueIdx: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cueIdxText: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 11,
    color: colors.accent,
  },
  cueText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 13 * 1.45,
    color: colors.fg,
    fontFamily: fonts.sans,
  },
  mistake: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(245,181,74,0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(245,181,74,0.3)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  mistakeLabel: {
    color: colors.warn,
    marginBottom: 4,
  },
  mistakeText: {
    fontSize: 12.5,
    lineHeight: 12.5 * 1.45,
    color: colors.fgMid,
    fontFamily: fonts.sans,
  },
  protocol: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.bg3,
  },
  protocolText: {
    fontSize: 12.5,
    color: colors.fgMid,
    fontFamily: fonts.sans,
  },
  pref: {
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.bg3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prefSub: {
    marginTop: 3,
    fontSize: 11,
    color: colors.fgMute,
    fontFamily: fonts.sans,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: 'center',
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
});
