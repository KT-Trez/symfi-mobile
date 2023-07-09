import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Button, FormControl, Icon, Input} from 'native-base';
import React from 'react';


interface TextSettingProps {
    isInvalid?: boolean;
    isSaving: boolean;
    name: string;
    onSave: () => void;
    onSubmitEditing?: () => void;
    onTextChange: (text: string) => void;
    placeholder?: string;
    value: string;
}

function TextSetting({
                         isInvalid,
                         isSaving,
                         name,
                         onSave,
                         onSubmitEditing,
                         onTextChange,
                         placeholder,
                         value
                     }: TextSettingProps) {
    return (
        <FormControl isInvalid={isInvalid} m={1} p={2}>
            <FormControl.Label>{name}</FormControl.Label>
            <Input
                InputRightElement={
                    <Button h={'full'}
                            isLoading={isSaving}
                            onPress={onSave}
                            rounded={'none'}
                            startIcon={
                                <Icon as={MaterialCommunityIcons} name={'content-save-outline'} size={6}/>
                            }
                            w={'1/3'}
                    >
                        Save
                    </Button>
                }
                onChangeText={onTextChange}
                onSubmitEditing={onSubmitEditing}
                placeholder={placeholder}
                size={'md'}
                variant={'filled'}
                value={value}
            />
            <FormControl.ErrorMessage>{name} cannot be empty.</FormControl.ErrorMessage>
        </FormControl>
    );
}

export default TextSetting;
