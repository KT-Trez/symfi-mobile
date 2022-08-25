import React, {useEffect, useState} from 'react';
import {FlatList, ListRenderItem, SafeAreaView, StyleSheet} from 'react-native';
import {Divider, Searchbar, Text} from 'react-native-paper';


interface SearchListProps {
	data: any[];
	isRefreshing: boolean;
	keyExtractor: ((item: any, index: number) => string) | undefined;
	refreshData: () => void;
	renderItem: ListRenderItem<any>;
	searchbarText: string;
	searchEmptyText: string;
}

function SearchSavedAudio({data, isRefreshing, keyExtractor, refreshData, renderItem, searchbarText, searchEmptyText}: SearchListProps) {
	const [searchData, setSearchData] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		setSearchData([...data.filter(item => item.title.toLowerCase().match(searchQuery) || item.channel.name.toLowerCase().match(searchQuery))]);
	}, [searchQuery]);

	useEffect(() => {
		setSearchData([...data]);
	}, [data]);

	return (
		<React.Fragment>
			<SafeAreaView>
				<Searchbar onChangeText={setSearchQuery}
						   placeholder={searchbarText}
						   style={css.searchbar}
						   value={searchQuery}/>
			</SafeAreaView>

			<FlatList data={searchData}
					  ItemSeparatorComponent={Divider}
					  ListEmptyComponent={<Text style={css.textError}>{searchEmptyText}</Text>}
					  keyExtractor={keyExtractor}
					  onRefresh={refreshData}
					  refreshing={isRefreshing}
					  renderItem={renderItem}/>
		</React.Fragment>
	);
}

const css = StyleSheet.create({
	searchbar: {
		margin: 5
	},
	textError: {
		margin: 5,
		textAlign: 'center'
	}
});

export default SearchSavedAudio;