/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking, ScrollView } from "react-native";
import { Button, Paragraph, useTheme } from 'react-native-paper';
import { Link, useNavigate } from 'react-router-native';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
            <Loading loadingText={t('screens.frontpage.connectingToServer')} showTexts />
        );
    }
    if (session.state === SESSION_STATE.ERROR) {
        return (
            <ErrorScreen errorMessage={t('screens.frontpage.sessionFailed')} showBackToFrontpage={false}>
                <Spacer />
                <Paragraph>{t('screens.frontpage.sessionFixSuggestion')}</Paragraph>
                <Button onPress={() => session.clear()}>{t('screens.frontpage.clearSession')}</Button>
                <Button onPress={() => ExpoUpdates.reloadAsync()}>{t('screens.frontpage.reloadApp')}</Button>
            </ErrorScreen>
        );
    }

    if (!session.isLoggedIn) {
        return (
            <Container>
                <Login />
                <Link to="/signUp"><Button>{t('screens.frontpage.signUp')}</Button></Link>
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
                    <NavIcon title={t('screens.frontpage.newGame')} to="/game?force" icon={play} />
                    <NavIcon title={t('screens.frontpage.oldGames')} to="/games" icon={maali} />
                    <NavIcon title={t('screens.frontpage.courses')} to="/courses" icon={courses} />
                    <NavIcon title={t('screens.frontpage.friends')} to="/friends" icon={friends} />
                    <NavIcon title={t('screens.frontpage.stats')} to="/stats" icon={stats} />
                    <NavIcon title={t('screens.frontpage.achievements')} to="/achievements" icon={achievement} />
                    <NavIcon title={t('screens.frontpage.group')} to="/group" icon={group} />
                    <NavIcon title={t('screens.frontpage.settings')} to="/settings" icon={settings} />
                    <NavIcon title={t('screens.frontpage.website')} to="/" icon={www} onClick={handleOpenWebsite} />
                    <NavIcon title={t('screens.frontpage.distance')} to="/distance" icon={distance} />
                    <NavIcon title={t('screens.frontpage.feedback')} to="feedback" icon={feedback} />
                    <NavIcon title={t('screens.frontpage.logout')} to="/" icon={signout} onClick={() => session.clear()} />
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