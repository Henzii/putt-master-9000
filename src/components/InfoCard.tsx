import React, { ReactNode } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { MD3Theme, Title, useTheme} from 'react-native-paper';

type InfoCardProps = {
    title?: string,
    text: ReactNode,
}

export default function InfoCard(props: InfoCardProps) {
    const { title = '', text } = props;
    const theme = useTheme();
    const tyyli = createTyyli(theme);

    return (
        <View style={tyyli.card}>
            <Title style={tyyli.title}>{title}</Title>
            <Text style={tyyli.content}>{text}</Text>
        </View>
    );
}

const createTyyli = (theme: MD3Theme) => StyleSheet.create({
    card: {
        alignSelf: 'flex-start',
        display: 'flex',
        paddingHorizontal: 15,
        margin: 7,
        paddingVertical: 5,
        backgroundColor: theme.colors.surface,
        borderRadius: 7,
        elevation: 2,
    },
    title: {
        fontSize: 16,
    },
    content: {
        fontSize: 14,
    }
});
