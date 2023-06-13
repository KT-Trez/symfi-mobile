import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {ActivityIndicator, Appbar} from 'react-native-paper';


interface LoadingPageProps {
	appbarActions?: JSX.Element | JSX.Element[];
	children: JSX.Element | JSX.Element[];
	isLoading: boolean;
	sx?: StyleProp<ViewStyle>;
	title: string;
}

function LoadingView({appbarActions, children, isLoading, sx, title}: LoadingPageProps) {
	return (
		<>
            <Appbar.Header elevated mode={'small'}>
				<Appbar.Content title={title}/>
				{appbarActions}
			</Appbar.Header>

			{!isLoading ?
				<View style={sx}>
					{children}
				</View>
				:
				<ActivityIndicator size={'large'} style={css.activityIndicator}/>
			}
		</>
	);
}

const css = StyleSheet.create({
	activityIndicator: {
		marginTop: 25
	},
	container: {
		flex: 1
	}
});

export default LoadingView;
