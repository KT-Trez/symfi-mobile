import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Box, Button, HStack, Icon} from 'native-base';
import React from 'react';
import {Cover} from '../Cover';
import {Overlay} from '../Overlay';


interface CoverChangeProps {
    coverUri: string | undefined;
    onDelete: () => void;
    onEdit: () => void;
}

function CoverSelector({coverUri, onDelete, onEdit}: CoverChangeProps) {
    return (
        <HStack justifyContent={'space-between'} m={1} p={2} w={'100%'}>
            <Box position={'relative'} style={{aspectRatio: 16 / 9}}>
                <Cover alt={'Resource Cover'} uri={coverUri}/>
                {!coverUri &&
                    <Overlay bottom={2} right={2} size={'xs'} text={'PLACEHOLDER'}/>
                }
            </Box>

            <Button.Group direction={'column'} w={'1/3'}>
                <Button onPress={onEdit}
                        startIcon={
                            <Icon as={MaterialCommunityIcons} name={'pencil-outline'} size={6}/>
                        }
                >Edit</Button>
                <Button disabled={!coverUri}
                        onPress={onDelete}
                        opacity={!coverUri ? 0.8 : 1}
                        startIcon={
                            <Icon as={MaterialCommunityIcons} name={'delete-forever-outline'} size={6}/>
                        }
                >Delete</Button>
            </Button.Group>
        </HStack>
    );
}

export default CoverSelector;
