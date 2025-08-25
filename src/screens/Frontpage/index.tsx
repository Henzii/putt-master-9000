/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking, ScrollView } from "react-native";
import { Button, Paragraph, useTheme } from 'react-native-paper';
import { Link, useNavigate } from 'react-router-native';
import Loading from '@components/Loading';
import Login from '@components/Login';
import Container from '@components/ThemedComponents/Container';
import ErrorScreen from '@components/ErrorScreen';
import { useQuery } from '@apollo/client';
import { GET_OLD_GAMES } from '../../graphql/queries';
import firstTimeLaunched from '../../utils/firstTimeLaunched';
import NavIcon from './NavIcon';
import Spacer from '@components/ThemedComponents/Spacer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SESSION_STATE, useSession } from '../../hooks/useSession';
import * as ExpoUpdates from 'expo-updates';
import FrontpageHeader from './Header/Header';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

import play from '@icons/play.png';
import maali from '@icons/checklist.png';
import courses from '@icons/place.png';
import friends from '@icons/friends.png';
import stats from '@icons/stats.png';
import settings from '@icons/settings.png';
import achievement from '@icons/achievement.png';
import signout from '@icons/sign-out.png';
import www from '@icons/www.png';
import feedback from '@icons/feedback.png';
import group from '@icons/group.png';
import distance from '@icons/distance.png';

const Frontpage = () => {
    const openGames = useQuery(GET_OLD_GAMES, { variables: { onlyOpenGames: true }, fetchPolicy: 'cache-and-network' });
    const navi = useNavigate();
    const [spacing, setSpacing] = useState(50);
    const {colors} = useTheme();
    const styles = createStyles(colors);
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
            <ErrorScreen errorMessage='Session failed' showBackToFrontpage={false}>
                <Spacer />
                <Paragraph>Some things you might want to try to fix this error:</Paragraph>
                <Button onPress={() => session.clear()}>Clear session</Button>
                <Button onPress={() => ExpoUpdates.reloadAsync()}>Reload the app</Button>
            </ErrorScreen>
        );
    }

    if (!session.isLoggedIn) {
        return (
            <Container>
                <Login />
                <Link to="/signUp"><Button>Sign up!</Button></Link>
                {process.env.NODE_ENV === 'development' && (
                    <>
                        <Link to="/firstTime"><Button>FirstTime</Button></Link>
                    </>
                )}
            </Container>
        );
    }

    const ongoingGames = openGames.data?.getGames?.games ?? [];

    return (
        <View style={styles.container}>
            <FrontpageHeader openGames={ongoingGames} setSpacing={setSpacing} />
            <ScrollView>
                <Spacer size={spacing - 20} />
                <View style={styles.iconsContainer}>
                    <NavIcon title="New Game" to="/game?force" icon={play} />
                    <NavIcon title="Old games" to="/games" icon={maali} />
                    <NavIcon title="Courses" to="/courses" icon={courses} />
                    <NavIcon title="Friends" to="/friends" icon={friends} />
                    <NavIcon title="Stats" to="/stats" icon={stats} />
                    <NavIcon title="Achievements" to="/achievements" icon={achievement} />
                    <NavIcon title="Group" to="/group" icon={group} />
                    <NavIcon title="Settings" to="/settings" icon={settings} />
                    <NavIcon title="Website" to="/" icon={www} onClick={handleOpenWebsite} />
                    <NavIcon title="Distance" to="/distance" icon={distance} />
                    <NavIcon title="Feedback" to="feedback" icon={feedback} />
                    <NavIcon title="Logout" to="/" icon={signout} onClick={() => session.clear()} />
                </View>
                    <Spacer size={80} />
            </ScrollView>
        </View>
    );
};

const createStyles = (colors: MD3Colors) => StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
    },
    iconsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        gap: 10,
        paddingHorizontal: 5,
    }
});

export default Frontpage;