import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Box, Heading, HStack, Icon, IconButton, Text, VStack} from 'native-base';
import React, {useState} from 'react';
import TrackAdapter from '../../classes/TrackAdapter';
import {Cover} from '../Cover';


interface AudioPlayerProps {
    shows: boolean;
    tracks: /* Track[] | */ TrackAdapter[];
}

function AudioPlayer({shows, tracks}: AudioPlayerProps) {
    const [currentTrack, setCurrentTrack] = useState</* Track | */ TrackAdapter | null>(null);
    //
    // useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    // 	switch (event.type) {
    // 		case Event.PlaybackTrackChanged:
    // 			if (event.nextTrack !== null)
    // 				setCurrentTrack(await TrackPlayer.getTrack(event.nextTrack));
    // 			break;
    // 	}
    // });

    return (
        <Box bg={'primary.900'} m={'1'} p={4} rounded={'md'}>
            <Heading color={'text.100'} fontSize={'lg'} mb={2}>Music controls</Heading>

            <HStack>
                <Cover width={'30%'}/>

                <VStack
                    alignItems={'flex-start'}
                    maxW={'70%'}
                    ml={2}
                    pr={2}
                >
                    <Text
                        bold
                        color={'text.200'}
                        fontSize={'md'}
                        isTruncated
                        lineHeight={20}
                        maxW={'100%'}
                        numberOfLines={2}
                    >{currentTrack?.title ?? 'Title'}</Text>
                    <Text
                        color={'text.300'}
                        fontSize={'xs'}
                        isTruncated
                        maxW={'100%'}
                        numberOfLines={1}
                    >{currentTrack?.artist ?? 'Author'}</Text>
                </VStack>
            </HStack>

            <HStack alignItems={'center'} justifyContent={'center'} mt={2}>
                <IconButton
                    icon={<Icon as={MaterialCommunityIcons} name={'motion-play-outline'} size={'3xl'}/>}
                    // iconColor={autoplay ? '#03a9f4' : undefined}
                    // onPress={toggleAutoplay}
                    size={'lg'}
                />

                <HStack alignItems={'center'} justifyContent={'center'} ml={2} mr={2}>
                    <IconButton
                        icon={<Icon as={MaterialCommunityIcons} name={'skip-previous-circle-outline'}
                                    size={'4xl'}/>}
                        // onPress={previousSong}
                        size={'xs'}
                    />
                    <IconButton
                        icon={true ?
                            <Icon as={MaterialCommunityIcons} name={'pause-circle-outline'} size={'5xl'}/> :
                            <Icon as={MaterialCommunityIcons} name={'play-circle-outline'} size={'5xl'}/>
                        }
                        // onLongPress={endPlayback}
                        // onPress={pause}
                        size={'xs'}
                    />
                    <IconButton
                        icon={<Icon as={MaterialCommunityIcons} name={'skip-next-circle-outline'} size={'4xl'}/>}
                        // onPress={nextSong}
                        size={'xs'}
                    />
                </HStack>

                <IconButton
                    icon={<Icon as={MaterialCommunityIcons} name={'shuffle'} size={'3xl'}/>}
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
}

export default AudioPlayer;
