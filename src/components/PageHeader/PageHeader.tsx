import { HStack, Text, VStack } from 'native-base';
import { ReactNode } from 'react';
import { Action, Actions } from '../Actions';

interface PageHeaderProps {
  actions?: Action[];
  children?: ReactNode;
  subtitle?: string;
  title: string;
}

export const PageHeader = ({ actions, children, subtitle, title }: PageHeaderProps) => (
  <>
    <HStack alignItems={'center'} bg={'primary.900'} p={3} justifyContent={'space-between'} safeAreaTop>
      <VStack>
        <Text color={'text.50'} fontSize={20} fontWeight={'bold'}>
          {title}
        </Text>
        <Text color={'text.200'} fontSize={'sm'} fontWeight={'bold'} lineHeight={15}>
          {subtitle ?? ' '}
        </Text>
      </VStack>
      {actions && <Actions actions={actions} />}
    </HStack>
    {children}
  </>
);
