import React from 'react';
import { ComponentProps, FC } from "react";
import { Button, useTheme } from "react-native-paper";

type Props = ComponentProps<typeof Button>;


const HeaderButton: FC<Props> = (props) => {
    const {colors} = useTheme();
    return <Button mode="elevated" buttonColor={colors.tertiary} {...props} />;
};

export default HeaderButton;