import { Text } from 'native-base';

type OverlayProps = {
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  size?: number | string;
  text: string;
  top?: number | string;
};

export const Overlay = ({ bottom, left, right, size, text, top }: OverlayProps) => {
  return (
    <Text
      bold
      bg={'rgba(0, 0, 0, 0.75)'}
      borderColor={'rgba(230, 230, 230, 0.4)'}
      borderRadius={'xs'}
      borderStyle={'solid'}
      borderWidth={1}
      bottom={bottom}
      color={'#fff'}
      fontSize={size}
      left={left}
      p={1}
      position={'absolute'}
      right={right}
      textAlign={'center'}
      top={top}
    >
      {text}
    </Text>
  );
};
