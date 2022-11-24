import React from 'react';
import {FlexAlignType, StyleProp, View, ViewStyle} from 'react-native';


interface StackProps {
	alignItems?: FlexAlignType;
	children: JSX.Element | JSX.Element[];
	flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse' | undefined;
	flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse' | undefined;
	justifyContent?: 'flex-end' | 'flex-start' | 'space-between' | 'space-evenly' | 'center' | 'space-around' | undefined;
	sx?: StyleProp<ViewStyle>;
}

function Stack({alignItems, children, flexDirection, flexWrap, justifyContent, sx}: StackProps) {
	return (
		<View style={[{alignItems, display: 'flex', flexDirection, flexWrap, justifyContent}, sx]}>
			{children}
		</View>
	);
}

export default Stack;