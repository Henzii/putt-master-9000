import React, { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { useTheme } from 'react-native-paper';

type SelectButtonGroupProps = {
    children: JSX.Element[],
    onSelect?: (name: string) => void,
}

const SelectButtonGroup = ({children, onSelect}: SelectButtonGroupProps) => {
    const [selected, setSelected] = useState('');
    const handleButtonClick = (name: string) => {
        setSelected(name);
        onSelect?.(name);
    };
    const theme = useTheme();
    const styles = makeStyles(theme);
    return (
        <View style={styles.container}>
            {React.Children.map(children, (child, index) => {
                const isSelected = child.props?.name === selected;
                return React.cloneElement(child, {
                    selectedName: selected,
                    onPress: handleButtonClick,
                    selected: isSelected,
                    style: [
                        styles.middle,
                        (index === 0) && styles.first,
                        (index === children.length-1) && styles.last,
                        (isSelected) && styles.selected,
                    ]
                });
            })}
        </View>
    );
};

const makeStyles = (theme: ReactNativePaper.Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    middle: {
        borderRadius: 0,
    },
    first: {
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
    },
    last: {
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,
    },
    selected: {
        backgroundColor: theme.colors.primary+'50',
    }
});

export default SelectButtonGroup;