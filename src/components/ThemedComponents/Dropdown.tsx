import React, { ReactNode } from 'react';
import { useState } from "react";
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Menu, Text, useTheme } from "react-native-paper";
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

type Item<T extends string> = {
    label: string
    value: T
}

type Props<T extends string> = {
    items: readonly Item<T>[]
    onItemSelect: (itemValue: T) => void
    selectedItemValue?: T
    defaultValue?: string
}

const AnchorButton = ({ children, onPress, expanded }: { children: ReactNode, onPress: () => void, expanded: boolean }) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
        <Pressable style={styles.button} onPress={onPress}>
            <Text variant="bodyMedium">
                {children}
            </Text>
            <Icon source={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
        </Pressable>
        </View>
    );
};

export const Dropdown = <T extends string,>({ items, onItemSelect, selectedItemValue, defaultValue }: Props<T>) => {
    const [expanded, setExpanded] = useState(false);
    const selectedLabel = items.find(item => item.value === selectedItemValue)?.label ?? defaultValue;

    return (
        <Menu
            visible={expanded}
            onDismiss={() => setExpanded(false)}
            anchor={<AnchorButton expanded={expanded} onPress={() => setExpanded(val => !val)}>{selectedLabel}</AnchorButton>}
            anchorPosition="bottom"
        >
            {items.map(item => (
                <Menu.Item key={item.value} title={item.label} onPress={() => {
                    setExpanded(false);
                    onItemSelect(item.value);
                }} />
            ))}
        </Menu>
    );
};

const createStyles = (color: MD3Colors) => StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,
        borderColor: color.primary,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 4
    }
});