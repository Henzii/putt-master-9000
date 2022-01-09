import React from 'react';
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Link } from 'react-router-native';
import { theme } from '../utils/theme';

const master = require('../../assets/master.png');

const Frontpage = () => {
    return (
        <View style={tyyli.container}>
            <img src={master} alt="Putt Master" style={{
                backgroundImage: 'linear-gradient(to bottom, skyblue, lightgreen)',
                width: '50%',
                margin: '10px auto',
                borderRadius: '30vmin',
            }} />
            <NaviButton text="New Game" to="/peli" />
            <NaviButton text="Courses" to="/courses" />
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
    
    container: {
        minHeight: Dimensions.get('window').height,
        width: '100%',
    },
    root: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        width: '100%',
        margin: '0px auto',
        textAlign: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    text: {
        fontSize: theme.font.sizes.large,
        fontFamily: theme.font.family
    }
})

export default Frontpage;