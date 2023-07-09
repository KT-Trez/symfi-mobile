import {Text} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import usePlayLists from '../../../hooks/usePlayLists';
import {PlayList} from '../../../services/ResourceManager';


function ChangeOrder() {
    const [isLoading, playLists, refreshPlayLists, _, setPlayLists] = usePlayLists();

    const move = async (playList: PlayList, offset: number) => {
        const playListsCopy = [...playLists];
        const pIndex = playListsCopy.indexOf(playList);

        playListsCopy.splice(pIndex, 1);
        playListsCopy.splice(pIndex + offset, 0, playList);

        playListsCopy[pIndex + offset].order = pIndex + offset;
        playListsCopy[pIndex].order = pIndex;

        setPlayLists(playListsCopy);
    };

    const reNumerate = () => {
        const playListsCopy = [...playLists];
        for (let i = 0; i < playLists.length; i++)
            playListsCopy[i].order = i;
        save();
    };

    const save = () => {
        for (const playList of playLists)
            playList.updateOrder();
        refreshPlayLists();
    };

    return (
        <>
            <Text>out of order</Text>
            // todo: npm install --save react-native-draggable-flatlist
            {/*<LoadingView isLoading={isLoading} sx={css.container} title={'Change order'}>*/}
            {/*    <Surface style={css.section}>*/}
            {/*        <Stack direction={'row'} justifyContent={'space-evenly'}>*/}
            {/*            <Button buttonColor={colors.elevation.level2}*/}
            {/*                    icon={'numeric'}*/}
            {/*                    onPress={reNumerate}*/}
            {/*                    uppercase>re-numerate</Button>*/}
            {/*            <Button buttonColor={colors.elevation.level2}*/}
            {/*                    icon={'content-save'}*/}
            {/*                    onPress={save}*/}
            {/*                    uppercase>save</Button>*/}
            {/*        </Stack>*/}
            {/*    </Surface>*/}

            {/*    <Surface style={[css.section, css.chips]}>*/}
            {/*        <FlatList data={playLists}*/}
            {/*                  keyExtractor={item => item.id}*/}
            {/*                  ListEmptyComponent={*/}
            {/*                      <Text style={css.flatListText} variant={'bodyMedium'}>You have no playLists*/}
            {/*                          yet.</Text>*/}
            {/*                  }*/}
            {/*                  onRefresh={refreshPlayLists}*/}
            {/*                  refreshing={isLoading}*/}
            {/*                  renderItem={({item, index}) =>*/}
            {/*                      <Stack alignItems={'center'} direction={'row'} sx={css.chipContainer}>*/}
            {/*                          <Stack direction={'row'} justifyContent={'center'}>*/}
            {/*                              <IconButton disabled={index === 0}*/}
            {/*                                          icon={'arrow-up-bold-box'}*/}
            {/*                                          onPress={() => move(item, -1)}*/}
            {/*                                          size={25}*/}
            {/*                                          style={{marginRight: -2}}/>*/}
            {/*                              <IconButton disabled={index === playLists.length - 1}*/}
            {/*                                          icon={'arrow-down-bold-box'}*/}
            {/*                                          onPress={() => move(item, 1)}*/}
            {/*                                          size={25}*/}
            {/*                                          style={{marginLeft: -2}}/>*/}
            {/*                          </Stack>*/}
            {/*                          <Stack alignItems={'center'}*/}
            {/*                                 direction={'row'}*/}
            {/*                                 sx={[css.chip, {backgroundColor: colors.elevation.level3}]}>*/}
            {/*                              {<ChipAvatar exists={item.flags.hasCover} uri={item.cover.uri}/>}*/}
            {/*                              <Text variant={'bodyMedium'}>#{item.order + 1} {item.name}</Text>*/}
            {/*                          </Stack>*/}
            {/*                      </Stack>*/}
            {/*                  }*/}
            {/*        />*/}
            {/*    </Surface>*/}
            {/*</LoadingView>*/}
        </>
    );
}

const css = StyleSheet.create({
    chip: {
        borderColor: 'rgba(230, 230, 230, 0.1)',
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 5
    },
    chipContainer: {
        marginBottom: 10
    },
    chips: {
        paddingBottom: 5
    },
    container: {
        flex: 1,
        paddingBottom: 2.5,
        paddingTop: 2.5
    },
    flatListText: {
        margin: 15,
        textAlign: 'center'
    },
    section: {
        margin: 5,
        marginBottom: 2.5,
        marginTop: 2.5,
        padding: 10
    }
});

export default ChangeOrder;
