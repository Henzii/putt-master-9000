/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ImageSourcePropType } from "react-native";
import { Button, Paragraph, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-native';
import useMe from '../../hooks/useMe';
import { RootState } from '../../utils/store';
import Loading from '../../components/Loading';
import Login from '../../components/Login';
import Container from '../../components/ThemedComponents/Container';
import ErrorScreen from '../../components/ErrorScreen';
import { useLazyQuery, useQuery } from 'react-apollo';
import { GET_GAME, GET_OLD_GAMES } from '../../graphql/queries';
import firstTimeLaunched from '../../utils/firstTimeLaunched';

const master = require('../../../assets/master2.png');
const pilli = require('../../../assets/icons/pilli.png');
const maali = require('../../../assets/icons/maali.png');
const courses = require('../../../assets/icons/courses.png');
const friends = require('../../../assets/icons/friends.png');
const stats = require('../../../assets/icons/stats.png');
const settings = require('../../../assets/icons/settings.png');
const resume = require('../../../assets/icons/continue.png');
const achievement = require('../../../assets/icons/achievement.png');

const Frontpage = () => {
    const { me, logged, logout, login, loading, error } = useMe();
    const gameData = useSelector((state: RootState) => state.gameData);
    const [getGame, data] = useLazyQuery(GET_GAME);
    const openGames = useQuery(GET_OLD_GAMES, { variables: { onlyOpenGames: true }, fetchPolicy: 'cache-and-network' });
    const navi = useNavigate();

    useEffect(() => {
        if (gameData?.gameId) {
            getGame({ variables: { gameId: gameData.gameId } });
        }
    }, [gameData]);
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

    const openGamesCount = openGames.data?.getGames?.games?.length || 0;
    let oldGamesText = `Browse old and open games.`;
    if (openGamesCount > 0) {
        oldGamesText += (openGamesCount === 1)
            ? `\nYou have one open game at ${openGames.data.getGames.games[0].course}`
            : `\nYou have ${openGamesCount} open games!`;
    }
    return (
        <Container noFlex withScrollView style={{ alignItems: 'center' }}>
            <Image source={master} resizeMode='stretch' style={tyyli.kuva} />
            {(logged) ?
                <>
                    {data?.data?.getGame?.course &&
                       <NaviCard title='Continue Game' text={`Continue game at ${data.data.getGame.course}`} to="/game" icon={resume} />
                    }
                    <NaviCard title='New Game' text="Create a new game!" to="/game?force" icon={pilli} />
                    <NaviCard title="Old games" text={oldGamesText} to="/games" icon={maali} />
                    <NaviCard title="Courses" to="/courses" text="Add/browse/search courses." icon={courses} />
                    <NaviCard title="Friends" to="/friends" text="Find, add, kill friends. Or create one. <3" icon={friends} />
                    <NaviCard title="Stats" to="/stats" text="Check your stats, find your handicap. GRAPHS!" icon={stats} />
                    <NaviCard title="Achievements" to="/achievements" text="View your achievements" icon={achievement} />
                    <NaviCard title="Settings" to="/settings" text="Set your settings, end prohibition, change password etc." icon={settings} />
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

const NaviCard = ({ title, text, to, icon }: { title: string, text: string, to: string, icon?: ImageSourcePropType }) => {
    const [pressed, setPressed] = useState(false);
    return (
        <Link to={to} underlayColor="none" onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
            <View style={[tyyli.naviCard, (pressed && tyyli.naviCardPressed)]}>
                <View style={tyyli.naviIconContainer}>
                    {icon && <Image style={tyyli.naviIcon} source={icon} />}
                </View>
                <View style={tyyli.naviText}>
                    <Title style={{ color: '#205542' }}>{title}</Title>
                    <Paragraph>{text}</Paragraph>
                </View>
            </View>
        </Link>
    );
};
const tyyli = StyleSheet.create({
    boldText: {
        fontWeight: 'bold',
    },
    naviIconContainer: {
        width: '20%'
    },
    naviIcon: {
        width: 50,
        height: 50,
    },
    naviText: {
        width: '75%'
    },
    naviCardPressed: {
        backgroundColor: '#efefef',
        elevation: 5,
    },
    naviCard: {
        width: Dimensions.get('window').width * 0.95,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 100,
        backgroundColor: '#ffffff',
        borderColor: 'lightgray',
        borderRadius: 5,
        borderWidth: 1,
        padding: 10,
        elevation: 2,
        marginBottom: 10,
    },
    kuva: {
        width: 220,
        height: 220,
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
});

export default Frontpage;