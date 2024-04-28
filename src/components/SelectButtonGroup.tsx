import React, { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { useTheme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

type SelectButtonGroupProps = {
    children: JSX.Element[],
    onSelect?: (name: string) => void,
    selectedDefault?: string
}

const SelectButtonGroup = ({children, onSelect, selectedDefault}: SelectButtonGroupProps) => {
    const [selected, setSelected] = useState(selectedDefault ?? '');
    const handleButtonClick = (name: string) => {
        setSelected(name);
        onSelect?.(name);
    };
    const {colors} = useTheme();
    const styles = makeStyles(colors);
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

const makeStyles = (colors: MD3Colors) => StyleSheet.create({
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
        backgroundColor: colors.tertiary,
    }
});

export default SelectButtonGroup;