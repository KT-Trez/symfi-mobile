import React from 'react';
import {FlexAlignType, StyleProp, View, ViewStyle} from 'react-native';


interface StackProps {
	alignItems?: FlexAlignType;
	children: JSX.Element | JSX.Element[];
	direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse' | undefined;
	flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse' | undefined;
	justifyContent?: 'flex-end' | 'flex-start' | 'space-between' | 'space-evenly' | 'center' | 'space-around' | undefined;
	sx?: StyleProp<ViewStyle>;
}

function Stack({alignItems, children, direction, flexWrap, justifyContent, sx}: StackProps) {
	return (
		<View style={[{alignItems, display: 'flex', flexDirection: direction, flexWrap, justifyContent}, sx]}>
			{children}
		</View>
	);
}

export default Stack;