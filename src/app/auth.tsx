// Ruta de auth (gate en (tabs)/_layout). El usuario autenticado mock se
// completa con los datos del USER del prototipo (app.jsx:40,70-88).
import { useRouter } from 'expo-router';

import { AuthScreen } from '@/components/auth/AuthScreen';
import { USER } from '@/data/mock';
import { useAppState } from '@/state/app-state';

export default function AuthRoute() {
  const { setAuthedUser } = useAppState();
  const router = useRouter();
  return (
    <AuthScreen
      onAuthed={(u) => {
        setAuthedUser({ ...USER, ...u });
        router.replace('/');
      }}
    />
  );
}
