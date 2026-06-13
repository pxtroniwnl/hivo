// Port de FeedTab (other-screens.jsx:375-576): búsqueda de clanes, compositor,
// y muro con like/comentarios expandibles. Datos locales del feed del clan.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Avatar, Button, Card, Icon } from '@/components/ui';
import { FEED } from '@/data/mock';
import type { Clan } from '@/data/types';
import { colors, fonts, radii, type } from '@/theme';

import { ClanSearch } from './ClanSearch';
import { PostComposer, type ComposedVideo } from './PostComposer';

type Comment = { who: string; text: string; when: string; mine?: boolean };
type FeedPost = {
  id: string;
  who: string;
  when: string;
  action: string;
  detail: string;
  badge?: string;
  alert?: boolean;
  mine?: boolean;
  video?: ComposedVideo | null;
  likes: number;
  liked: boolean;
  comments: Comment[];
};

function CommentGlyph() {
  return (
    <Svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke={colors.fgMute} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 11c0 4.5-4 8-9 8a10 10 0 01-3.5-.6L4 20l1.5-3.8A7.5 7.5 0 013 11c0-4.5 4-8 9-8s9 3.5 9 8z" />
    </Svg>
  );
}

const SEED_COMMENTS: Record<string, Comment[]> = {
  f1: [
    { who: 'Mara V.', text: 'Massive — congrats!', when: '10m' },
    { who: 'Tea M.', text: 'Form looked clean too', when: '8m' },
  ],
  f2: [{ who: 'Karim O.', text: 'fast 🔥', when: '50m' }],
};

export function FeedTab({ clan }: { clan: Clan }) {
  const [items, setItems] = useState<FeedPost[]>(() =>
    FEED.map((f, i) => ({
      id: f.id,
      who: f.who,
      when: f.when,
      action: f.action,
      detail: f.detail,
      badge: f.badge,
      alert: f.alert,
      likes: ((i * 3 + 2) % 9) + 1,
      liked: false,
      comments: SEED_COMMENTS[f.id] ?? [],
    })),
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);

  const toggleLike = (id: string) =>
    setItems((it) =>
      it.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p,
      ),
    );

  const toggleComments = (id: string) => {
    setExpandedId((cur) => (cur === id ? null : id));
    setDraft('');
  };

  const addComment = (id: string) => {
    if (!draft.trim()) return;
    setItems((it) =>
      it.map((p) =>
        p.id === id
          ? { ...p, comments: [...p.comments, { who: 'You', text: draft.trim(), when: 'now', mine: true }] }
          : p,
      ),
    );
    setDraft('');
  };

  const addPost = (text: string, video: ComposedVideo | null) => {
    setItems((it) => [
      {
        id: 'fnew-' + Date.now(),
        who: 'You',
        when: 'now',
        action: 'posted',
        detail: text,
        mine: true,
        video,
        likes: 0,
        liked: false,
        comments: [],
      },
      ...it,
    ]);
    setComposeOpen(false);
  };

  return (
    <>
      <View style={styles.section}>
        <ClanSearch />
      </View>

      {/* Compose */}
      <View style={styles.section}>
        <Pressable
          onPress={() => setComposeOpen(true)}
          style={({ pressed }) => [styles.compose, pressed && { transform: [{ scale: 0.98 }] }]}
        >
          <Avatar name="You" size={32} color={colors.accent} />
          <Text style={styles.composePlaceholder}>Share something with your clan…</Text>
          <View style={styles.composeIcon}>
            <Icon.play size={14} color={colors.accent} />
          </View>
        </Pressable>
      </View>

      {/* Posts */}
      <View style={[styles.section, { gap: 10 }]}>
        {items.map((f) => {
          const expanded = expandedId === f.id;
          return (
            <Card key={f.id} padding={14}>
              <View style={styles.postHeader}>
                <Avatar name={f.who} size={36} color={f.mine ? colors.accent : undefined} />
                <View style={{ flex: 1 }}>
                  <Text style={type.sm}>
                    <Text style={styles.who}>{f.who}</Text>
                    {f.mine ? <Text style={styles.youTag}> YOU</Text> : null}
                    <Text style={styles.metaText}>
                      {'  '}
                      {f.action} · {f.when}
                    </Text>
                  </Text>
                  <Text style={[type.h3, styles.detail, f.mine && { fontFamily: fonts.sansMedium }]}>
                    {f.detail}
                  </Text>
                </View>
                {f.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{f.badge}</Text>
                  </View>
                ) : null}
              </View>

              {/* Vídeo adjunto */}
              {f.video ? (
                <View style={styles.videoBox}>
                  <View style={styles.playBtn}>
                    <Icon.play size={20} color={colors.accentFg} />
                  </View>
                  <Text style={styles.videoCaption}>
                    {f.video.duration} · {f.video.name}
                  </Text>
                </View>
              ) : null}

              {f.alert ? (
                <Button
                  style={styles.rescueBtn}
                  textStyle={styles.rescueBtnText}
                  icon={<Icon.shield size={14} color="#1a1209" />}
                >
                  Send a rescue rep
                </Button>
              ) : null}

              {/* Acciones */}
              <View style={styles.actions}>
                <Pressable
                  onPress={() => toggleLike(f.id)}
                  style={[styles.actionBtn, f.liked && styles.actionBtnActive]}
                >
                  <Icon.heart size={13} color={f.liked ? colors.accent : colors.fgMute} />
                  <Text style={[styles.actionText, f.liked && { color: colors.accent }]}>{f.likes}</Text>
                </Pressable>
                <Pressable
                  onPress={() => toggleComments(f.id)}
                  style={[styles.actionBtn, expanded && styles.actionBtnExpanded]}
                >
                  <CommentGlyph />
                  <Text style={styles.actionText}>{f.comments.length}</Text>
                </Pressable>
              </View>

              {/* Comentarios */}
              {expanded ? (
                <View style={styles.comments}>
                  {f.comments.length === 0 ? (
                    <Text style={styles.noComments}>No comments yet — be the first.</Text>
                  ) : null}
                  {f.comments.map((c, i) => (
                    <View key={i} style={styles.commentRow}>
                      <Avatar name={c.who} size={26} color={c.mine ? colors.accent : undefined} />
                      <View style={styles.commentBubble}>
                        <View style={styles.commentHead}>
                          <Text style={styles.commentWho}>
                            {c.who}
                            {c.mine ? <Text style={styles.youTag}> YOU</Text> : null}
                          </Text>
                          <Text style={styles.commentWhen}>{c.when}</Text>
                        </View>
                        <Text style={styles.commentText}>{c.text}</Text>
                      </View>
                    </View>
                  ))}
                  <View style={styles.inputRow}>
                    <Avatar name="You" size={26} color={colors.accent} />
                    <TextInput
                      value={draft}
                      onChangeText={setDraft}
                      onSubmitEditing={() => addComment(f.id)}
                      placeholder="Add a comment…"
                      placeholderTextColor={colors.fgDim}
                      style={styles.input}
                    />
                    <Pressable
                      onPress={() => addComment(f.id)}
                      disabled={!draft.trim()}
                      style={[styles.sendBtn, !draft.trim() && styles.sendBtnOff]}
                    >
                      <Icon.arrow size={14} color={draft.trim() ? colors.accentFg : colors.fgDim} />
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>

      {composeOpen ? (
        <PostComposer clanName={clan.name} onClose={() => setComposeOpen(false)} onPost={addPost} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 18, paddingBottom: 14 },
  compose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  composePlaceholder: { ...type.sm, flex: 1, color: colors.fgMute },
  composeIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postHeader: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  who: { fontFamily: fonts.sansSemiBold, color: colors.fg },
  youTag: { fontFamily: fonts.sansMedium, color: colors.accent, fontSize: 9 },
  metaText: { color: colors.fgMute },
  detail: { marginTop: 4, fontSize: 14 },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.accentSoft,
  },
  badgeText: { fontFamily: fonts.sansSemiBold, fontSize: 11, color: colors.accent, letterSpacing: 0.55 },
  videoBox: {
    marginTop: 12,
    aspectRatio: 16 / 10,
    borderRadius: radii.sm,
    backgroundColor: colors.bg1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoCaption: {
    position: 'absolute',
    left: 10,
    bottom: 8,
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.fgMid,
  },
  rescueBtn: { marginTop: 12, backgroundColor: colors.warn, paddingVertical: 12 },
  rescueBtnText: { color: '#1a1209', fontSize: 13 },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  actionBtnActive: { backgroundColor: colors.accentSoft },
  actionBtnExpanded: { backgroundColor: colors.bg3 },
  actionText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.fgMute },
  comments: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    gap: 10,
  },
  noComments: { fontFamily: fonts.sans, fontStyle: 'italic', fontSize: 12, color: colors.fgMute },
  commentRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  commentBubble: { flex: 1, padding: 10, backgroundColor: colors.bg3, borderRadius: radii.sm },
  commentHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 },
  commentWho: { fontFamily: fonts.sansSemiBold, fontSize: 12, color: colors.fg },
  commentWhen: { fontFamily: fonts.sansMedium, fontSize: 10, color: colors.fgMute },
  commentText: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.fg, marginTop: 3 },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    color: colors.fg,
    fontFamily: fonts.sans,
    fontSize: 13,
  },
  sendBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnOff: { backgroundColor: colors.bg3 },
});
