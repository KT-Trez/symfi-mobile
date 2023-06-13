import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Icon, IconButton, useTheme} from 'native-base';
import React from 'react';


interface AppBarButtonProps {
    icon: string;
    onPress?: () => void;
    triggerProps?: any;
}

function AppBarButton({icon, onPress, triggerProps}: AppBarButtonProps) {
    const {colors} = useTheme()

    return (
        <IconButton
            icon={<Icon color={colors.text['50']} as={MaterialCommunityIcons} name={icon} size={'md'}/>}
            onPress={onPress}
            size={'md'}
            {...triggerProps}
        />
    );
}

export default AppBarButton;
