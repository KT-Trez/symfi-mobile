import { useRandom } from '@hooks';
import { AspectRatio, Image, Skeleton } from 'native-base';
import { ResponsiveValue } from 'native-base/lib/typescript/components/types';
import { useState } from 'react';

type CoverProps = {
  alt?: string;
  uri?: false | string | undefined;
  width?: ResponsiveValue<'px' | '0' | 'sm' | 'md' | 'lg' | 'xl' | string | number>;
};

export const Cover = ({ alt, uri, width }: CoverProps) => {
  const { randomImage } = useRandom();
  const [imageLoadingError, setImageLoadingError] = useState(false);

  // todo: select color based on color mode
  return (
    <AspectRatio ratio={16 / 9} w={width}>
      {imageLoadingError ? (
        <Skeleton endColor={'light.700'} h={'100%'} rounded={'md'} startColor={'light.600'} />
      ) : (
        <Image
          alt={alt ?? 'Cover'}
          h={'100%'}
          onError={() => setImageLoadingError(true)}
          resizeMethod={'resize'}
          resizeMode={'contain'}
          rounded={'md'}
          source={uri ? { uri } : randomImage()}
          w={'100%'}
        />
      )}
    </AspectRatio>
  );
};
