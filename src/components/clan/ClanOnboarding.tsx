// Port de ClanOnboarding (clan-onboarding.jsx:68-230): pantalla cuando el
// usuario no tiene clan — banner, búsqueda por nombre/ID, CTA de crear,
// segmented Trending/All clans y la lista de clanes descubribles.
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Button, Card, Icon, ScreenHeader, Segmented } from '@/components/ui';
import { DISCOVER_CLANS } from '@/data/discover-clans';
import type { Clan, DiscoverClan } from '@/data/types';
import { colors, fonts, radii, screenInset, type } from '@/theme';

import { ClanCard } from './ClanCard';
import { ClanPreviewSheet } from './ClanPreviewSheet';
import { CreateClanSheet } from './CreateClanSheet';

function SearchGlyph() {
  return (
    <Svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={colors.fgMute} strokeWidth={1.8} strokeLinecap="round">
      <Circle cx={11} cy={11} r={6.5} />
      <Path d="M16 16l4 4" />
    </Svg>
  );
}

type ClanOnboardingProps = {
  onJoined: (clan: Clan) => void;
  topPadding?: number;
  bottomPadding?: number;
};

export function ClanOnboarding({ onJoined, topPadding = 8, bottomPadding = 24 }: ClanOnboardingProps) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'trending' | 'all'>('trending');
  const [previewing, setPreviewing] = useState<DiscoverClan | null>(null);
  const [creating, setCreating] = useState(false);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());

  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      q
        ? DISCOVER_CLANS.filter(
            (c) =>
              c.id.toLowerCase().includes(q) ||
              c.name.toLowerCase().includes(q) ||
              c.tag.toLowerCase().includes(q),
          )
        : null,
    [q],
  );

  const trending = DISCOVER_CLANS.filter((c) => c.trending);
  const list = matches ?? (tab === 'trending' ? trending : DISCOVER_CLANS);

  return (
    <>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPadding, paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Find your clan" subtitle="Hivo is better with 2–8 lifters" />

        {/* Banner */}
        <View style={styles.section}>
          <Card variant="elev" style={styles.banner}>
            <View style={styles.bannerGlow} />
            <View style={styles.bannerHeader}>
              <Icon.squad size={18} color={colors.accent} />
              <Text style={[type.h3, { fontSize: 14 }]}>You&apos;re flying solo</Text>
            </View>
            <Text style={styles.bannerBody}>
              Clans share weekly missions, raids and rescues. Find one by name or ID, browse trending, or
              create your own.
            </Text>
          </Card>
        </View>

        {/* Search */}
        <View style={styles.section}>
          <View style={styles.search}>
            <SearchGlyph />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search by name or ID (e.g. IRC-4892)"
              placeholderTextColor={colors.fgDim}
              autoCapitalize="characters"
              autoCorrect={false}
              style={styles.searchInput}
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Icon.close size={14} color={colors.fgMute} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* Create CTA */}
        <View style={styles.section}>
          <Pressable
            onPress={() => setCreating(true)}
            style={({ pressed }) => [styles.createCta, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <View style={styles.createIcon}>
              <Icon.plus size={18} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[type.h3, { fontSize: 14 }]}>Create a new clan</Text>
              <Text style={[type.sm, { marginTop: 2 }]}>Be the founder · invite up to 7 friends</Text>
            </View>
            <Icon.arrow size={16} color={colors.fgMute} />
          </Pressable>
        </View>

        {/* Resultados o segmented + lista */}
        {matches ? (
          <View style={styles.section}>
            <Text style={[type.xs, styles.matchCount]}>
              {matches.length} match{matches.length !== 1 ? 'es' : ''}
            </Text>
            {matches.length === 0 ? (
              <Card style={styles.empty}>
                <Text style={[type.sm, { fontSize: 13, textAlign: 'center' }]}>
                  No clan matches &quot;{query}&quot;.
                </Text>
                <Button
                  onPress={() => setCreating(true)}
                  style={styles.emptyBtn}
                  icon={<Icon.plus size={14} color={colors.fg} />}
                >
                  Create &quot;{query}&quot; clan
                </Button>
              </Card>
            ) : (
              <View style={styles.cardList}>
                {matches.map((c) => (
                  <ClanCard key={c.id} clan={c} requested={requestedIds.has(c.id)} onTap={() => setPreviewing(c)} />
                ))}
              </View>
            )}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Segmented
                options={[
                  { id: 'trending', label: 'Trending' },
                  { id: 'all', label: 'All clans' },
                ]}
                value={tab}
                onChange={(id) => setTab(id as 'trending' | 'all')}
              />
            </View>
            <View style={[styles.section, styles.cardList]}>
              {list.map((c) => (
                <ClanCard key={c.id} clan={c} requested={requestedIds.has(c.id)} onTap={() => setPreviewing(c)} />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {previewing ? (
        <ClanPreviewSheet
          clan={previewing}
          requested={requestedIds.has(previewing.id)}
          onClose={() => setPreviewing(null)}
          onRequest={() => setRequestedIds((s) => new Set([...s, previewing.id]))}
          onJoined={onJoined}
        />
      ) : null}

      {creating ? <CreateClanSheet onClose={() => setCreating(false)} onCreate={onJoined} /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  content: {},
  section: { paddingHorizontal: screenInset, paddingBottom: 14 },
  banner: { overflow: 'hidden' },
  bannerGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.accent,
    opacity: 0.12,
  },
  bannerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bannerBody: { ...type.sm, marginTop: 8, fontSize: 12.5 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  searchInput: { flex: 1, color: colors.fg, fontFamily: fonts.sans, fontSize: 14, padding: 0 },
  createCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
  },
  createIcon: {
    width: 38,
    height: 38,
    borderRadius: radii.sm,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchCount: { marginBottom: 10 },
  empty: { padding: 22, alignItems: 'center' },
  emptyBtn: { marginTop: 12, backgroundColor: colors.bg3 },
  cardList: { gap: 8 },
});
