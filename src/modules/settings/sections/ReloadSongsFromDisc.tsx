import { Divider } from 'native-base';
import { useCallback, useState } from 'react';
import { ButtonSetting } from '../../../components/Settings';
import SettingsService from '../../../services/settings.service';

type ReloadSongsFromDiscProps = {
  recount: () => Promise<void>;
};

export const ReloadSongsFromDisc = ({ recount }: ReloadSongsFromDiscProps) => {
  const [isReloading, setIsReloading] = useState(false);

  const reloadSongsFromDisc = useCallback(async () => {
    setIsReloading(true);
    await SettingsService.reloadSongsFromDisc();
    await recount();
    setIsReloading(false);
  }, [recount]);

  return (
    <>
      <ButtonSetting
        description={'Reload Songs from Disc'}
        buttonText={'Reload'}
        icon={'cached'}
        isSaving={isReloading}
        onPress={reloadSongsFromDisc}
      />
      <Divider />
    </>
  );
};
