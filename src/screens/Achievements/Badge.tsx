import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Title } from 'react-native-paper';
import BADGES from '../../constants/badges';
import { parseDate } from '../../utils/dates';

type Props = {
    badgeName: string,
    date: number,
    course: string,
    layout: string
}

const Badge = ({badgeName, date, course, layout}: Props) => {
    const badge = BADGES.find(b => b.name === badgeName);
    if (!badge) return null;
    return (
        <View style={styles.container}>
            <Title>{badge.title}</Title>
            {badge.imageSrc ? (
                <Image source={badge.imageSrc} style={styles.badge} resizeMode='contain' />
            ) : (
                <Text style={styles.text}>?</Text>
            )}
            <View style={{ alignSelf: 'flex-start' }}>
                <Text style={styles.info}>{parseDate(date, 'dd.MM.yyyy')}</Text>
                <Text style={styles.info} numberOfLines={2}>{`${course} / ${layout}`}</Text>
                <Text style={styles.info}>{badge.text}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    info: {
        fontSize: 12,
    },
    text: {
        textAlign: 'center',
        fontSize: 80
    },
    container: {
        height: 250,
        width: "45%",
        maxWidth: 200,
        borderRadius: 20,
        backgroundColor: '#fafafa',
        margin: 5,
        padding: 10,
        elevation: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    badge: {
        margin: 0,
        padding: 0,
        flexShrink: 1,
        width: 120,
        height: 120,
    }
});

export default Badge;
