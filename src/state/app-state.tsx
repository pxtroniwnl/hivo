// Estado global del shell — port de app.jsx:32-41: authedUser, userClan,
// gamification (kill-switch), myRoutines/myWorkouts editables y los drafts
// que los editores de Train leen/escriben (en el proto eran estado local de
// TrainScreen; aquí los editores son rutas separadas y necesitan el context).
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

import { ROUTINES, WORKOUTS } from '@/data/mock';
import type { Clan, Routine, User, Workout } from '@/data/types';

type AppState = {
  authedUser: User | null;
  setAuthedUser: (user: User | null) => void;
  userClan: Clan | null;
  setUserClan: (clan: Clan | null) => void;
  gamification: boolean;
  setGamification: (on: boolean) => void;
  myRoutines: Routine[];
  setMyRoutines: Dispatch<SetStateAction<Routine[]>>;
  myWorkouts: Workout[];
  setMyWorkouts: Dispatch<SetStateAction<Workout[]>>;
  draftRoutine: Routine | null;
  setDraftRoutine: Dispatch<SetStateAction<Routine | null>>;
  draftWorkout: Workout | null;
  setDraftWorkout: Dispatch<SetStateAction<Workout | null>>;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [authedUser, setAuthedUser] = useState<User | null>(null);
  const [userClan, setUserClan] = useState<Clan | null>(null);
  const [gamification, setGamification] = useState(true);
  const [myRoutines, setMyRoutines] = useState<Routine[]>(
    () => JSON.parse(JSON.stringify(ROUTINES.mine)) as Routine[],
  );
  const [myWorkouts, setMyWorkouts] = useState<Workout[]>(
    () => JSON.parse(JSON.stringify(WORKOUTS.mine)) as Workout[],
  );
  const [draftRoutine, setDraftRoutine] = useState<Routine | null>(null);
  const [draftWorkout, setDraftWorkout] = useState<Workout | null>(null);

  const value = useMemo(
    () => ({
      authedUser,
      setAuthedUser,
      userClan,
      setUserClan,
      gamification,
      setGamification,
      myRoutines,
      setMyRoutines,
      myWorkouts,
      setMyWorkouts,
      draftRoutine,
      setDraftRoutine,
      draftWorkout,
      setDraftWorkout,
    }),
    [authedUser, userClan, gamification, myRoutines, myWorkouts, draftRoutine, draftWorkout],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
