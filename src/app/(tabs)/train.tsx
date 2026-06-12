// Tab Train — port de TrainScreen (train.jsx:57-167). Los editores del proto
// eran estado local; aquí son rutas (/routine-editor, /workout-editor) que
// leen el draft del context.
import { useBottomTabBarHeight } from 'expo-router/build/react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TrainList } from '@/components/train/TrainList';
import type { Routine, Workout } from '@/data/types';
import { setActiveWorkout } from '@/lib/library';
import { useAppState } from '@/state/app-state';
import { colors } from '@/theme';

export default function TrainScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const { myRoutines, myWorkouts, setMyWorkouts, setDraftRoutine, setDraftWorkout } = useAppState();

  const openRoutine = (r: Routine) => {
    setDraftRoutine(JSON.parse(JSON.stringify(r)) as Routine);
    router.push('/routine-editor');
  };
  const openWorkout = (w: Workout) => {
    setDraftWorkout(JSON.parse(JSON.stringify(w)) as Workout);
    router.push('/workout-editor');
  };
  // Drafts en blanco con los shapes exactos del proto (train.jsx:69-76,89-102).
  const buildRoutine = () => {
    setDraftRoutine({
      id: 'r-new-' + Date.now(),
      name: 'New routine',
      author: 'You',
      level: 'Intermediate',
      tags: [],
      description: '',
      exercises: [],
    });
    router.push('/routine-editor');
  };
  const buildWorkout = () => {
    setDraftWorkout({
      id: 'w-new-' + Date.now(),
      name: 'New workout',
      author: 'You',
      level: 'Intermediate',
      tags: [],
      description: '',
      daysPerWeek: 4,
      duration: '4 weeks',
      days: [
        { day: 'Mon', name: 'Day 1', routineId: null },
        { day: 'Wed', name: 'Day 2', routineId: null },
        { day: 'Fri', name: 'Day 3', routineId: null },
        { day: 'Sun', name: 'Day 4', routineId: null },
      ],
    });
    router.push('/workout-editor');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg0 }}>
      <TrainList
        myRoutines={myRoutines}
        myWorkouts={myWorkouts}
        onOpenRoutine={openRoutine}
        onOpenWorkout={openWorkout}
        onBuildRoutine={buildRoutine}
        onBuildWorkout={buildWorkout}
        onSetActive={(id) => setMyWorkouts((prev) => setActiveWorkout(prev, id))}
        topPadding={insets.top + 8}
        bottomPadding={tabBarHeight + 24}
      />
    </View>
  );
}
