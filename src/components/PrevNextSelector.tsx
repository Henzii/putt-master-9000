import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from "react-native";
import { IconButton } from 'react-native-paper';

type Props = {
    options: {
        label: string
        value: number | undefined
    }[]
    selected: number | undefined
    delay?: number
    onChange: (selected: number | undefined) => void
}

const PrevNextSelector = ({options, onChange, selected, delay}: Props) => {
    const [selectedIndex, setSelected] = useState<number>(options.findIndex(option => option.value === selected));
    const timerId = useRef<NodeJS.Timeout>(null);

    const handleArrowClick = (value: number) => {
        const newSelectedIndex = selectedIndex + value;
        if (newSelectedIndex < 0 || newSelectedIndex >= options.length) return;
        setSelected(newSelectedIndex);

        if (!delay) {
            onChange(options[newSelectedIndex].value);
        } else {
            if (timerId.current) clearTimeout(timerId.current);
            timerId.current = setTimeout(() => onChange(options[newSelectedIndex].value), delay);
        }
    };

    useEffect(() => {
        return () => {
            timerId.current && clearTimeout(timerId.current);
        };
    }, []);

    return (
        <View style={styles.container}>
           <IconButton icon="arrow-left" onPress={() => handleArrowClick(-1)} disabled={selectedIndex === 0} />
           <Text style={styles.text}>
                {options[selectedIndex]?.label ?? ''}
           </Text>
           <IconButton icon="arrow-right" onPress={() => handleArrowClick(1)} disabled={selectedIndex >= options.length - 1} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    text: {
        fontSize: 18,
    },
});

export default PrevNextSelector;
