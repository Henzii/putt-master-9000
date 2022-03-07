import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Paragraph, TextInput, Title } from "react-native-paper";
import Container from "../../components/ThemedComponents/Container";
import { Game, Scorecard } from '../../hooks/useGame';
import useTextInput from '../../hooks/useTextInput';
import { Ionicons } from '@expo/vector-icons';

const Beers = ({ data }: { data: Game }) => {
    const handleBeersChange = (playerId: string, beers: string) => {
        console.log('Change!', playerId, beers);
    };
    return (
        <Container>
            <Title>Beers</Title>
            <View style={tyylit.inputContainer}>
                {data.scorecards.map(sc => <SingleJuoppo sc={sc} key={sc.user.id} onChange={handleBeersChange} />)}
            </View>
            <Paragraph style={{ fontStyle: 'italic' }}>
                A statesman is an easy man, he tells his lies by rote.
                A journalist invents his lies, and rams them down your throat.
                So stay at home and drink your beer and let the neighbors vote.
            </Paragraph>
            <Paragraph style={{ fontWeight: 'bold' }}>
                From The Old Stone Cross, by William Butler Yeats (1865 – 1939)
            </Paragraph>

        </Container>
    );
};
const Beer = () => <Ionicons name="beer-outline" size={24} color="black" style={{ paddingBottom: 5 }} />;
const SingleJuoppo = ({ sc, onChange }: { sc: Scorecard, onChange: (playerId: string, beers: string) => void }) => {
    const [beerInput] = useTextInput({
        numeric: true,
        defaultValue: sc.beers.toString() || '',
        callBack: (value) => onChange(sc.user.id as string, value)
    });
    const beerIcons = [];
    for (let i=0;i<sc.beers;i++) {
        beerIcons.push(<Beer />);
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