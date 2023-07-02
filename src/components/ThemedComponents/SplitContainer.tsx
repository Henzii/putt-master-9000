import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';

type VS = ViewStyle | false

type SplitContainerProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement[] | null | React.ReactElement | any,
    left?: boolean,
    bottonMargin?: boolean,
    spaceAround?: boolean,
    style?: VS | VS[]
    onPress?: () => void,
    testID?: string
}
const SplitContainer = ({children, ...props} : SplitContainerProps) => {
    const style = [
        tyylit.main,
        (props.left && tyylit.left),
        (props.bottonMargin && tyylit.bottomMargin),
        (props.spaceAround && tyylit.spaceAround),
        props.style || null,
    ];
    return (
        <Pressable onPress={props.onPress} testID={props.testID}>
            <View style={style}>
                {children}
            </View>
        </Pressable>
    );
};
const tyylit = StyleSheet.create({
    main: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    left: {
        left: 1
    },
    spaceAround: {
        justifyContent: 'space-around'
    },
    bottomMargin: {
        marginBottom: 10,
    }
});
export default SplitContainer;