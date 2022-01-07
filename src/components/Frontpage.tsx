import React from 'react';
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from 'react-router-native';
import { theme } from '../utils/theme';

const Frontpage = () => {
    return (
        <View>
            <View style={{ height: '20vh' }}>
            </View>
            <NaviButton text="New Game" to="/peli" />
            <NaviButton text="Courses" to="/courses" />
        </View>
    )
}

const NaviButton = ({ text, to }: { text: string, to: string }) => {
    return (
        <View style={tyyli.root}>
            <Link to={to}>
                <Text style={tyyli.text}>{text}</Text>
            </Link>
        </View>
    )
}

const tyyli = StyleSheet.create({
    root: {
        borderWidth: 1,
        borderRadius: 3,
        borderColor: 'lightgray',
        width: '97vw',
        textAlign: 'center',
        padding: 20
    },
    text: {
        fontSize: theme.font.sizes.large,
        fontFamily: theme.font.family
    }
})

export default Frontpage;