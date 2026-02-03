import React from 'react';
import { Alert, StyleSheet } from "react-native";
import { Button, Paragraph, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/store';
import { gameData, unloadGame } from '../../reducers/gameDataReducer';
import Container from '../../components/ThemedComponents/Container';
import Divider from '../../components/ThemedComponents/Divider';
import useGame from '../../hooks/useGame';
import { addNotification } from '../../reducers/notificationReducer';
import { useNavigate } from 'react-router-native';
import Loading from '../../components/Loading';
import { useMutation } from '@apollo/client';
import { ABANDON_GAME } from '../../graphql/mutation';
import { GET_OLD_GAMES } from '../../graphql/queries';
import { format, fromUnixTime, differenceInMinutes, minutesToHours, differenceInDays } from 'date-fns';
import Spacer from '../../components/ThemedComponents/Spacer';
import LocalSettings from '../../components/LocalSettings';
import { useTranslation } from 'react-i18next';

const Setup = () => {
    const { t } = useTranslation();
    const gameData = useSelector((state: RootState) => state.gameData) as gameData;
    const dispatch = useDispatch();
    const navi = useNavigate();
    const gameHook = useGame(gameData.gameId);
    const [abandonGameMutation] = useMutation(ABANDON_GAME, { refetchQueries: [{ query: GET_OLD_GAMES }] });

    const game = gameHook.data;
    const handleGameEnd = async () => {
        Alert.alert(
            t('screens.game.setup.closeConfirmTitle'),
            t('screens.game.setup.closeConfirmMessage'),
            [
                {
                    text: t('common.cancel'),
                    onPress: () => null
                },
                {
                    text: 'Do it!',
                    onPress: async () => {
                        if (await gameHook.closeGame()) {
                            dispatch(addNotification(t('screens.game.setup.gameClosed'), 'success'));
                        } else {
                            dispatch(addNotification(t('screens.game.setup.errorOccurred'), 'alert'));
                        }
                    }
                },
            ]
        );
    };
    const handleAbandonGame = async () => {
        const res = await abandonGameMutation({ variables: { gameId: gameData.gameId } });
        if (res.data.abandonGame) {
            dispatch(unloadGame());
            dispatch(addNotification(t('screens.game.setup.gameAbandoned'), 'success'));
        } else {
            dispatch(addNotification('Something went wrong!', 'alert'));
        }
    };

    const handleQuitGame = () => {
        navi('/');
        dispatch(unloadGame());
    };
    const handleReopen = async () => {
        await gameHook.closeGame(true);
    };
    const verifyAbandonGame = () => {
        Alert.alert(
            t('screens.game.setup.reopenConfirmTitle'),
            t('screens.game.setup.reopenConfirmMessage'),
            [
                {
                    text: t('common.cancel'),
                    onPress: () => null
                },
                {
                    text: t('common.yes'),
                    onPress: handleAbandonGame
                },
            ]
        );
    };
    if (!game) {
        return (<Loading />);
    }
    const startDate = fromUnixTime(game.startTime / 1000);
    const endDate = (game.endTime ? fromUnixTime(game.endTime / 1000) : undefined);
    const startDateFormatted = format(startDate, 'dd.MM.yyyy HH:mm');
    const endDateFormatted = (endDate ? format(endDate, 'dd.MM.yyyy HH:mm') : '?');
    const duration = differenceInMinutes(endDate || new Date(), startDate);
    const durationString = (duration > 60)
        ? `${minutesToHours(duration)} h ${duration % 60} min`
        : `${duration} min`;
    return (
        <Container withScrollView noPadding>
            <Container verticalPadding>
                <Title>{t('screens.game.setup.info')}</Title>
                <Paragraph>{t('screens.game.setup.started')}          {startDateFormatted}</Paragraph>
                <Paragraph>{t('screens.game.setup.closed')}           {endDateFormatted}</Paragraph>
                <Paragraph>{t('screens.game.setup.duration')}        {durationString}</Paragraph>
            </Container>
            <Divider />
            {game.isOpen && (
                <>
                    <Container verticalPadding>
                        <Title>{t('screens.game.setup.endGame')}</Title>
                        <Paragraph>
                            {t('screens.game.setup.stopDrinkingMessage')}
                        </Paragraph>
                        <Spacer />
                        <Button
                            mode='contained'
                            style={tyyli.nappi}
                            onPress={handleGameEnd}
                            disabled={!game.isOpen}
                        >{t('screens.game.setup.endGame')}
                        </Button>
                    </Container>
                    <Divider />
                </>
            )}
            {!game.isOpen && differenceInDays(new Date(), endDate || new Date()) < 30 &&  (
                <>
                    <Container verticalPadding>
                        <Title>{t('screens.game.setup.reopen')}</Title>
                        <Paragraph>
                            {t('screens.game.setup.reopenMessage')}
                        </Paragraph>
                        <Spacer />
                        <Button mode="contained" buttonColor="orange" style={tyyli.nappi} onPress={handleReopen}>{t('screens.game.setup.reopen')}</Button>
                    </Container>
                    <Divider />
                </>
            )}
            <Container verticalPadding>
                <Title>{t('screens.game.setup.mainMenu')}</Title>
                <Paragraph>
                    {t('screens.game.setup.mainMenuMessage')}
                </Paragraph>
                <Spacer />
                <Button
                    onPress={handleQuitGame}
                    mode='contained'
                    style={tyyli.nappi}
                >{t('common.leave')}</Button>
            </Container>
            <Divider />
            <LocalSettings />
            <Divider />
            <Container verticalPadding>
                <Paragraph>
                    {t('screens.game.setup.discardMessage')}
                </Paragraph>
                <Spacer />
                <Button style={tyyli.nappi} mode='contained' buttonColor='darkred' onPress={verifyAbandonGame}>{t('screens.game.setup.discardGame')}</Button>
            </Container>
            <Divider />
            <Paragraph style={{ color: 'gray' }}>
                {t('screens.game.setup.gameId')} {gameData.gameId} {gameData.noSubscription && ` / ${t('screens.game.setup.noSubscription')}`}
            </Paragraph>
        </Container>
    );
};
const tyyli = StyleSheet.create({
    divider: {
        marginTop: 15,
        marginBottom: 15,
        height: 1,
    },
    numberInput: {
        width: 100,
    },
    nappi: {
        paddingVertical: 5,
        borderRadius: 7,
    },
    input: {
        minWidth: 130,
        maxWidth: '50%',
    }
});
export default Setup;

