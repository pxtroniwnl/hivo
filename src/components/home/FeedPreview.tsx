// Port del preview de feed del clan (hivo-design/home.jsx:621-644).
// Solo se muestra cuando el usuario pertenece a un clan; enseña 2 items.
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, Card, Chip } from '@/components/ui';
import { colors, fonts, type } from '@/theme';
import type { FeedItem } from '@/data/types';

type FeedPreviewProps = {
  feed: FeedItem[];
  onSeeAll?: () => void;
};

export function FeedPreview({ feed, onSeeAll }: FeedPreviewProps) {
  return (
    <View>
      <View style={styles.headRow}>
        <Text style={type.xs}>From your clan</Text>
        <Pressable onPress={onSeeAll}>
          <Text style={[type.sm, styles.seeAll]}>See all</Text>
        </Pressable>
      </View>
      <View style={styles.list}>
        {feed.slice(0, 2).map((f) => (
          <Card key={f.id} padding={12} style={styles.item}>
            <Avatar name={f.who} size={32} />
            <View style={styles.body}>
              <Text style={[type.sm, styles.line]}>
                <Text style={styles.who}>{f.who}</Text>{' '}
                <Text style={styles.action}>{f.action}</Text>
              </Text>
              <Text style={styles.detail}>{f.detail}</Text>
            </View>
            {f.badge && <Chip variant="acc">{f.badge}</Chip>}
            {f.alert && (
              <Chip style={styles.rescueChip} textStyle={styles.rescueText}>
                Rescue
              </Chip>
            )}
          </Card>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  seeAll: {
    color: colors.fgMute,
  },
  list: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  line: {
    color: colors.fg,
  },
  who: {
    fontFamily: fonts.sansSemiBold,
  },
  action: {
    color: colors.fgMute,
  },
  detail: {
    marginTop: 2,
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.fgMid,
  },
  rescueChip: {
    backgroundColor: 'rgba(245,181,74,0.15)',
    borderColor: 'transparent',
  },
  rescueText: {
    color: colors.warn,
  },
});
