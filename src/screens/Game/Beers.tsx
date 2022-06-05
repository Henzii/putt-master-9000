import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Headline, Modal, Paragraph, Portal, TextInput } from "react-native-paper";
import Container from "../../components/ThemedComponents/Container";
import useGame, { Scorecard } from '../../hooks/useGame';
import useTextInput from '../../hooks/useTextInput';
import { Ionicons } from '@expo/vector-icons';
import beerPoems from '../../utils/beerPoems.json';
import Loading from '../../components/Loading';
import ErrorScreen from '../../components/ErrorScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../../utils/store';
import { gameData } from '../../reducers/gameDataReducer';
import AlcConverter from '../../components/AlcConverter';
import Divider from '../../components/ThemedComponents/Divider';

const Beers = () => {

    const gameData = useSelector((state: RootState) => state.gameData) as gameData;

    const gameId = gameData.gameId;
    const { data, setBeers, loading, error } = useGame(gameId);
    const [poem, setPoem] = useState({ poem: '', author: '' });
    const [converterOpen, setConverterOpen] = useState(true);

    useEffect(() => {
        const randomi = Math.floor(Math.random() * beerPoems.poems.length);
        const poem = beerPoems.poems[randomi].text;
        const author = beerPoems.poems[randomi].author;
        setPoem({ poem, author });
    }, []);
    const handleBeersChange = (playerId: string, beers: string) => {
        const beersInt = Number.parseInt(beers);
        setBeers(playerId, beersInt);
    };
    if (!data && loading) {
        return <Loading />;
    } else if (!data || error) {
        return <ErrorScreen errorMessage='Whaaaat?!' />;
    }
    return (
        <Container withScrollView>
            <Portal>
                <Modal
                    visible={converterOpen}
                    onDismiss={() => setConverterOpen(false)}
                >
                    <Container noFlex style={{ marginHorizontal: 20 }}>
                        <Button
                            style={{ right: -37, top: -15, zIndex: 999, position: 'absolute' }}
                            labelStyle={{ fontSize: 33 }}
                            icon="close-circle"
                            onPress={() => setConverterOpen(false)}
                        >
                            &nbsp;
                        </Button>
                        <AlcConverter />
                    </Container>
                </Modal>
            </Portal>
            <Headline>Beers</Headline>
            <View style={tyylit.inputContainer}>
                {data.scorecards.map(sc => <SingleJuoppo disabled={!data.isOpen} sc={sc} key={sc.user.id} onChange={handleBeersChange} />)}
            </View>
            <Button mode='outlined' onPress={() => setConverterOpen(true)}>Beer calculator</Button>
            <Divider />
            <Paragraph style={{ fontStyle: 'italic' }}>
                {poem.poem}
            </Paragraph>
            <Paragraph style={{ fontWeight: 'bold' }}>
                {poem.author}
            </Paragraph>

        </Container>
    );
};
const Beer = () => <Ionicons name="beer-outline" size={24} color="black" style={{ paddingBottom: 5 }} />;
const SingleJuoppo = ({ sc, onChange, disabled }: { sc: Scorecard, onChange: (playerId: string, beers: string) => void, disabled: boolean }) => {
    const beerInput = useTextInput({
        numeric: true,
        defaultValue: sc.beers.toString() || '',
        callBackDelay: 1000,
    }, (value) => onChange(sc.user.id as string, value));
    const beerIcons = [];
    for (let i = 0; i < sc.beers; i++) {
        beerIcons.push(<Beer key={sc.user.id + 'beer' + i} />);
    }
    return (
        <View style={tyylit.inputWithBeers}>
            <TextInput
                label={sc.user.name}
                {...beerInput}
                autoComplete={false}
                mode='outlined'
                dense
                disabled={disabled}
                style={tyylit.input}
            />
            {beerIcons}
        </View>
    );
};

const tyylit = StyleSheet.create({
    inputWithBeers: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: 100,
        marginBottom: 10,
        marginRight: 10,
    },
    inputContainer: {
        marginVertical: 20,
    }
});
export default Beers;