// Port de NotificationsSheet (hivo-design/home.jsx:797-841) — lista con estado
// read/unread y acción "Mark all read".
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, Sheet } from '@/components/ui';
import { colors, fonts, radii, type } from '@/theme';
import { NOTIFICATIONS } from '@/data/mock';
import type { AppNotification, NotificationKind } from '@/data/types';

const KIND_ICONS: Record<NotificationKind, (typeof Icon)['shield']> = {
  raid: Icon.shield,
  pr: Icon.trophy,
  autoreg: Icon.bolt,
  clan: Icon.heart,
  mission: Icon.check,
};

type NotificationsSheetProps = {
  onClose: () => void;
  notifications?: AppNotification[];
};

export function NotificationsSheet({ onClose, notifications = NOTIFICATIONS }: NotificationsSheetProps) {
  const [items, setItems] = useState(notifications);
  const unread = items.filter((n) => n.unread).length;

  return (
    <Sheet onClose={onClose} title="Notifications" subtitle={unread ? `${unread} unread` : 'All caught up'}>
      <View style={styles.markAllRow}>
        <Pressable onPress={() => setItems(items.map((n) => ({ ...n, unread: false })))}>
          <Text style={styles.markAll}>Mark all read</Text>
        </Pressable>
      </View>
      <View style={styles.list}>
        {items.map((n) => {
          const KindIcon = KIND_ICONS[n.kind];
          return (
            <View key={n.id} style={[styles.item, n.unread && styles.itemUnread]}>
              <View style={styles.iconBubble}>
                <KindIcon size={14} color={colors.accent} />
              </View>
              <View style={styles.body}>
                <View style={styles.titleRow}>
                  <Text style={[type.h3, styles.title]}>{n.title}</Text>
                  <Text style={[type.xs, styles.when]}>{n.when}</Text>
                </View>
                <Text style={[type.sm, styles.bodyText]}>{n.body}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  markAllRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  markAll: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.accent,
  },
  list: {
    gap: 6,
  },
  item: {
    padding: 12,
    borderRadius: radii.sm + 2, // 12px
    backgroundColor: colors.bg3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  itemUnread: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: radii.sm - 2, // 8px
    backgroundColor: colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 8,
  },
  title: {
    fontSize: 13,
    flex: 1,
  },
  when: {
    fontSize: 10,
    color: colors.fgMute,
    flexShrink: 0,
  },
  bodyText: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 12 * 1.4,
  },
});
