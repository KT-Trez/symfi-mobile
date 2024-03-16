import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { PageHeaderContent } from './PageHeaderContent';

const APPBAR_HEIGHT = 70;

type PageHeaderProps = {
  actions?: ReactNode;
  children?: ReactNode;
  subtitle?: string;
  title: string;
};

export const PageHeader = ({ actions, children, subtitle, title }: PageHeaderProps) => (
  <>
    <Appbar style={[styles.appbar]}>
      {actions ? actions : <PageHeaderContent subtitle={subtitle} title={title} />}
    </Appbar>
    {children}
  </>
);

const styles = StyleSheet.create({
  appbar: {
    height: APPBAR_HEIGHT,
    paddingHorizontal: 16,
  },
});
