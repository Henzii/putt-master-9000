/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect } from 'react';
import { View, StyleSheet, Linking } from "react-native";
import { Button } from 'react-native-paper';
import { Link, useNavigate } from 'react-router-native';
import Loading from '../../components/Loading';
import Login from '../../components/Login';
import Container from '../../components/ThemedComponents/Container';
import ErrorScreen from '../../components/ErrorScreen';
import { useQuery } from '@apollo/client';
import { GET_OLD_GAMES } from '../../graphql/queries';
import firstTimeLaunched from '../../utils/firstTimeLaunched';
import NavIcon from './NavIcon';
import Spacer from '../../components/ThemedComponents/Spacer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header/Header';
import { SESSION_STATE, useSession } from '../../hooks/useSession';

const pilli = require('../../../assets/icons/play.png');
const maali = require('../../../assets/icons/checklist.png');
const courses = require('../../../assets/icons/place.png');
const friends = require('../../../assets/icons/friends.png');
const stats = require('../../../assets/icons/stats.png');
const settings = require('../../../assets/icons/settings.png');
// const resume = require('../../../assets/icons/continue.png');
const achievement = require('../../../assets/icons/achievement.png');
const signout = require('../../../assets/icons/sign-out.png');
const www = require('../../../assets/icons/www.png');
const feedback = require('../../../assets/icons/feedback.png');

const Frontpage = () => {
    const openGames = useQuery(GET_OLD_GAMES, { variables: { onlyOpenGames: true }, fetchPolicy: 'cache-and-network' });
    const navi = useNavigate();

    const session = useSession();

    const handleOpenWebsite = async () => {
        const token = await AsyncStorage.getItem('token');
        Linking.openURL(`https://fudisc.henzi.fi/login?token=${token}`);
    };

    useEffect(() => {
        (async function IIFE() {
            if (!session.isLoggedIn && session.state === SESSION_STATE.FINISHED && await firstTimeLaunched()) {
                navi('/firstTime');
            }
        })();
    }, [session]);
    if (session.state === SESSION_STATE.LOADING) {
        return (
            <Loading loadingText='Connecting to server...' showTexts />
        );
    }
    if (session.state === SESSION_STATE.ERROR) {
        return (
            <ErrorScreen errorMessage='Session failed' />
        );
    }

    const ongoingGames = openGames.data?.getGames?.games ?? [];

    return (
        <Container noFlex withScrollView style={{ alignItems: 'center' }} noPadding>
            {(session.isLoggedIn) ?
                <>
                    <Header openGames={ongoingGames} />
                    <Spacer size={20} />
                    <View style={styles.iconsContainer}>
                        <NavIcon title="New Game" to="/game?force" icon={pilli} />
                        <NavIcon title="Old games" to="/games" icon={maali} />
                        <NavIcon title="Courses" to="/courses" icon={courses} />
                        <NavIcon title="Friends" to="/friends"icon={friends} />
                        <NavIcon title="Stats" to="/stats"icon={stats}  />
                        <NavIcon title="Achievements" to="/achievements"icon={achievement} />
                        <NavIcon title="Settings" to="/settings" icon={settings} />
                        <NavIcon title="Website" to="/" icon={www} onClick={handleOpenWebsite} />
                        <NavIcon title="Feedback" to="feedback" icon={feedback} />
                        <NavIcon title="Logout" to="/" icon={signout} onClick={() => session.clear()} />
                    </View>
                </>
                :
                <>
                    <Login />
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