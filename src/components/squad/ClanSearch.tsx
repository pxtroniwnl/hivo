// Port de ClanSearch + SEARCHABLE_CLANS (other-screens.jsx:687-780): buscar
// clan por ID/nombre y mandar request (aceptación por un miembro, mock).
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Card, Icon } from '@/components/ui';
import { colors, fonts, radii, type } from '@/theme';

type SearchableClan = { id: string; name: string; members: number; rank: string; region: string };

const SEARCHABLE_CLANS: SearchableClan[] = [
  { id: 'IRC-4892', name: 'Iron Crows', members: 6, rank: 'Diamond', region: 'Madrid' },
  { id: 'STP-1023', name: 'Steel Pact', members: 8, rank: 'Diamond', region: 'Barcelona' },
  { id: 'NRT-7711', name: 'Norte Power', members: 5, rank: 'Gold', region: 'Bilbao' },
  { id: 'CFR-4401', name: 'Casa Fuerte', members: 4, rank: 'Gold', region: 'Valencia' },
];

function SearchGlyph() {
  return (
    <Svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={colors.fgMute} strokeWidth={1.8} strokeLinecap="round">
      <Circle cx={11} cy={11} r={6.5} />
      <Path d="M16 16l4 4" />
    </Svg>
  );
}

export function ClanSearch() {
  const [q, setQ] = useState('');
  const [requested, setRequested] = useState<Set<string>>(new Set());

  const query = q.trim().toLowerCase();
  const matches = query
    ? SEARCHABLE_CLANS.filter(
        (c) => c.id.toLowerCase().includes(query) || c.name.toLowerCase().includes(query),
      )
    : [];

  return (
    <Card padding={14}>
      <Text style={[type.h3, { fontSize: 14, marginBottom: 8 }]}>Discover clans</Text>
      <View style={styles.search}>
        <SearchGlyph />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search by Clan ID (e.g. IRC-4892)"
          placeholderTextColor={colors.fgDim}
          autoCapitalize="characters"
          autoCorrect={false}
          style={styles.input}
        />
        {q ? (
          <Pressable onPress={() => setQ('')} hitSlop={8}>
            <Icon.close size={13} color={colors.fgMute} />
          </Pressable>
        ) : null}
      </View>

      {q.trim() ? (
        <View style={styles.results}>
          {matches.length === 0 ? (
            <Text style={styles.empty}>No clan matches &quot;{q}&quot;. Ask a friend for their Clan ID.</Text>
          ) : (
            matches.map((c) => {
              const isRequested = requested.has(c.id);
              const initials = c.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 3);
              return (
                <View key={c.id} style={styles.row}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{initials}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name}>{c.name}</Text>
                      <Text style={styles.id}>{c.id}</Text>
                    </View>
                    <Text style={styles.meta}>
                      {c.members}/8 members · {c.rank} · {c.region}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setRequested((r) => new Set([...r, c.id]))}
                    disabled={isRequested}
                    style={[styles.reqBtn, isRequested && styles.reqBtnDone]}
                  >
                    {isRequested ? <Icon.check size={11} color={colors.fgMute} /> : null}
                    <Text style={[styles.reqText, isRequested && styles.reqTextDone]}>
                      {isRequested ? 'Pending' : 'Request'}
                    </Text>
                  </Pressable>
                </View>
              );
            })
          )}
          {matches.length > 0 ? (
            <Text style={styles.footnote}>Requests must be accepted by a clan member.</Text>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  input: { flex: 1, color: colors.fg, fontFamily: fonts.sans, fontSize: 13, padding: 0 },
  results: { marginTop: 10, gap: 6 },
  empty: { fontFamily: fonts.sans, fontSize: 12, color: colors.fgMute, padding: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.bg3,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.sansSemiBold, fontSize: 11, color: colors.accentFg },
  nameRow: { flexDirection: 'row', gap: 6, alignItems: 'baseline' },
  name: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.fg },
  id: { fontFamily: fonts.mono, fontSize: 10, color: colors.fgMute },
  meta: { fontFamily: fonts.sans, fontSize: 10.5, color: colors.fgMute, marginTop: 2 },
  reqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
  },
  reqBtnDone: { backgroundColor: colors.bg2 },
  reqText: { fontFamily: fonts.sansSemiBold, fontSize: 11.5, color: colors.accentFg },
  reqTextDone: { color: colors.fgMute },
  footnote: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.fgMute,
    marginTop: 4,
    paddingHorizontal: 4,
  },
});
