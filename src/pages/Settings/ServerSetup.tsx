import {MaterialCommunityIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Box, HStack, Icon, Spinner, Text} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {ToastAndroid} from 'react-native';
import {TextSetting} from '../../components/Settings';
import ApiService from '../../services/api.service';


function ServerSetup() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [remote, setRemote] = useState('');

    const changeRemote = useCallback(async () => {
        if (!remote)
            return resetRemote();

        await ApiService.changeRemote(remote);
        const connected = await testConnection();

        if (!connected)
            ToastAndroid.showWithGravity('No connection: ' + remote, ToastAndroid.LONG, ToastAndroid.BOTTOM);
    }, [remote]);

    const getCurrentRemote = useCallback(async () => {
        setRemote(await AsyncStorage.getItem('@config--remote') ?? '');
    }, []);

    const resetRemote = useCallback(async () => {
        await AsyncStorage.removeItem('@config--remote');
        setRemote('');
    }, []);

    const testConnection = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await ApiService.axios({
                baseURL: remote,
                method: 'get',
                responseType: 'json',
                timeout: 5000,
                url: '/v2/ping'
            });

            setIsConnected(res.data.success ?? false);
            return res.data.success;
        } catch (err) {
            console.error(err);
            setIsConnected(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getCurrentRemote();
        testConnection();
    }, []);

    return (
        <Box pr={2}>
            <TextSetting
                isSaving={isLoading}
                name={'Server Address'}
                onSave={changeRemote}
                onSubmitEditing={changeRemote}
                onTextChange={setRemote}
                placeholder={'https://api-musicly.onrender.com'}
                value={remote}
            />

            <HStack
                alignItems={'center'}
                bg={'primary.50'}
                m={3}
                minHeight={'46px'}
                mr={1}
                mt={0}
                p={2}
                rounded={'sm'}
            >
                <HStack justifyContent={'center'} w={10}>
                    {isLoading ?
                        <Spinner/>
                        :
                        <Icon
                            as={MaterialCommunityIcons}
                            name={isConnected ? 'access-point-network' : 'access-point-network-off'}
                            color={'text.900'}
                        />
                    }
                </HStack>

                <Text>
                    {isLoading ?
                        'Testing connection ...'
                        :
                        isConnected ? 'Connection established' : 'Can\'t connect to server'
                    }
                </Text>

            </HStack>
        </Box>
    );
}

export default ServerSetup;
