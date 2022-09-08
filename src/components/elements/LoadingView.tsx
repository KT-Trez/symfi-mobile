import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Appbar, useTheme} from 'react-native-paper';


interface LoadingPageProps {
	children: JSX.Element | JSX.Element[];
	isLoading: boolean;
	title: string;
}

function LoadingView({children, isLoading, title}: LoadingPageProps) {
	const {colors} = useTheme();

	return (
		<View style={[css.container, {backgroundColor: colors.background}]}>
			<Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={title}/>
			</Appbar.Header>

			{!isLoading ?
				<>
					{children}
				</>
				:
				<ActivityIndicator size={'large'} style={css.activityIndicator}/>
			}
		</View>
	);
}

const css = StyleSheet.create({
	activityIndicator: {
		marginTop: 10
	},
	container: {
		flex: 1
	}
});

export default LoadingView;