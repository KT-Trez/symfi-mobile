import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Button, FormControl, Icon, Input, Modal} from 'native-base';
import React, {useState} from 'react';
import PlayListService from '../../../services/playlist.service';


interface PlayListCreatorProps {
    hide: () => void;
    isVisible: boolean;
    refreshList?: () => void;
}

function PlayListCreator({hide, isVisible, refreshList}: PlayListCreatorProps) {
    const [isNameValid, setIsNameValid] = useState(false);
    const [name, setName] = useState('');

    const createPlayList = async () => {
        if (!name)
            return setIsNameValid(true);

        await PlayListService.create(name);

        if (refreshList)
            refreshList();
        hide();
    };

    return (
        <Modal isOpen={isVisible} onClose={hide}>
            <Modal.Content>
                <Modal.CloseButton/>
                <Modal.Header>Create Playlist</Modal.Header>
                <Modal.Body>
                    <FormControl isInvalid={isNameValid}>
                        <FormControl.Label>Name</FormControl.Label>
                        <Input isRequired={true}
                               onChangeText={setName}
                               placeholder={'Hi Cristi'}
                               value={name}
                        />
                        <FormControl.ErrorMessage
                            leftIcon={<Icon as={MaterialCommunityIcons} name={'alert-circle-outline'} size={'sm'}/>}
                        >
                            Name cannot be empty.
                        </FormControl.ErrorMessage>
                    </FormControl>

                </Modal.Body>

                <Modal.Footer>
                    <Button.Group>
                        <Button onPress={hide} variant={'ghost'}>Back</Button>
                        <Button onPress={createPlayList}>Create</Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}

export default PlayListCreator;
