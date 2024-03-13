import { PageHeader } from '@components';
import { usePluralFormV2 } from '@hooks';
import { VStack } from 'native-base';
import { useResourceCount } from './hooks';
import { ReloadSongsFromDisc, ServerSetup } from './sections';
// import useResourceCount from './hooks/useResourceCount';
// import ServerSetup from './ServerSetup';

export const SettingsPage = () => {
  const {
    counts: [collections, songs],
    recount,
  } = useResourceCount();

  const { s: collectionS } = usePluralFormV2(collections);
  const { s: songS } = usePluralFormV2(songs);

  // const [syncID, setSyncID] = useState();
  // const [uid, setUID] = useState('');

  return (
    <PageHeader subtitle={`${collections} collection${collectionS} | ${songs} song${songS}`} title="Settings">
      <VStack h={'full'}>
        <ReloadSongsFromDisc recount={recount} />
        <ServerSetup />

        {/*<Setting buttons={exportButtons} style={css.topSetting}>*/}
        {/*	<TextSetting variant={'bodyMedium'}>{playListsCount} PlayLists | {songsCount} Songs</TextSetting>*/}
        {/*</Setting>*/}

        {/*<Setting buttons={importButtons}>*/}
        {/*	<SafeAreaView>*/}
        {/*		<TextSetting dense*/}
        {/*				   label={'UID'}*/}
        {/*				   mode={'outlined'}*/}
        {/*				   onChangeText={setUID}*/}
        {/*				   placeholder={'002137'}*/}
        {/*				   style={css.textInput}*/}
        {/*				   value={uid}/>*/}
        {/*	</SafeAreaView>*/}
        {/*</Setting>*/}
      </VStack>
    </PageHeader>
  );
};
