import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Avatar, Button, Surface} from 'react-native-paper';


interface CoverChangeProps {
	aspectRatio: number;
	borderRadius: number;
	coverUri: string | undefined;
	hasCover: boolean;
	onChange: () => void;
	onRemove: () => void;
}

function CoverChange({aspectRatio, borderRadius, coverUri, hasCover, onChange, onRemove}: CoverChangeProps) {
	return (
		<Surface style={css.containerCoverChange}>
			{hasCover ?
				<Avatar.Image size={50}
							  source={
								  ({size}) => <Image resizeMode={'center'}
													 source={{
														 height: size,
														 uri: coverUri,
														 width: size
													 }}
													 style={{aspectRatio, borderRadius}}/>}/>
				:
				<Avatar.Icon icon={'file-image-plus-outline'} size={50}/>
			}

			<View style={css.containerButtons}>
				<Button onPress={onRemove}>Remove</Button>
				<Button onPress={onChange}>{hasCover ? 'Change' : 'Add'}</Button>
			</View>
		</Surface>
	);
}

const css = StyleSheet.create({
	containerButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	containerCoverChange: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: 5,
		padding: 10
	}
});


export default CoverChange;