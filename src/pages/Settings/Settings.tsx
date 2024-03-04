import { Divider, VStack } from 'native-base';
import React, { useCallback, useState } from 'react';
import { AppBar } from '../../components/AppBar';
import { ButtonSetting } from '../../components/Settings';
import usePluralForm from '../../hooks/usePluralForm';
import SettingsService from '../../services/settings.service';
import useResourceCount from './hooks/useResourceCount';
import ServerSetup from './ServerSetup';

function Settings() {
  const [playListsCount, songsCount, recount] = useResourceCount();
  const [reloadingFromDisc, setReloadingFromDisc] = useState(false);

  // const [syncID, setSyncID] = useState();
  // const [uid, setUID] = useState('');

  const reloadSongs = useCallback(async () => {
    setReloadingFromDisc(true);
    await SettingsService.reloadSongsFromDisc();
    await recount();
    setReloadingFromDisc(false);
  }, []);

  return (
    <>
      <AppBar
        subtitle={`${playListsCount} playlist${usePluralForm(playListsCount)} | ${songsCount} song${usePluralForm(
          songsCount,
        )}`}
        title={'Settings'}
      />

      <VStack bg={'primary.100'} h={'full'}>
        <ButtonSetting
          description={'Reload Songs from Disc'}
          buttonText={'Reload'}
          icon={'cached'}
          isSaving={reloadingFromDisc}
          onPress={reloadSongs}
        />
        <Divider />

        <ServerSetup />
        <Divider />

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
    </>
  );
}

export default Settings;
