import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, FormControl, Icon, Input, useColorModeValue } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';

type TextFieldProps = {
  buttonIcon?: false | string;
  buttonLabel?: string;
  clearOnUpdate?: boolean;
  initialValue?: string | (() => Promise<string>);
  label: string;
  onUpdate: ((value: string) => void) | ((value: string) => Promise<void>);
  placeholder?: string;
};

export const TextField = ({
  buttonIcon = 'content-save-outline',
  buttonLabel = 'Save',
  clearOnUpdate,
  initialValue,
  label,
  onUpdate,
  placeholder,
}: TextFieldProps) => {
  const bgColor = useColorModeValue('light.200', 'light.700');

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const onInit = useCallback(async () => {
    if (initialValue) {
      typeof initialValue === 'string' ? setValue(initialValue) : setValue(await initialValue());
    }
  }, [initialValue]);

  const onPress = useCallback(async () => {
    setIsUpdating(true);
    await onUpdate(value);
    setIsUpdating(false);
    if (clearOnUpdate) {
      setValue('');
    }
  }, [clearOnUpdate, onUpdate, value]);

  useEffect(() => {
    onInit();
  }, [onInit]);

  return (
    <FormControl m={1} p={2}>
      <FormControl.Label>{label}</FormControl.Label>
      <Input
        bgColor={bgColor}
        InputRightElement={
          <Button
            h={'full'}
            isLoading={isUpdating}
            onPress={onPress}
            rounded={'none'}
            startIcon={buttonIcon ? <Icon as={MaterialCommunityIcons} name={buttonIcon} size={6} /> : undefined}
            w={'1/3'}
          >
            {buttonLabel}
          </Button>
        }
        onChangeText={setValue}
        placeholder={placeholder}
        size={'md'}
        variant={'filled'}
        value={value}
      />
    </FormControl>
  );
};
