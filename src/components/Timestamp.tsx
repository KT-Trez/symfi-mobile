import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';


interface TimestampProps {
	time: string;
}

function Timestamp({time}: TimestampProps) {
	return (
		<Text style={css.timestamp} variant={'labelSmall'}>
			{time}
		</Text>
	);
}

const css = StyleSheet.create({
	timestamp: {
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
		borderColor: 'rgba(230, 230, 230, 0.4)',
		borderRadius: 2,
		borderStyle: 'solid',
		borderWidth: 1,
		bottom: 5,
		padding: 1,
		paddingTop: 2,
		position: 'absolute',
		right: 5,
		textAlign: 'center'
	}
})

export default Timestamp;