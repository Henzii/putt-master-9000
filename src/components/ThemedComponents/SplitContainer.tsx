import React from 'react';
import { View, StyleSheet, ViewComponent } from 'react-native';

type SplitContainerProps = {
    children: React.ReactElement[] | null | React.ReactElement;
}
const SplitContainer = ({children} : SplitContainerProps) => {
    const style = [
        tyylit.main
    ];
    return (
        <View style={style}>
            {children}
        </View>
    );
};
const tyylit = StyleSheet.create({
    main: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
});
export default SplitContainer;