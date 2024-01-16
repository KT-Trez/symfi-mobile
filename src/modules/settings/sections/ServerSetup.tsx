import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Box, Divider, HStack, Icon, Spinner, Text, useColorModeValue } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { TextField } from '../../../components';
import ApiService from '../../../services/api.service';

export const ServerSetup = () => {
  const bgColor = useColorModeValue('light.200', 'light.700');

  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectToRemote = useCallback(async (remote: string) => {
    setIsConnecting(true);
    try {
      const res = await ApiService.axios({
        baseURL: remote,
        method: 'get',
        responseType: 'json',
        timeout: 5000,
        url: '/v2/ping',
      });

      setIsConnected(res.data.success ?? false);
      return res.data.success;
    } catch (err) {
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const getSavedRemote = useCallback(async () => (await AsyncStorage.getItem('@config--remote')) ?? '', []);

  const onMount = useCallback(async () => connectToRemote(await getSavedRemote()), [connectToRemote, getSavedRemote]);

  const changeRemote = useCallback(
    async (remote: string) => {
      if (remote.length === 0) {
        return await AsyncStorage.removeItem('@config--remote');
      }

      await ApiService.changeRemote(remote);
      const connected = await connectToRemote(remote);

      if (!connected) {
        ToastAndroid.showWithGravity('No connection: ' + remote, ToastAndroid.LONG, ToastAndroid.BOTTOM);
      }
    },
    [connectToRemote],
  );

  useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <>
      <Box pr={2}>
        <TextField
          initialValue={getSavedRemote}
          label="Server Address"
          onUpdate={changeRemote}
          placeholder="https://api-musicly.onrender.com"
        />

        <HStack alignItems={'center'} bgColor={bgColor} m={3} minHeight={'46px'} mr={1} mt={0} p={2} rounded={'sm'}>
          <HStack justifyContent={'center'} w={10}>
            {isConnecting ? (
              <Spinner />
            ) : (
              <Icon
                as={MaterialCommunityIcons}
                name={isConnected ? 'access-point-network' : 'access-point-network-off'}
                color={'text.900'}
              />
            )}
          </HStack>

          <Text>
            {isConnecting
              ? 'Testing connection ...'
              : isConnected
                ? 'Connection established'
                : "Can't connect to server"}
          </Text>
        </HStack>
      </Box>
      <Divider />
    </>
  );
};
