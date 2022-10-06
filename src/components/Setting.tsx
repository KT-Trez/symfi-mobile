import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Button, Surface} from 'react-native-paper';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';


interface SettingProps {
	buttons: { fun: () => void, icon?: IconSource, name: string }[];
	children: JSX.Element | JSX.Element[];
	style?: ViewProps['style'];
}

function Setting({buttons, children, style}: SettingProps) {
	return (
		<Surface style={[css.container, style]}>
			{children}
			<View style={css.containerButtons}>
				{buttons.map((button, i) =>
					<Button icon={button.icon}
							key={i}
							onPress={button.fun}
							uppercase={true}>{button.name}</Button>)}
			</View>
		</Surface>
	);
}

const css = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: 5,
		marginBottom: 2.5,
		marginTop: 2.5,
		padding: 10
	},
	containerButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	}
});

export default Setting;