import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { Link } from 'react-router-native';
import { theme } from '../utils/theme';

const master = require('../../assets/master2.png');

const Frontpage = () => {
    return (
        <View style={tyyli.container}>
            <Image source={master} resizeMode='cover' style={tyyli.kuva} />
            <NaviButton to="/peli" text="New Game" />
            <NaviButton to="/courses" text="Courses" />
        </View>
    )
}

const NaviButton = ({ text, to }: { text: string, to: string }) => {
    return (
        <Link to={to}>
            <View style={tyyli.root}>
                <Text style={tyyli.text}>{text}</Text>
            </View>
        </Link>

    )
}

const tyyli = StyleSheet.create({
    kuva: {
        width: '50%',
        height: '40%',
    },
    container: {
        alignItems: 'center',
        minHeight: Dimensions.get('window').height,
        width: '100%',
        backgroundColor: '#fafafa'
    },
    root: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        width: Dimensions.get('window').width,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    text: {
        textAlign: 'center',
        fontSize: theme.font.sizes.large,
        fontFamily: theme.font.family
    }
})

export default Frontpage;