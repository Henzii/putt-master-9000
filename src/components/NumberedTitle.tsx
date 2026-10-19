import React, { ReactNode } from 'react';
import { StyleSheet, View } from "react-native";
import { List, useTheme, Text } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

type Props = {
    number: string,
    title: string,
    accordion?: boolean
    children?: ReactNode
}

const NumberedTitle = (props: Props) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    if (props.accordion) {
        return (
            <List.Accordion title={<Title {...props} />} titleStyle={styles.accordionTitle} >
                {props.children}
            </List.Accordion>
        );
    }

    return <Title {...props} />;
};

const Title = ({ number, title }: { number: string, title: string }) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    return (
        <View style={styles.container}>
            <Text style={[styles.text, styles.number]}>{number}</Text>
            <Text style={styles.text}>{title}</Text>
        </View>
    );
};

const createStyles = (colors: MD3Colors) => StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    accordionTitle: {
        marginLeft: -15,
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.onBackground,
    },
    number: {
        borderWidth: 1,
        borderRadius: 50,
        width: 30,
        height: 30,
        marginTop: 2,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginRight: 8,
    }
});

export default NumberedTitle;
