import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../utils/store';
import { gameData } from '../../../reducers/gameDataReducer';
import useGame from '../../../hooks/useGame';
import { Button, Checkbox, DataTable, Title } from 'react-native-paper';
import Container from '../../../components/ThemedComponents/Container';
import RandomItem from './RandomItem';
import { DISC_KEYS, THROW_STYLE_KEYS } from '../../../constants/constants';
import Spacer from '../../../components/ThemedComponents/Spacer';
import { Audio } from 'expo-av';
import { Text, Pressable, StyleSheet } from 'react-native';

const RANDOMIZER_TIME = 15;

const ThrowStyle = () => {
    const { t } = useTranslation();
    const gameId = (useSelector((state: RootState) => state.gameData) as gameData).gameId;
    const [isRunning, setIsRunning] = useState(false);
    const [individualThrowStyles, setIndividualThrowStyles] = useState(true);
    const [tuplausMusic, setTuplausMusic] = useState<Audio.Sound>();
    const ref = useRef<NodeJS.Timeout>(null);
    const [timeLeft, setTimeLeft] = useState(RANDOMIZER_TIME);
    const game = useGame(gameId);

    const handleStartClick = async () => {
        setIsRunning(true);
        setTimeLeft(RANDOMIZER_TIME);
        ref.current = setInterval(() => setTimeLeft(value => value - 1), 1000);
        tuplausMusic?.playAsync();
    };

    const handleStopRunning = () => {
        setIsRunning(false);
        if (ref.current) {
            clearInterval(ref.current);
        }
        tuplausMusic?.stopAsync();
    };

    useEffect(() => {
        const loadSound = async () => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { sound } = await Audio.Sound.createAsync(require('../../../../assets/sounds/tuplaus.mp3'));
            setTuplausMusic(sound);
        };
        loadSound();
    }, []);

    useEffect(() => {
        return () => {
            tuplausMusic?.stopAsync();
        };
    }, [tuplausMusic]);

    useEffect(() => {
        if (timeLeft <= 0 && isRunning) {
            handleStopRunning();
        }
    }, [timeLeft]);

    return (
        <Container>
            <Title>{t('screens.game.throwStyle.title')}</Title>
            <Pressable style={{ flexDirection: 'row', paddingRight: 10, alignItems: 'center', marginVertical: 8 }} onPress={() => setIndividualThrowStyles(value => !value)}>
                <Checkbox status={individualThrowStyles ? 'checked' : 'unchecked'} />
                <Text numberOfLines={2}>{t('screens.game.throwStyle.individualThrowStyles')}</Text>
            </Pressable>
            {individualThrowStyles ? (
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>{t('screens.game.throwStyle.player')}</DataTable.Title>
                        <DataTable.Title>{t('screens.game.throwStyle.disc')}</DataTable.Title>
                        <DataTable.Title>{t('screens.game.throwStyle.style')}</DataTable.Title>
                    </DataTable.Header>
                    {game.data?.scorecards.map(sc =>
                        <DataTable.Row key={sc.user.id}>
                            <DataTable.Cell>{sc.user.name}</DataTable.Cell>
                            <DataTable.Cell><RandomItem items={DISC_KEYS} isRunning={isRunning} /></DataTable.Cell>
                            <DataTable.Cell><RandomItem items={THROW_STYLE_KEYS} isRunning={isRunning} /></DataTable.Cell>
                        </DataTable.Row>
                    )}
                </DataTable>
            ) : (
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title textStyle={styles.largeText}>
                            {t('screens.game.throwStyle.disc')}
                        </DataTable.Title>
                        <DataTable.Title textStyle={styles.largeText}>
                            {t('screens.game.throwStyle.style')}
                        </DataTable.Title>
                    </DataTable.Header>
                    <DataTable.Row>
                        <DataTable.Cell>
                            <RandomItem items={DISC_KEYS} isRunning={isRunning} style={[styles.mediumText]} />

                        </DataTable.Cell>
                        <DataTable.Cell>
                            <RandomItem items={THROW_STYLE_KEYS} isRunning={isRunning} style={styles.mediumText} />
                        </DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            )}
            <Spacer />
            <Button mode="contained" onPress={handleStartClick} disabled={isRunning}>{isRunning ? `${timeLeft}...` : t('screens.game.throwStyle.startRandomizing')}</Button>
            {isRunning && (
                <>
                    <Spacer />
                    <Button mode="contained-tonal" onPress={handleStopRunning}>{t('screens.game.throwStyle.stopRandomizing')}</Button>
                </>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    largeText: {
        fontSize: 20
    },
    mediumText: {
        fontSize: 18,
        fontWeight: '600'
    }
});

export default ThrowStyle;