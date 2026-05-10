/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking, ScrollView, Image } from "react-native";
import { Button, Divider, List, Paragraph, useTheme } from 'react-native-paper';
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
import weeklies from '@icons/weeklies.png';

import group from '@icons/group.png';
import achievements from '@icons/achievement.png';
import distance from '@icons/distance.png';
import settings from '@icons/settings.png';
import website from '@icons/www.png';
import feedback from '@icons/feedback.png';
import logout from '@icons/sign-out.png';

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
                <Spacer size={spacing-10} />
                <View style={styles.iconsContainer}>
                    <NavIcon title={t('screens.frontpage.newGame')} to="/game?force" icon={play} />
                    <NavIcon title={t('screens.frontpage.oldGames')} to="/games" icon={maali} description={t('screens.frontpage.oldGamesDescription')} />
                    <NavIcon title={t('screens.frontpage.courses')} to="/courses" icon={courses} description={t('screens.frontpage.coursesDescription')} />
                    <NavIcon title={t('screens.frontpage.stats')} to="/stats" icon={stats} />
                    <NavIcon title={t('screens.frontpage.weeklies')} to="/weeklies" icon={weeklies} description={t('screens.frontpage.weekliesDescription')} />
                </View>
                <Spacer size={16} />
                <Divider />
                <List.Item
                    title={t('screens.frontpage.friends')}
                    left={() => <Image source={friends} style={styles.listItemIcon} />}
                    right={(p) => <List.Icon {...p} icon="chevron-right" />}
                    onPress={() => navi('/friends')}
                />
                <List.Item
                    title={t('screens.frontpage.achievements')}
                    left={() => <Image source={achievements} style={styles.listItemIcon} />}
                    right={(p) => <List.Icon {...p} icon="chevron-right" />}
                    onPress={() => navi('/achievements')}
                />
                <Divider />
                <List.Item
                    title={t('screens.frontpage.group')}
                    description={t('screens.frontpage.groupDescription')}
                    left={() => <Image source={group} style={styles.listItemIcon} />}
                    right={(p) => <List.Icon {...p} icon="chevron-right" />}
                    onPress={() => navi('/group')}
                />
                <Divider />
                <List.Item
                    title={t('screens.frontpage.distance')}
                    description={t('screens.frontpage.distanceDescription')}
                    left={() => <Image source={distance} style={styles.listItemIcon} />}
                    right={(p) => <List.Icon {...p} icon="chevron-right" />}
                    onPress={() => navi('/distance')}
                />
                <Divider />
                <List.Item
                    title={t('screens.frontpage.settings')}
                    left={() => <Image source={settings} style={styles.listItemIcon} />}
                    right={(p) => <List.Icon {...p} icon="chevron-right" />}
                    onPress={() => navi('/settings')}
                />
                <Divider />
                <List.Item
                    title={t('screens.frontpage.website')}
                    left={() => <Image source={website} style={styles.listItemIcon} />}
                    right={(p) => <List.Icon {...p} icon="open-in-new" />}
                    onPress={handleOpenWebsite}
                />
                <Divider />
                <List.Item
                    title={t('screens.frontpage.feedback')}
                    left={() => <Image source={feedback} style={styles.listItemIcon} />}
                    right={(p) => <List.Icon {...p} icon="chevron-right" />}
                    onPress={() => navi('/feedback')}
                />
                <Divider />
                <List.Item
                    title={t('screens.frontpage.logout')}
                    left={() => <Image source={logout} style={styles.listItemIcon} />}
                    onPress={() => session.clear()}
                    titleStyle={styles.logoutText}
                />
                <Spacer size={80} />
            </ScrollView>
        </View>
    );
};

const createStyles = (colors: MD3Colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    iconsContainer: {
    },
    logoutText: {
        color: colors.error,
    },
    listItemIcon: {
        width: 30,
        height: 30,
        alignSelf: 'center',
        marginLeft: 12,
    }
});

export default Frontpage;
