// Port de Sheet (hivo-design/active.jsx:657-692) — modal bottom-up con scrim,
// handle, título y botón de cierre.
import type { ReactNode } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from './icons';
import { colors, radii, type } from '@/theme';

type SheetProps = {
  children: ReactNode;
  onClose: () => void;
  title: string;
  subtitle?: string;
};

export function Sheet({ children, onClose, title, subtitle }: SheetProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.scrim} onPress={onClose} />
        <View style={[styles.panel, { paddingBottom: 28 + insets.bottom }]}>
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={type.h2}>{title}</Text>
              {subtitle ? <Text style={[type.sm, { marginTop: 4 }]}>{subtitle}</Text> : null}
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Icon.close size={14} color={colors.fgMid} />
            </Pressable>
          </View>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    backgroundColor: colors.bg2,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lineStrong,
    padding: 18,
    maxHeight: '80%',
  },
  handleRow: {
    alignItems: 'center',
    marginBottom: 14,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bg4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    paddingRight: 10,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
