import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { Button, Caption, Divider, Headline, TextInput, Title } from "react-native-paper";
import { Layout, NewLayout } from '../hooks/useCourses';

const AddLayout = ({ onCancel, onAdd }: AddLayoutProps) => {
    const [holes, setHoles] = useState<number>();
    const [pars, setPars] = useState<number[]>([]);
    const [name, setName] = useState('');

    const handleHolesChange = (value: string) => {
        const holesInt = Number.parseInt(value);
        if (!isNaN(holesInt) && holesInt > 0 && holesInt <= 100) { // Jos arvosta saadaan numero
            setHoles(holesInt);
            setPars(Array(holesInt).fill(3));
        } else if (value === '') {  // Jos tyhjä arvo, paltaan alkuasetelmaan
            setHoles(undefined);
            setPars([]);
        }
    };
    const handleParChange = (hole: number, rawPar: number | string) => {
        let par = rawPar;
        if (typeof par === 'string') {
            par = Number.parseInt(par);
        }
        if (isNaN(par) || par < 0 || par > 20) return;

        const parsCopy = [...pars];
        parsCopy[hole] = par;
        setPars(parsCopy);
    };
    const handleCancel = () => {
        if (onCancel) onCancel();
    };
    const handleAdd = () => {
        const newLayout: NewLayout = {
            name,
            pars,
            holes: holes || 0,
        };
        if (onAdd) onAdd(newLayout);
    };
    return (
        <ScrollView style={tyyli.main} contentContainerStyle={{ paddingBottom: 20, }}>
            <Headline>Add layout</Headline>
            <Caption>Layout name</Caption>
            <TextInput autoComplete={false} value={name} onChangeText={(value) => setName(value)}/>
            <Caption>Number of holes</Caption>
            <TextInput autoComplete={false} keyboardType='numeric' value={(holes || '') + ''} onChangeText={handleHolesChange} />
            <Divider />
            <Title>Pars</Title>
            <HolesPars pars={pars} onParChange={handleParChange}/>
            <Text>
                {holes || 0} Holes, par {pars.reduce((p,c) => p+c,0)}
            </Text>
            <View style={tyyli.buttonsContainer}>
                <Button onPress={handleAdd} icon="check" color='green' mode='contained'>Add</Button>
                <Button onPress={handleCancel} icon="cancel" color='red' mode='contained'>Cancel</Button>
            </View>
        </ScrollView>
    );
};

const HolesPars = ({ onParChange, pars }: { pars: number[], onParChange: (hole: number, par: number | string) => void }) => {
    const returni = [];
    for (let i = 0; i < pars.length; i++) {
        if (!pars[i]) continue;
        returni.push(<TextInput
            key={`HolesParsKey${i}`}
            style={tyyli.singlePar}
            onChangeText={(value) => onParChange(i, value)}
            mode='outlined'
            label={`Hole ${i+1}`}
            value={pars[i]+''}
            dense
            autoComplete={false}
            keyboardType='numeric'
        />);
    }
    return (
        <View style={tyyli.parList}>
            {returni}
        </View>
    );
};

const tyyli = StyleSheet.create({
    main: {
        backgroundColor: '#fff',
        height: '90%',
        width: '90%',
        padding: 20,
    },
    singlePar: {
        maxWidth: 100,
        margin: 10,
    },
    parList: {
        marginBottom: 10,
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 15,
    }
});
type AddLayoutProps = {
    onCancel?: () => void,
    onAdd?: (layout: NewLayout) => void,
}

export default AddLayout;