import React, {useEffect, useState} from 'react';
import {FlatList, ListRenderItem, SafeAreaView, StyleSheet} from 'react-native';
import {Searchbar, Text} from 'react-native-paper';


interface SearchProps {
	data: any[];
	isRefreshing: boolean;
	keyExtractor: ((item: any, index: number) => string) | undefined;
	refreshData: () => void;
	renderItem: ListRenderItem<any>;
	searchbarText: string;
	searchEmptyText: string;
}

function Search({data, isRefreshing, keyExtractor, refreshData,	renderItem,	searchbarText, searchEmptyText}: SearchProps) {
	const [searchData, setSearchData] = useState<any[]>([]);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		setSearchData([...data.filter(item => item.title.toLowerCase().match(searchQuery.toLowerCase()) || item.channel.name.toLowerCase().match(searchQuery.toLowerCase()))]);
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
					  ListEmptyComponent={<Text style={css.flatListText}
												variant={'bodyMedium'}>{searchEmptyText}</Text>}
					  keyExtractor={keyExtractor}
					  onRefresh={refreshData}
					  refreshing={isRefreshing}
					  renderItem={renderItem}
					  style={css.flatList}/>
		</React.Fragment>
	);
}

const css = StyleSheet.create({
	searchbar: {
		margin: 5,
		marginBottom: 0
	},
	flatList: {
		paddingBottom: 2.5,
		paddingTop: 2.5
	},
	flatListText: {
		margin: 5,
		textAlign: 'center'
	}
});

export default Search;