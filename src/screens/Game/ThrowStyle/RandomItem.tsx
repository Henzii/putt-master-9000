import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

type Props = {
    items: string[]
    isRunning: boolean
}

const RandomItem = ({ items, isRunning }: Props) => {
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
        <Text>{randomDisc}</Text>
    );
};

export default RandomItem;