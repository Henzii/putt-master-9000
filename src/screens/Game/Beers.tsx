import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Paragraph, TextInput, Title } from "react-native-paper";
import Container from "../../components/ThemedComponents/Container";
import { Game, Scorecard } from '../../hooks/useGame';
import useTextInput from '../../hooks/useTextInput';
import { Ionicons } from '@expo/vector-icons';
import beerPoems from '../../utils/beerPoems.json';
const Beers = ({ data, setBeers }: { data: Game, setBeers: (playerId: string, beers: number) => void }) => {

    const handleBeersChange = (playerId: string, beers: string) => {
        const beersInt = Number.parseInt(beers);
        setBeers(playerId, beersInt);
    };
    const randomi = Math.floor( Math.random() * beerPoems.poems.length);
    const poem = beerPoems.poems[randomi].text;
    const author = beerPoems.poems[randomi].author;
    return (
        <Container withScrollView>
            <Title>Beers</Title>
            <View style={tyylit.inputContainer}>
                {data.scorecards.map(sc => <SingleJuoppo sc={sc} key={sc.user.id} onChange={handleBeersChange} />)}
            </View>
            <Paragraph style={{ fontStyle: 'italic' }}>
                {poem}
            </Paragraph>
            <Paragraph style={{ fontWeight: 'bold' }}>
                {author}
            </Paragraph>

        </Container>
    );
};
const Beer = () => <Ionicons name="beer-outline" size={24} color="black" style={{ paddingBottom: 5 }} />;
const SingleJuoppo = ({ sc, onChange }: { sc: Scorecard, onChange: (playerId: string, beers: string) => void }) => {
    const beerInput = useTextInput({
        numeric: true,
        defaultValue: sc.beers.toString() || '',
        callBackDelay: 1000,
    }, (value) => onChange(sc.user.id as string, value));
    const beerIcons = [];
    for (let i=0;i<sc.beers;i++) {
        beerIcons.push(<Beer key={sc.user.id+'beer'+i} />);
    }
    return (
        <View style={tyylit.inputWithBeers}>
            <TextInput
                label={sc.user.name}
                {...beerInput}
                autoComplete={false}
                mode='outlined'
                dense
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