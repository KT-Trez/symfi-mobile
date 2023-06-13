import {Text} from 'native-base';
import React from 'react';


interface TimestampProps {
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
    size?: number | string;
    text: string;
    top?: number | string;
}

function Overlay({bottom, left, right, size, text, top}: TimestampProps) {
    return (
        <Text bold
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
}

export default Overlay;
