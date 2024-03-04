import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type PageHeaderContentProps = {
  subtitle?: string;
  title: string;
};

export const PageHeaderContent = ({ subtitle, title }: PageHeaderContentProps) => (
  <View style={styles.view}>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  view: {
    display: 'flex',
  },
});
