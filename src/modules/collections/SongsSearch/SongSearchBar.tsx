import { memo, useState } from 'react';
import { Menu, Searchbar } from 'react-native-paper';
import { useSuggestionFetch } from './hooks';

type SongSearchBarProps = {
  onSearch: (search: string) => void;
};

// todo: keep search text after search
// todo: improve clicking out of the search bar
// todo: add action on icon clear

export const SongSearchBar = memo(
  ({ onSearch }: SongSearchBarProps) => {
    const [search, setSearch] = useState<string>('');
    const { isLoading, suggestions } = useSuggestionFetch(search);

    return (
      <Menu
        anchor={
          <Searchbar
            loading={isLoading}
            onChangeText={setSearch}
            onSubmitEditing={event => onSearch(event.nativeEvent.text)}
            placeholder="Search for songs"
            value={search}
          />
        }
        anchorPosition="top"
        visible={search.length >= 3}
      >
        {suggestions.map((suggestion, index) => (
          <Menu.Item key={index} onPress={() => onSearch(suggestion)} title={suggestion} />
        ))}
      </Menu>
    );
  },
  () => false,
);
