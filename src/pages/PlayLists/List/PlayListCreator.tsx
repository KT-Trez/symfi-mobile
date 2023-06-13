import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Button, FormControl, Icon, Input, Modal} from 'native-base';
import React, {useState} from 'react';
import PlayListService from '../../../services/playlist.service';


interface PlayListCreatorProps {
    hide: () => void;
    isVisible: boolean;
    reloadList?: () => void;
}

function PlayListCreator({hide, isVisible, reloadList}: PlayListCreatorProps) {
    const [isNameValid, setIsNameValid] = useState(false);
    const [name, setName] = useState('');

    const createAlbum = async () => {
        if (!name)
            return setIsNameValid(true);

        await PlayListService.create(name);

        if (reloadList)
            reloadList();
        hide();
    };

    return (
        <Modal isOpen={isVisible} onClose={hide}>
            <Modal.Content>
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
                        <Button variant={'ghost'} onPress={hide}>Back</Button>
                        <Button onPress={createAlbum}>Create</Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}

export default PlayListCreator;
