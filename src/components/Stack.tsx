import React, { FC, ReactNode } from 'react';
import { View, ViewProps, StyleProp, ViewStyle, DimensionValue } from 'react-native';
type Props = Omit<ViewProps, 'style'> & {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  maxWidth?: DimensionValue;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};
const Stack: FC<Props> = ({
  children,
  direction = 'column',
  alignItems,
  alignContent,
  justifyContent,
  gap,
  style,
  maxWidth,
  ...rest
}) => {
  const baseStyle: ViewStyle = {
    flexDirection: direction,
    ...(alignItems ? { alignItems } : {}),
    ...(alignContent ? { alignContent } : {}),
    ...(justifyContent ? { justifyContent } : {}),
    ...(gap !== undefined ? { gap } : {}),
    ...(maxWidth !== undefined ? { maxWidth } : {}),
  };
  return (
    <View style={[baseStyle, style]} {...rest}>
      {children}
    </View>
  );
};
export default Stack;