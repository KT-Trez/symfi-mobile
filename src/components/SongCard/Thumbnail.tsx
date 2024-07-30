import { Box } from 'native-base';
import { Cover } from '../Cover';
import { Overlay } from '../Overlay';

type ThumbnailProps = {
  id: string;
  loadPlaceholder: boolean;
  timestamp: string;
  uri?: string;
};

export const Thumbnail = ({ id, loadPlaceholder, timestamp, uri }: ThumbnailProps) => (
  <Box>
    <Cover alt={`${id}'s cover`} uri={loadPlaceholder ? undefined : uri} />
    <Overlay bottom={1} right={1} size={'xs'} text={timestamp} />
  </Box>
);
