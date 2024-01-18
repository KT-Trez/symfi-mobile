import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContext } from '@react-navigation/native';
import { Fab, Icon, Menu, Text } from 'native-base';
import React, { useContext } from 'react';
import { AppBar, AppBarButton } from '../../../components/AppBar';
import usePlayLists from '../../../hooks/usePlayLists';

function List() {
  // constants
  const navigation = useContext(NavigationContext);

  // state
  const [playLists, sortPlayLists] = usePlayLists();

  // methods
  const goToPlayListOrder = () => navigation?.navigate('PlayListOrder');

  // sorting collections
  const sortByNameAscending = () => sortPlayLists(item => item.name);
  const sortByNameDescending = () => sortPlayLists(item => item.name, true);
  const sortByOrderAscending = () => sortPlayLists(item => item.order);
  const sortByOrderDescending = () => sortPlayLists(item => item.order, true);

  return (
    <>
      <AppBar subtitle={`playlist`} title={'Home'}>
        <Menu trigger={triggerProps => <AppBarButton icon={'sort'} triggerProps={triggerProps} />}>
          <Menu.Item onPress={sortByNameAscending}>
            <Icon as={MaterialCommunityIcons} name={'sort-alphabetical-ascending'} size={'md'} />
            <Text>Asc by title</Text>
          </Menu.Item>
          <Menu.Item onPress={sortByNameDescending}>
            <Icon as={MaterialCommunityIcons} name={'sort-alphabetical-descending'} size={'md'} />
            <Text>Desc by title</Text>
          </Menu.Item>

          <Menu.Item onPress={sortByOrderAscending}>
            <Icon as={MaterialCommunityIcons} name={'sort-numeric-ascending'} size={'md'} />
            <Text>Asc by order</Text>
          </Menu.Item>
          <Menu.Item onPress={sortByOrderDescending}>
            <Icon as={MaterialCommunityIcons} name={'sort-numeric-descending'} size={'md'} />
            <Text>Desc by order</Text>
          </Menu.Item>
        </Menu>

        <Menu trigger={triggerProps => <AppBarButton icon={'dots-vertical'} triggerProps={triggerProps} />}>
          <Menu.Item onPress={goToPlayListOrder}>
            <Icon as={MaterialCommunityIcons} name={'format-list-bulleted-type'} size={'md'} />
            <Text>Change Order</Text>
          </Menu.Item>
        </Menu>
      </AppBar>

      <Fab
        bottom={2}
        icon={<Icon as={MaterialCommunityIcons} name={'plus'} size={'xl'} />}
        renderInPortal={false}
        right={2}
      />
    </>
  );
}

export default List;
