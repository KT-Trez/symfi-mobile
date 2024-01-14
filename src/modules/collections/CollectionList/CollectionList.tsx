import { List } from '../../../components';
import { useList } from '../context';
import { Collection } from './Collection';

export const CollectionList = () => {
  const { displayedData, isLoading, reload } = useList();

  return (
    <List
      data={displayedData}
      isLoading={isLoading}
      onRefresh={reload}
      renderItem={({ item }) => <Collection item={item} />}
    />
  );
};
