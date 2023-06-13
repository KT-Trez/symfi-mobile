import {HStack, Text, useTheme, VStack} from 'native-base';
import React, {ReactNode} from 'react';
import {StatusBarStyle} from 'react-native';


interface AppBarProps {
    children?: ReactNode;
    style?: StatusBarStyle | null;
    subtitle: string;
    title: string;
}

function AppBar({children, subtitle, title}: AppBarProps) {
    const {colors} = useTheme();

    return (
        <HStack alignItems={'center'} bg={colors.primary['900']} p={3} justifyContent={'space-between'}>
            <VStack>
                <Text color={colors.text['50']} fontSize={20} fontWeight={'bold'}>{title}</Text>
                <Text color={colors.text['200']} fontSize={'sm'} fontWeight={'bold'} lineHeight={15}>{subtitle}</Text>
            </VStack>
            <HStack alignItems={'center'}>
                {children}
            </HStack>
        </HStack>
    );
}

export default AppBar;
