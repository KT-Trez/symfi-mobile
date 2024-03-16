import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export const Loader = () => (
  <View style={styles.view}>
    <ActivityIndicator size="large" />
  </View>
);

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
