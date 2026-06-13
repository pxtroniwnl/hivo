// Port de SquadScreen + MenuRow (other-screens.jsx:7-131): home del clan con
// segmented Clan/Feed, menú ⋯ (invite/members/settings/ID) y leave con
// confirmación destructiva. Salir es sin fricción (CLAUDE.md §anti-toxicidad).
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Button, Icon, ScreenHeader, Sheet } from '@/components/ui';
import type { Clan } from '@/data/types';
import { colors, fonts, radii, screenInset, type } from '@/theme';

import { ClanTab } from './ClanTab';
import { FeedTab } from './FeedTab';

function LeaveGlyph() {
  return (
    <Svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={colors.err} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M16 17l5-5-5-5M21 12H9M12 21H5a2 2 0 01-2-2V5a2 2 0 012-2h7" />
    </Svg>
  );
}

type SquadScreenProps = {
  clan: Clan;
  onLeave: () => void;
  topPadding?: number;
  bottomPadding?: number;
};

export function SquadScreen({ clan, onLeave, topPadding = 8, bottomPadding = 24 }: SquadScreenProps) {
  const [tab, setTab] = useState<'clan' | 'feed'>('clan');
  const [menuOpen, setMenuOpen] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const clanId = clan.id ?? 'CRWS-4892';

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title={clan.name}
          subtitle={`${clan.rank} · ${clan.week}`}
          right={
            <Pressable onPress={() => setMenuOpen(true)} style={styles.menuBtn}>
              <Icon.more size={18} color={colors.fgMid} />
            </Pressable>
          }
        />

        {/* Segmented */}
        <View style={styles.section}>
          <View style={styles.segmented}>
            {(['clan', 'feed'] as const).map((t) => {
              const active = tab === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setTab(t)}
                  style={[styles.segBtn, active && styles.segBtnActive]}
                >
                  <Text style={[styles.segText, active && styles.segTextActive]}>
                    {t === 'feed' ? 'Feed' : 'Clan'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {tab === 'clan' ? <ClanTab clan={clan} /> : <FeedTab clan={clan} />}
      </ScrollView>

      {/* Menú ⋯ */}
      {menuOpen ? (
        <Sheet
          onClose={() => setMenuOpen(false)}
          title={clan.name}
          subtitle={`${clan.members} member${clan.members !== 1 ? 's' : ''} · ${clanId}`}
        >
          <View style={{ gap: 6 }}>
            <MenuRow icon={<Icon.plus size={14} color={colors.accent} />} label="Invite friends" sub="Share clan invite link" />
            <MenuRow
              icon={<Icon.squad size={14} color={colors.accent} />}
              label="Members"
              sub={`${clan.members} active · ${clan.online} online now`}
            />
            <MenuRow icon={<Icon.shield size={14} color={colors.accent} />} label="Clan settings" sub="Name, photo, visibility" />
            <MenuRow icon={<Icon.info size={14} color={colors.accent} />} label="Clan ID" sub={clanId} />
            <View style={styles.divider} />
            <Pressable
              onPress={() => {
                setMenuOpen(false);
                setLeaveConfirm(true);
              }}
              style={styles.leaveRow}
            >
              <View style={styles.leaveIcon}>
                <LeaveGlyph />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[type.h3, { fontSize: 14, color: colors.err }]}>Leave clan</Text>
                <Text style={[type.sm, { marginTop: 2, fontSize: 11.5 }]}>Find another clan or create one</Text>
              </View>
            </Pressable>
          </View>
        </Sheet>
      ) : null}

      {/* Leave confirm */}
      {leaveConfirm ? (
        <Sheet
          onClose={() => setLeaveConfirm(false)}
          title={`Leave ${clan.name}?`}
          subtitle="Your stats stay, but clan progress doesn't"
        >
          <View style={styles.warnBox}>
            <Icon.warn size={16} color={colors.err} />
            <Text style={styles.warnText}>
              You&apos;ll lose your contribution to the current raid. You can rejoin later — a member will
              need to accept your request again.
            </Text>
          </View>
          <View style={styles.confirmRow}>
            <Button style={{ flex: 1, backgroundColor: colors.bg3 }} onPress={() => setLeaveConfirm(false)}>
              Stay
            </Button>
            <Pressable
              style={({ pressed }) => [styles.leaveBtn, pressed && { transform: [{ scale: 0.98 }] }]}
              onPress={() => {
                setLeaveConfirm(false);
                onLeave();
              }}
            >
              <Text style={styles.leaveBtnText}>Leave clan</Text>
            </Pressable>
          </View>
        </Sheet>
      ) : null}
    </>
  );
}

function MenuRow({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <Pressable style={styles.menuRow}>
      <View style={styles.menuIcon}>{icon}</View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[type.h3, { fontSize: 14 }]}>{label}</Text>
        <Text style={[type.sm, { marginTop: 2, fontSize: 11.5 }]}>{sub}</Text>
      </View>
      <Icon.arrow size={14} color={colors.fgMute} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  menuBtn: {
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
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderRadius: radii.sm,
    padding: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  segBtn: { flex: 1, paddingVertical: 9, paddingHorizontal: 12, borderRadius: radii.sm, alignItems: 'center' },
  segBtnActive: { backgroundColor: colors.bg3 },
  segText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.fgMute },
  segTextActive: { color: colors.fg },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: radii.sm },
  menuIcon: {
    width: 30,
    height: 30,
    borderRadius: radii.xs,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line, marginVertical: 6 },
  leaveRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  leaveIcon: {
    width: 30,
    height: 30,
    borderRadius: radii.xs,
    backgroundColor: 'rgba(255,107,107,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warnBox: {
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255,107,107,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,107,107,0.3)',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  warnText: { flex: 1, fontFamily: fonts.sans, fontSize: 12.5, color: colors.fg, lineHeight: 19 },
  confirmRow: { flexDirection: 'row', gap: 8 },
  leaveBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radii.md,
    backgroundColor: colors.err,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaveBtnText: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: '#fff' },
});
