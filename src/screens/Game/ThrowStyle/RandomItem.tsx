import React, { useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

type Props = {
    items: string[]
    isRunning: boolean
    style?: StyleProp<TextStyle>
}

const RandomItem = ({ items, isRunning, style }: Props) => {
    const [randomDisc, setRandomDisc] = useState('');
    useEffect(() => {
        if (isRunning) {
            const intervalId = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * items.length);
                setRandomDisc(items[randomIndex]);
            }, 100);

            return () => clearInterval(intervalId);
        }
    }, [isRunning]);
    return (
        <Text style={style}>{randomDisc}</Text>
    );
};

export default RandomItem;