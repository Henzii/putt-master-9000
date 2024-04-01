/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Button } from 'react-native-paper';
import { Link, useNavigate } from 'react-router-native';
import useMe from '../../hooks/useMe';
import Loading from '../../components/Loading';
import Login from '../../components/Login';
import Container from '../../components/ThemedComponents/Container';
import ErrorScreen from '../../components/ErrorScreen';
import { useQuery } from '@apollo/client';
import { GET_OLD_GAMES } from '../../graphql/queries';
import firstTimeLaunched from '../../utils/firstTimeLaunched';
import OpenGames from './OpenGames';
import NavIcon from './NavIcon';
import Spacer from '../../components/ThemedComponents/Spacer';

const pilli = require('../../../assets/icons/pilli.png');
const maali = require('../../../assets/icons/maali.png');
const courses = require('../../../assets/icons/courses.png');
const friends = require('../../../assets/icons/friends.png');
const stats = require('../../../assets/icons/stats.png');
const settings = require('../../../assets/icons/settings.png');
// const resume = require('../../../assets/icons/continue.png');
const achievement = require('../../../assets/icons/achievement.png');

const Frontpage = () => {
    const { me, logged, logout, login, loading, error } = useMe();
    const openGames = useQuery(GET_OLD_GAMES, { variables: { onlyOpenGames: true }, fetchPolicy: 'cache-and-network' });
    const navi = useNavigate();

    useEffect(() => {
        (async function IIFE() {
            if (!logged && !loading && await firstTimeLaunched()) {
                navi('/firstTime');
            }
        })();
    }, [loading]);
    if (loading && !me) {
        return (
            <Loading loadingText='Connecting to server...' showTexts />
        );
    }
    if (error) {
        return (
            <ErrorScreen errorMessage={error?.message} />
        );
    }

    return (
        <Container noFlex withScrollView style={{ alignItems: 'center' }} noPadding>
            {(logged) ?
                <>
                    <OpenGames openGames={openGames.data?.getGames?.games ?? []} />
                    <Spacer size={20} />
                    <View style={styles.iconsContainer}>
                        <NavIcon title="New Game" to="/game?force" icon={pilli} backgroundColor="#DDFFDC" />
                        <NavIcon title="Old games" to="/games" icon={maali} backgroundColor="#FFE1E1" />
                        <NavIcon title="Courses" to="/courses" icon={courses} backgroundColor="#D6FFFF" />
                        <NavIcon title="Friends" to="/friends"icon={friends} backgroundColor="#F6DCFF" />
                        <NavIcon title="Stats" to="/stats"icon={stats} backgroundColor="#FFC989" />
                        <NavIcon title="Achievements" to="/achievements"icon={achievement} backgroundColor="#FAFFBB" />
                        <NavIcon title="Settings" to="/settings" icon={settings} backgroundColor="#D3D3D3" />
                    </View>
                    <Spacer />
                    <Text>Logged in as {me?.name}</Text>
                    <Button onPress={logout}>Logout</Button>
                </>
                :
                <>
                    <Login login={login} />
                    <Link to="/signUp"><Button>Sign up!</Button></Link>
                    {process.env.NODE_ENV === 'development' && (
                        <>
                            <Link to="/firstTime"><Button>FirstTime</Button></Link>
                        </>
                    )}
                </>
            }
        </Container>
    );
};

const styles = StyleSheet.create({
    iconsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        gap: 10,
        padding: 5,
    }
});

export default Frontpage;