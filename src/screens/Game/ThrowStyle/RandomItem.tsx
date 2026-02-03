import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, Text, TextStyle } from 'react-native';

type Props = {
    items: string[]
    isRunning: boolean
    style?: StyleProp<TextStyle>
}

const RandomItem = ({ items, isRunning, style }: Props) => {
    const { t } = useTranslation();
    const [randomKey, setRandomKey] = useState('');
    useEffect(() => {
        if (isRunning) {
            const intervalId = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * items.length);
                setRandomKey(items[randomIndex]);
            }, 100);

            return () => clearInterval(intervalId);
        }
    }, [isRunning]);
    return (
        <Text style={style}>{randomKey ? t(randomKey) : ''}</Text>
    );
};

export default RandomItem;