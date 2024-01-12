import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, Button, HStack, Icon, Text, useColorModeValue } from 'native-base';
import React from 'react';

interface ButtonSettingProps {
  buttonText: string;
  description: string;
  icon: string;
  isSaving: boolean;
  onPress: () => void;
}

function ButtonSetting({ buttonText, description, icon, isSaving, onPress }: ButtonSettingProps) {
  const bgColor = useColorModeValue('light.200', 'light.700');

  return (
    <Box m={1} p={2}>
      <HStack
        alignItems={'center'}
        bgColor={bgColor}
        minHeight={'46px'}
        justifyContent={'space-between'}
        roundedLeft={'sm'}
      >
        <Text bold ml={3}>
          {description}
        </Text>
        <Button
          h={'full'}
          isLoading={isSaving}
          onPress={onPress}
          roundedLeft={0}
          startIcon={<Icon as={MaterialCommunityIcons} name={icon} size={6} />}
          w={'1/3'}
        >
          {buttonText}
        </Button>
      </HStack>
    </Box>
  );
}

export default ButtonSetting;
