import React, { ReactNode } from 'react';
import { StyleSheet, View, Text } from "react-native";
import { List } from 'react-native-paper';

type Props = {
    number: string,
    title: string,
    accordion?: boolean
    children?: ReactNode
}

const NumberedTitle = (props: Props) => {
    if (props.accordion) {
        return (
            <List.Accordion title={<Title {...props} />} titleStyle={styles.accordionTitle} style={styles.accordion}>
                {props.children}
            </List.Accordion>
        );
    }

    return <Title {...props} />;
};

const Title = ({number, title}: {number: string, title: string}) => (
    <View style={styles.container}>
        <Text style={[styles.text, styles.number]}>{number}</Text>
        <Text style={styles.text}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    accordionTitle: {
        marginLeft: -15
    },
    accordion: {
        backgroundColor: 'white',
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
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
