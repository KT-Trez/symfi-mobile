import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Fab, Icon } from 'native-base';
import { PageHeader } from '../../components';
import { usePluralFormV2 } from '../../hooks/usePluralFormV2';
import { CollectionNavigatorProps } from '../../types';
import { CollectionList, usePageHeaderActions } from './CollectionList';
import { useList } from './context';

export const CollectionPage = () => {
  const actions = usePageHeaderActions();
  const { displayedData } = useList();
  const { navigate } = useNavigation<CollectionNavigatorProps>();
  const { s } = usePluralFormV2(displayedData.length);

  return (
    <PageHeader actions={actions} subtitle={`${displayedData.length} item${s}`} title="Collections">
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
