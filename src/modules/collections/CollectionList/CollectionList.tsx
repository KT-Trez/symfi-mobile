import { List } from '@components';
import { useList } from '../context';
import { Collection } from './Collection';

export const CollectionList = () => {
  const { items } = useList();

  return <List.Content data={items} renderItem={({ item }) => <Collection item={item} />} />;
};
