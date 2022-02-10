import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView } from "react-native";
import { Button, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-native';
import useMe from '../hooks/useMe';
import { RootState } from '../utils/store';
import Loading from './Loading';
import Login from './Login';
import Container from './ThemedComponents/Container';

const master = require('../../assets/master2.png');

const Frontpage = () => {
    const { me, logged, logout, login, loading } = useMe();
    const gameData = useSelector((state: RootState) => state.gameData)
    
    if (loading) {
        return (
            <Loading loadingText='Connecting to server...' />
        )
    }
    return (
        <Container noPadding>
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20, }}>
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
                    <Link to="/signUp"><Button>Sign up!</Button></Link>
                </>
            }
        </ScrollView>
        </Container>
    )
}

const NaviButton = ({ text, to }: { text: string, to: string }) => {
    const { colors, fonts } = useTheme();
    return (
        <Link to={to} underlayColor="none">
            <View style={[tyyli.root, { backgroundColor: colors.background }]}>
                <Text style={{ textAlign: 'center', fontSize: 18, }}>{text}</Text>
            </View>
        </Link>

    )
}
const tyyli = StyleSheet.create({
    kuva: {
        width: 250,
        height: 250
    },
    root: {
        borderWidth: 1,
        borderColor: 'lightgray',
        width: Dimensions.get('window').width * 0.8,
        borderRadius: 15,
        padding: 20,
        elevation: 4,
        marginBottom: 13,
    },
})

export default Frontpage;