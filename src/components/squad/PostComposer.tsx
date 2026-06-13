// Port de PostComposer (other-screens.jsx:578-674): redactar post para el clan
// con adjunto de vídeo. En RN no hay <input type=file>: el adjunto se simula
// (sin expo-image-picker — YAGNI sin backend), igual de explícito que el proto.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { Button, Icon, Sheet } from '@/components/ui';
import { colors, fonts, radii, type } from '@/theme';

export type ComposedVideo = { name: string; size: string; duration: string };

function VideoGlyph({ color = colors.fgMid }: { color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={5} width={15} height={14} rx={2} />
      <Path d="M18 10l3-2v8l-3-2z" />
    </Svg>
  );
}

type PostComposerProps = {
  clanName: string;
  onClose: () => void;
  onPost: (text: string, video: ComposedVideo | null) => void;
};

export function PostComposer({ clanName, onClose, onPost }: PostComposerProps) {
  const [text, setText] = useState('');
  const [video, setVideo] = useState<ComposedVideo | null>(null);

  const attachVideo = () => {
    setVideo({
      name: 'clip_' + Date.now().toString().slice(-4) + '.mp4',
      size: (12 + Math.floor(Math.random() * 40)).toString() + '.0 MB',
      duration: '0:' + String(15 + Math.floor(Math.random() * 45)).padStart(2, '0'),
    });
  };

  const canPost = (text.trim().length > 0 || !!video) && text.length <= 280;

  return (
    <Sheet onClose={onClose} title="New post" subtitle={`Share with ${clanName}`}>
      <TextInput
        autoFocus
        value={text}
        onChangeText={setText}
        placeholder="What's on your mind?"
        placeholderTextColor={colors.fgDim}
        multiline
        style={styles.textarea}
      />

      {video ? (
        <View style={styles.videoCard}>
          <View style={styles.videoThumb}>
            <Icon.play size={20} color={colors.accent} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[type.h3, { fontSize: 13 }]} numberOfLines={1}>
              {video.name}
            </Text>
            <Text style={styles.videoMeta}>
              {video.duration} · {video.size}
            </Text>
          </View>
          <Pressable onPress={() => setVideo(null)} style={styles.removeBtn} hitSlop={6}>
            <Icon.close size={14} color={colors.fgMute} />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.toolbar}>
        <Pressable onPress={attachVideo} style={[styles.attachBtn, video && styles.attachBtnActive]}>
          <VideoGlyph color={video ? colors.accent : colors.fgMid} />
          <Text style={[styles.attachText, video && { color: colors.accent }]}>
            {video ? 'Change video' : 'Attach video'}
          </Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={[styles.counter, text.length > 280 && { color: colors.warn }]}>{text.length}/280</Text>
      </View>

      <Button
        variant="primary"
        block
        disabled={!canPost}
        onPress={() => onPost(text.trim() || '🎥 New video', video)}
        style={[styles.postBtn, !canPost && { opacity: 0.5 }]}
      >
        Post to clan
      </Button>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  textarea: {
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    color: colors.fg,
    fontFamily: fonts.sans,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    lineHeight: 21,
  },
  videoCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  videoThumb: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    backgroundColor: colors.bg1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoMeta: { fontFamily: fonts.sans, fontSize: 10.5, color: colors.fgMute, marginTop: 3 },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.bg3,
  },
  attachBtnActive: { backgroundColor: colors.accentSoft },
  attachText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.fgMid },
  counter: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.fgMute },
  postBtn: { marginTop: 16 },
});
