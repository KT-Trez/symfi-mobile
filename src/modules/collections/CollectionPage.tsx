import { PageHeader } from '@components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePluralFormV3 } from '@hooks';
import { useNavigation } from '@react-navigation/native';
import type { CollectionNavigatorProps } from '@types';
import { Fab, Icon } from 'native-base';
import { CollectionList, usePageHeaderActions } from './CollectionList';
import { useList } from './context';

export const CollectionPage = () => {
  const actions = usePageHeaderActions();
  const { items } = useList();
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const s = usePluralFormV3(items.length);

  return (
    <PageHeader actions={actions} subtitle={`${items.length} item${s}`} title="Collections">
      <CollectionList />
      <Fab
        bottom={2}
        icon={<Icon as={MaterialCommunityIcons} name={'plus'} size={'xl'} />}
        onPress={() => navigate('CollectionForm')}
        renderInPortal={false}
        right={2}
      />
    </PageHeader>
  );
};
