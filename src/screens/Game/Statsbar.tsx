import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { SingleStats } from '../../hooks/useStats';
import { scoreColors } from '../../utils/theme';

const displayStats = [
    'eagle',
    'birdie',
    'par',
    'bogey',
    'doubleBogey'
];
type Indexed = Record<string, number | string>

export default function Statsbar({statsCard, viewWidth}: {statsCard?: SingleStats, viewWidth: number }) {
    if (!statsCard) {
        return null;
    }
    const { count: total } = statsCard;
    const createBars = () => {
        let counter = 0;
        const bars = displayStats.map(single => {
            const value = (statsCard as Indexed)[single] as number;
            const color = (scoreColors as Indexed)[single] as string;
            const percent = Math.round(value/total*100);
            const width = viewWidth * (value/total);
            counter += width;
            if (width < 2) return null;
            return <Singlebar width={width} text={`${percent > 20 ? single+' ' : ''}${percent > 10 ? percent + '%' : ''}`} color={color} key={single} />;
          });
        if (viewWidth - counter > 10) {
            bars.push(<Singlebar width={(viewWidth-counter)} text="" color="#ff4444" key="rest" />);
        }
        return bars;
    };
    return (
        <View style={tyyli.bottomView}>
            <Text>Best: {statsCard.best}, Avg: {statsCard.average}</Text>
            <View style={tyyli.main}>
            {createBars()}
            </View>
        </View>
    );
}

const Singlebar = ({width, text, color}: { width: number, text?: string, color?: string}) => {
    return (
        <View style={{ width, backgroundColor: color }}>
            <Text style={tyyli.text}>{text}</Text>
        </View>
    );
};

const tyyli = StyleSheet.create({
    bottomView: {
        opacity: 0.6
    },
    main: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        textAlignVertical: 'center',
    }
});