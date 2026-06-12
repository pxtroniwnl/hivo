// Ruta del editor de Workout. Guardar = upsert en myWorkouts (train.jsx:103-111).
// Abrir una rutina desde un día → setea draftRoutine y apila /routine-editor.
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { WorkoutDetail } from '@/components/train/WorkoutDetail';
import type { Routine } from '@/data/types';
import { useAppState } from '@/state/app-state';
import { colors, type } from '@/theme';

export default function WorkoutEditorRoute() {
  const router = useRouter();
  const { draftWorkout, setDraftWorkout, myWorkouts, setMyWorkouts, myRoutines, setDraftRoutine } =
    useAppState();

  if (!draftWorkout) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg0, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={type.sm}>No workout selected.</Text>
      </View>
    );
  }

  const exists = myWorkouts.some((w) => w.id === draftWorkout.id);
  const isNew = !exists && draftWorkout.author === 'You';

  const save = () => {
    setMyWorkouts((prev) => {
      const idx = prev.findIndex((w) => w.id === draftWorkout.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = draftWorkout;
        return next;
      }
      return [{ ...draftWorkout, author: 'You' }, ...prev];
    });
  };

  const openRoutine = (r: Routine) => {
    setDraftRoutine(JSON.parse(JSON.stringify(r)) as Routine);
    router.push('/routine-editor');
  };

  return (
    <WorkoutDetail
      workout={draftWorkout}
      isNew={isNew}
      myRoutines={myRoutines}
      onChange={setDraftWorkout}
      onSave={save}
      onBack={() => router.back()}
      onOpenRoutine={openRoutine}
    />
  );
}
