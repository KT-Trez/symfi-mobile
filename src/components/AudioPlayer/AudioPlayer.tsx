import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Box, Heading, HStack, Icon, IconButton, Text, VStack } from 'native-base';
import React from 'react';
import { Cover } from '../Cover';
import { useAudioPlayer } from './hooks';

export const AudioPlayer = () => {
  const { currentSong, isPaused, togglePause } = useAudioPlayer();

  return (
    <Box bg={'primary.900'} m={'1'} p={4} rounded={'md'}>
      <Heading color={'text.100'} fontSize={'lg'} mb={2}>
        Music Controls
      </Heading>

      <HStack>
        <Cover uri={currentSong?.file.hasCover && currentSong.file.cover.uri} width={'30%'} />

        <VStack alignItems={'flex-start'} maxW={'70%'} ml={2} pr={2}>
          <Text bold color={'text.200'} fontSize={'md'} isTruncated lineHeight={20} maxW={'100%'} numberOfLines={2}>
            {currentSong?.title ?? 'Title'}
          </Text>
          <Text color={'text.300'} fontSize={'xs'} isTruncated maxW={'100%'} numberOfLines={1}>
            {currentSong?.channel.name ?? 'Author'}
          </Text>
        </VStack>
      </HStack>

      <HStack alignItems={'center'} justifyContent={'center'} mt={2}>
        <IconButton
          icon={<Icon as={MaterialCommunityIcons} name={'motion-play-outline'} size={'3xl'} />}
          // iconColor={autoplay ? '#03a9f4' : undefined}
          // onPress={toggleAutoplay}
          size={'lg'}
        />

        <HStack alignItems={'center'} justifyContent={'center'} ml={2} mr={2}>
          <IconButton
            icon={<Icon as={MaterialCommunityIcons} name={'skip-previous-circle-outline'} size={'4xl'} />}
            // onPress={previousSong}
            size={'xs'}
          />
          <IconButton
            icon={
              isPaused ? (
                <Icon as={MaterialCommunityIcons} name={'play-circle-outline'} size={'5xl'} />
              ) : (
                <Icon as={MaterialCommunityIcons} name={'pause-circle-outline'} size={'5xl'} />
              )
            }
            // onLongPress={endPlayback}
            onPress={togglePause}
            size={'xs'}
          />
          <IconButton
            icon={<Icon as={MaterialCommunityIcons} name={'skip-next-circle-outline'} size={'4xl'} />}
            // onPress={nextSong}
            size={'xs'}
          />
        </HStack>

        <IconButton
          icon={<Icon as={MaterialCommunityIcons} name={'shuffle'} size={'3xl'} />}
          // iconColor={shuffle ? '#03a9f4' : undefined}
          // onPress={toggleShuffle}
          size={'xs'}
        />
      </HStack>

      {/* todo: implement progress */}
      {/*	<View style={css.containerProgress}>*/}
      {/*		<TextSetting style={css.progressText}>{progressSimpleText ?? '00:00'}</TextSetting>*/}
      {/*		<View style={css.progressBar}>*/}
      {/*			<Slider maximumValue={duration ?? 1}*/}
      {/*			        maximumTrackTintColor={colors.primary}*/}
      {/*			        minimumValue={0}*/}
      {/*			        minimumTrackTintColor={colors.primary}*/}
      {/*			        onSlidingComplete={moveTo}*/}
      {/*			        style={{width: '100%'}}*/}
      {/*			        thumbTintColor={colors.primary}*/}
      {/*			        value={progress ?? 0}/>*/}
      {/*		</View>*/}
      {/*		<TextSetting style={css.progressText}>{song?.metadata.duration.simple_text ?? '00:00'}</TextSetting>*/}
      {/*	</View>*/}
    </Box>
  );
};
