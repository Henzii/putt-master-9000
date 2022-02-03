import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView } from "react-native";
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-native';
import useMe from '../hooks/useMe';
import { RootState } from '../utils/store';
import { theme } from '../utils/theme';
import Login from './Login';

const master = require('../../assets/master2.png');

const Frontpage = () => {
    const { me, logged, logout, login } = useMe();
    const gameData = useSelector((state: RootState) => state.gameData)
    
    return (
        <ScrollView contentContainerStyle={tyyli.container} >
            <Image source={master} resizeMode='stretch' style={tyyli.kuva} />
            {(logged) ?
                <>
                    <NaviButton to="/game" text={gameData?.gameId ? 'Continue game' : 'New game' } />
                    <NaviButton to="/games" text="Old games" />
                    <NaviButton to="/courses" text="Courses" />
                    <NaviButton to="/friends" text="Friends" />
                    <NaviButton to="/settings" text="Settings" />
                    <Text>Logged in as {me?.name}</Text>
                    <Button onPress={logout}>Logout</Button>
                </>
                :
                <>
                    <Login login={login} />
                    <Link to="/signUp"><Text>Sign up!</Text></Link>
                </>
            }
        </ScrollView>
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
        width: 300,
        height: 300
    },
    container: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        height: 1000,
        backgroundColor: '#fafafa'
    },
    root: {
        borderWidth: 1,
        borderColor: 'lightgray',
        width: Dimensions.get('window').width * 0.8,
        borderRadius: 15,
        padding: 20,
        elevation: 4,
        marginBottom: 13,
        backgroundColor: '#ffffff',
    },
    text: {
        textAlign: 'center',
        fontSize: theme.font.sizes.large,
        fontFamily: theme.font.family
    }
})

export default Frontpage;