/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect } from 'react';
import { View, StyleSheet, Linking } from "react-native";
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
import LoggedIn from './LoggedIn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pilli = require('../../../assets/icons/pilli.png');
const maali = require('../../../assets/icons/maali.png');
const courses = require('../../../assets/icons/courses.png');
const friends = require('../../../assets/icons/friends.png');
const stats = require('../../../assets/icons/stats.png');
const settings = require('../../../assets/icons/settings.png');
// const resume = require('../../../assets/icons/continue.png');
const achievement = require('../../../assets/icons/achievement.png');
const signout = require('../../../assets/icons/sign-out.png');
const www = require('../../../assets/icons/www.png');

const Frontpage = () => {
    const { me, logged, logout, login, loading, error } = useMe();
    const openGames = useQuery(GET_OLD_GAMES, { variables: { onlyOpenGames: true }, fetchPolicy: 'cache-and-network' });
    const navi = useNavigate();

    const handleOpenWebsite = async () => {
        const token = await AsyncStorage.getItem('token');
        Linking.openURL(`https://fudisc.henzi.fi/login?token=${token}`);
    };

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

    const ongoingGames = openGames.data?.getGames?.games ?? [];

    return (
        <Container noFlex withScrollView style={{ alignItems: 'center' }} noPadding>
            {(logged) ?
                <>
                    {ongoingGames.length ? <OpenGames openGames={ongoingGames} /> : <LoggedIn />}
                    <Spacer size={20} />
                    <View style={styles.iconsContainer}>
                        <NavIcon title="New Game" to="/game?force" icon={pilli} iconColor='#006633' />
                        <NavIcon title="Old games" to="/games" icon={maali} iconColor="#333366" />
                        <NavIcon title="Courses" to="/courses" icon={courses} iconColor="#663333" />
                        <NavIcon title="Friends" to="/friends"icon={friends} iconColor="#003333"  />
                        <NavIcon title="Stats" to="/stats"icon={stats} iconColor="#663366" />
                        <NavIcon title="Achievements" to="/achievements"icon={achievement} iconColor="#666600"  />
                        <NavIcon title="Settings" to="/settings" icon={settings} />
                        <NavIcon title="Website" to="/" icon={www} onClick={handleOpenWebsite} />
                        <NavIcon title="Logout" to="/" icon={signout} onClick={logout} iconColor="#A00000" />
                    </View>
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