import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-paper';


interface ChipAvatarProps {
	exists: boolean;
	uri?: string;
}

function ChipAvatar({exists, uri}: ChipAvatarProps) {
	return (
		exists ?
			<Avatar.Image size={20}
						  source={({size}) => <Image source={{height: size, uri: uri, width: size}}
													 style={css.avatar}/>}
						  style={css.chipAvatar}/>
			: null

	);
}

const css = StyleSheet.create({
	avatar: {
		borderRadius: 15
	},
	chipAvatar: {
		marginRight: 5
	},
});

export default ChipAvatar;