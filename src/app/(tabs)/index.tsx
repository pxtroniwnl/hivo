// Pantalla Today — port de HomeScreen (hivo-design/home.jsx:517-650).
// Estado inicial como el prototipo (app.jsx:38-41): sin clan (JoinClanStrip) y
// sin workout activo hasta que se marque `current` desde Train.
// expo-router (SDK 56) vendoriza bottom-tabs y no re-exporta este hook por una
// ruta pública; el deep-import es la única forma de obtener la altura medida
// del tab bar (necesaria porque el bar es absolute/translúcido).
import { useBottomTabBarHeight } from 'expo-router/build/react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClanStrip } from '@/components/home/ClanStrip';
import { DayDetail } from '@/components/home/DayDetail';
import { FeedPreview } from '@/components/home/FeedPreview';
import { JoinClanStrip } from '@/components/home/JoinClanStrip';
import { NotificationsSheet } from '@/components/home/NotificationsSheet';
import { StreakSpiral } from '@/components/home/StreakSpiral';
import { TodayHero } from '@/components/home/TodayHero';
import { WarmupCarousel } from '@/components/home/WarmupCarousel';
import { WarmupSheet } from '@/components/home/WarmupSheet';
import { WeekStrip } from '@/components/home/WeekStrip';
import { Avatar, Icon } from '@/components/ui';
import { FEED, ROUTINES, USER, WARMUPS, WEEK } from '@/data/mock';
import type { Warmup } from '@/data/types';
import { getGreeting } from '@/lib/today';
import { useAppState } from '@/state/app-state';
import { colors, radii, screenInset, type } from '@/theme';

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const { myWorkouts, myRoutines, userClan } = useAppState();

  const todayIdx = WEEK.findIndex((d) => d.status === 'today');
  const [selectedIdx, setSelectedIdx] = useState(todayIdx);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [warmupOpen, setWarmupOpen] = useState<Warmup | null>(null);

  const firstName = USER.name.split(' ')[0];
  const greeting = getGreeting(new Date().getHours());
  const isHistory = selectedIdx !== todayIdx;

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: tabBarHeight + 24,
        }}
      >
        {/* Topbar (tokens.css:198-201) */}
        <View style={styles.topbar}>
          <View style={styles.topbarLeft}>
            {/* El proto usa gradiente accent→accent-deep en el avatar propio;
                se aproxima con accent-deep sólido (Avatar no soporta gradiente). */}
            <Avatar name={USER.name} size={36} color={colors.accentDeep} />
            <View>
              <Text style={type.xs}>{isHistory ? 'History' : greeting}</Text>
              <Text style={[type.h3, styles.topbarName]}>{firstName}</Text>
            </View>
          </View>
          {isHistory ? (
            <Pressable
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              onPress={() => setSelectedIdx(todayIdx)}
            >
              <Icon.close size={16} color={colors.fgMid} />
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              onPress={() => setNotifsOpen(true)}
            >
              <Icon.bell size={18} color={colors.fgMid} />
              {/* Dot de no-leídas (glow-pulse del proto omitido: animación decorativa). */}
              <View style={styles.bellDot} />
            </Pressable>
          )}
        </View>

        {isHistory ? (
          <DayDetail
            day={WEEK[selectedIdx]}
            week={WEEK}
            todayIdx={todayIdx}
            onBackToToday={() => setSelectedIdx(todayIdx)}
            onJump={setSelectedIdx}
          />
        ) : (
          <>
            {/* Hero del entreno de hoy */}
            <View style={styles.heroWrap}>
              <TodayHero
                myWorkouts={myWorkouts}
                myRoutines={myRoutines}
                trendingRoutines={ROUTINES.trending}
                onStart={() => router.push('/active')}
                onGoToTrain={() => router.navigate('/train')}
              />
            </View>

            {/* Carrusel de warmups */}
            <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.section}>
              <View style={styles.sectionHead}>
                <Text style={type.xs}>Warm up first</Text>
                <Text style={[type.sm, styles.sectionHint]}>5–10 min</Text>
              </View>
              <WarmupCarousel warmups={WARMUPS} onOpen={setWarmupOpen} />
            </Animated.View>

            {/* Semana */}
            <Animated.View entering={FadeInDown.duration(400)} style={styles.weekSection}>
              <View style={[styles.sectionHead, styles.weekHead]}>
                <Text style={type.xs}>This week</Text>
                <Text style={[type.sm, { color: colors.fgMute }]}>4/5 logged</Text>
              </View>
              <WeekStrip week={WEEK} selectedIdx={selectedIdx} onPickDay={setSelectedIdx} />
            </Animated.View>

            {/* Streak */}
            <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.cardSection}>
              <StreakSpiral days={USER.streak} shields={USER.shields} />
            </Animated.View>

            {/* Clan: con clan → strip + feed preview; sin clan → CTA de descubrir. */}
            <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.cardSection}>
              {userClan ? (
                <ClanStrip clan={userClan} onOpen={() => router.navigate('/squad')} />
              ) : (
                <JoinClanStrip onOpen={() => router.navigate('/squad')} />
              )}
            </Animated.View>

            {userClan ? (
              <Animated.View entering={FadeInDown.delay(160).duration(400)} style={styles.cardSection}>
                <FeedPreview feed={FEED} onSeeAll={() => router.navigate('/squad')} />
              </Animated.View>
            ) : null}
          </>
        )}
      </ScrollView>

      {notifsOpen && <NotificationsSheet onClose={() => setNotifsOpen(false)} />}
      {warmupOpen && <WarmupSheet warmup={warmupOpen} onClose={() => setWarmupOpen(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg0,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: screenInset,
  },
  topbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topbarName: {
    marginTop: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.bg2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  heroWrap: {
    marginTop: 4,
  },
  section: {
    paddingTop: 14,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: screenInset,
    marginBottom: 10,
  },
  sectionHint: {
    fontSize: 11,
    color: colors.fgMute,
  },
  weekSection: {
    marginTop: 22,
  },
  weekHead: {
    alignItems: 'center',
    marginBottom: 10,
  },
  cardSection: {
    paddingTop: 14,
    paddingHorizontal: screenInset,
  },
});
