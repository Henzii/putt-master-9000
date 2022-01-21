import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { Link } from 'react-router-native';
import useMe from '../hooks/useMe';
import { theme } from '../utils/theme';
import Login from './Login';

const master = require('../../assets/master2.png');

const Frontpage = () => {
    const { logged } = useMe()
    return (
        <View style={tyyli.container}>
            <Image source={master} resizeMode='cover' style={tyyli.kuva} />
            {(logged) ? 
            <>
                <NaviButton to="/peli" text="New Game" />
                <NaviButton to="/courses" text="Courses" />
                <NaviButton to="/friends" text="Friends" />
            </>: <Login />}
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
        elevation: 5,
        marginTop: 5,
        width: Dimensions.get('window').width,
        padding: 25,
        backgroundColor: '#ffffff',
    },
    text: {
        textAlign: 'center',
        fontSize: theme.font.sizes.large,
        fontFamily: theme.font.family
    }
})

export default Frontpage;