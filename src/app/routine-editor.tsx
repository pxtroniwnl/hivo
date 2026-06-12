// Ruta del editor de Routine. El draft vive en el context (lo setea Train);
// guardar = upsert en myRoutines (train.jsx:77-85).
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { RoutineDetail } from '@/components/train/RoutineDetail';
import { ShareSheet } from '@/components/train/ShareSheet';
import { useAppState } from '@/state/app-state';
import { colors, type } from '@/theme';

export default function RoutineEditorRoute() {
  const router = useRouter();
  const { draftRoutine, setDraftRoutine, myRoutines, setMyRoutines } = useAppState();
  const [shareOpen, setShareOpen] = useState(false);

  if (!draftRoutine) {
    // Solo alcanzable navegando directo a la URL sin draft.
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg0, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={type.sm}>No routine selected.</Text>
      </View>
    );
  }

  const exists = myRoutines.some((r) => r.id === draftRoutine.id);
  const isNew = !exists && draftRoutine.author === 'You';

  const save = () => {
    setMyRoutines((prev) => {
      const idx = prev.findIndex((r) => r.id === draftRoutine.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = draftRoutine;
        return next;
      }
      return [{ ...draftRoutine, author: 'You' }, ...prev];
    });
  };

  return (
    <>
      <RoutineDetail
        routine={draftRoutine}
        isNew={isNew}
        onChange={setDraftRoutine}
        onSave={save}
        onBack={() => router.back()}
        onShare={() => setShareOpen(true)}
      />
      {shareOpen && (
        <ShareSheet kind="routine" item={draftRoutine} onClose={() => setShareOpen(false)} />
      )}
    </>
  );
}
