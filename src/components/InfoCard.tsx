import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Title, useTheme} from 'react-native-paper';

type InfoCardProps = {
    title?: string,
    text: string,
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

const createTyyli = (theme: ReactNativePaper.Theme) => StyleSheet.create({
    card: {
        alignSelf: 'flex-start',
        display: 'flex',
        paddingHorizontal: 20,
        margin: 7,
        paddingVertical: 5,
        backgroundColor: theme.colors.surface,
        borderRadius: 7,
        elevation: 2,
    },
    title: {
    },
    content: {
        fontSize: 16,
    }
});
