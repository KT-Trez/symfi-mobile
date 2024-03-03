import React, {ReactNode} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Button, Surface, useTheme} from 'react-native-paper';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';


interface SettingProps {
	buttons: { fun: () => void, icon?: IconSource, name: string }[];
	buttonsColumn?: boolean;
	children: ReactNode;
	isLoading?: boolean;
	style?: ViewProps['style'];
}

function Setting({buttons, buttonsColumn, children, isLoading, style}: SettingProps) {
	const {colors} = useTheme();

	return (
		<Surface style={[css.container, style]}>
			{children}
			<View style={!buttonsColumn ? css.containerButtonsHorizontal : css.containerButtonsVertical}>
				{buttons.map((button, i) =>
					<Button disabled={isLoading}
					        icon={button.icon}
					        buttonColor={colors.elevation.level3}
					        loading={isLoading}
					        mode={'elevated'}
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
	containerButtonsHorizontal: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	containerButtonsVertical: {
		flexDirection: 'column',
		justifyContent: 'flex-end'
	}
});

export default Setting;