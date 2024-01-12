import { HStack, Spinner } from 'native-base';

export const Loader = () => (
  <HStack alignItems="center" mt={4}>
    <Spinner size="lg" />
  </HStack>
);
