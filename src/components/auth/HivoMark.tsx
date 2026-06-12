// Port de HivoMark (hivo-design/auth.jsx:99-115).
import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, type } from '@/theme';

export function HivoMark() {
  return (
    <View style={styles.row}>
      {/* El drop-shadow accent del proto no existe en RN; el PNG ya lleva el glow. */}
      <Image source={require('../../../assets/images/hivo-mark.png')} style={styles.mark} />
      <View>
        <Text style={styles.word}>Hivo</Text>
        <Text style={[type.xs, styles.tagline]}>strength · together</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mark: {
    width: 56,
    height: 56,
  },
  word: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 26,
    letterSpacing: 26 * -0.03,
    color: colors.fg,
  },
  tagline: {
    marginTop: -2,
    fontSize: 10,
  },
});
