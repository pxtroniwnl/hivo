// Ruta full-screen del logger (sin tab bar, como el proto al activar).
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ActiveWorkout } from '@/components/active/ActiveWorkout';

export default function ActiveRoute() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  return (
    <ActiveWorkout
      mode={mode === 'log-past' ? 'log-past' : 'live'}
      onExit={() => router.back()}
    />
  );
}
