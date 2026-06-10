import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hivo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08080a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#f5f5f7',
    fontSize: 26,
    fontWeight: '600',
  },
});
