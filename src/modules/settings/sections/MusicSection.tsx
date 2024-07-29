import { useCallback, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { FlatSetting, Section } from '../components';
import { useResources } from '../hooks';

export const MusicSection = () => {
  const { playlists, updateResources, songs } = useResources();
  const [isMigrating, setIsMigrating] = useState<boolean>(false);

  const migrateSchema = useCallback(async () => {
    setIsMigrating(true);

    try {
      const resources = await updateResources(playlists, songs);
      // todo: save backup to file and migrate the schema
    } catch (err) {
      ToastAndroid.showWithGravity('Failed to migrate the schema.', ToastAndroid.SHORT, ToastAndroid.CENTER);
    } finally {
      setIsMigrating(false);
    }
  }, [playlists, songs, updateResources]);

  return (
    <Section title="Music">
      <FlatSetting
        description="Migrate the schema of your Collections and Songs to the latest version."
        isLoading={isMigrating}
        onPress={migrateSchema}
        title="Migrate to v2.0.0"
      />
    </Section>
  );
};
