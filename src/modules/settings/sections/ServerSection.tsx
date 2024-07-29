import { ConfigItemsKeys } from '@config';
import { ConfigItemModel } from '@models';
import { useObject, useRealm } from '@realm/react';
import { useCallback, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { Section } from '../components';

export const ServerSection = () => {
  const apiOrigin = useObject(ConfigItemModel, ConfigItemsKeys.API_ORIGIN);
  const realm = useRealm();
  const [hasTriedInitialConnect, setHasTriedInitialConnect] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>(apiOrigin?.value || '');
  const { colors } = useTheme();

  const connectedErrorIcon = isError ? 'alert-circle-outline' : 'check-circle-outline';
  const connectedIcon = isConnected ? 'check-circle-outline' : connectedErrorIcon;
  const connectingIcon = isConnecting ? 'progress-question' : connectedIcon;

  const connect = useCallback(async () => {
    setIsConnected(false);
    setIsConnecting(true);

    const originUrl = new URL(origin);
    originUrl.pathname = '/v2/ping';

    try {
      realm.write(() => {
        if (apiOrigin) {
          apiOrigin.value = origin;
        } else {
          realm.create(
            ConfigItemModel.schema.name,
            ConfigItemModel.generate({ key: ConfigItemsKeys.API_ORIGIN, value: origin }),
          );
        }
      });

      const res = await fetch(originUrl.toString());

      if (res.ok) {
        setIsConnected(true);
      } else {
        setIsError(true);
      }
    } catch (err) {
      setIsError(true);
      ToastAndroid.showWithGravity('Failed to connect to the server.', ToastAndroid.SHORT, ToastAndroid.CENTER);
    } finally {
      setIsConnecting(false);
    }
  }, [apiOrigin, origin, realm]);

  useEffect(() => {
    if (!hasTriedInitialConnect) {
      connect().then(() => setHasTriedInitialConnect(true));
    }
  }, [connect, hasTriedInitialConnect]);

  return (
    <Section hasDivider={false} title="Server">
      <TextInput
        disabled={isConnecting}
        error={isError}
        inputMode="url"
        label="URL"
        left={<TextInput.Icon color={isError ? colors.error : undefined} icon={connectingIcon} />}
        mode="outlined"
        onChangeText={setOrigin}
        onSubmitEditing={connect}
        placeholder="https://api-musicly.onrender.com"
        value={origin}
      />
    </Section>
  );
};
