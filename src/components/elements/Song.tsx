import {MaterialIcons} from '@expo/vector-icons';
import React, {useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SongMetadata} from '../../../typings/interfaces';


interface SongProps {
	item: SongMetadata;
}

function Song({item}: SongProps) {
	//const [isLoading, setIsLoading] = useState(false);
	//const [loadingFailed, setLoadingFailed] = useState(false);

	return (
		// todo: implement image error icon
		<View style={css.container}>
			<View style={css.imageContainer}>
				{/*{isLoading ?*/}
				<ActivityIndicator size={'small'}/>
				{/*:*/}
				{/*// todo: debug only, remove*/}
				{/*<Text>loaded</Text>*/}
				{/*	<Image*/}
				{/*		//onError={imageError}*/}
				{/*		//onLoadEnd={imageLoaded}*/}
				{/*		//resizeMode={'contain'}*/}
				{/*		//resizeMethod={'resize'}*/}
				{/*		source={{*/}
				{/*			height: item.metadata.thumbnails[0].height,*/}
				{/*			uri: item.metadata.thumbnails[0].url,*/}
				{/*			width: item.metadata.thumbnails[0].width*/}
				{/*		}}/>*/}
			</View>
			<View style={css.metadataContainer}>
				<Text style={css.textTitle}>{item.title}</Text>
				<Text style={css.textAuthor}>{item.channel.name}</Text>
				<Text
					style={css.textInfo}>{item.metadata.short_view_count_text.simple_text} • {item.metadata.published}</Text>
			</View>
			<TouchableOpacity style={css.addButtonContainer}>
				<MaterialIcons name={'add-circle-outline'} size={28}/>
			</TouchableOpacity>
		</View>
	);
}

const css = StyleSheet.create({
	addButtonContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center'
	},
	container: {
		flexDirection: 'row'
	},
	imageContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center'
	},
	metadataContainer: {
		flex: 4
	},
	textAuthor: {
		color: '#212121',
		fontSize: 16
	},
	textInfo: {
		color: '#757575',
		fontSize: 12
	},
	textTitle: {
		color: '#212121',
		fontSize: 16,
		fontWeight: 'bold'
	}
});

export default Song;