import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { Button, Caption, Headline, IconButton, Switch, TextInput, Title } from "react-native-paper";
import Divider from './ThemedComponents/Divider';
import { Layout, NewLayout } from '../types/course';

const AddLayout = ({ onCancel, onAdd, layout }: AddLayoutProps) => {
    const [holes, setHoles] = useState<number | undefined>(layout?.holes);
    const [pars, setPars] = useState<number[]>(layout?.pars || []);
    const [names, setNames] = useState(layout?.names ?? []);
    const [name, setName] = useState(layout?.name || '');
    const [deprecated, setDeprecated] = useState(layout?.deprecated ?? false);

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
        if (rawPar === '') par = 0;
        if ((isNaN(par) || par < 0 || par > 20)) return;

        const parsCopy = [...pars];
        parsCopy[hole] = par;
        setPars(parsCopy);
    };
    const handleCancel = () => {
        if (onCancel) onCancel();
    };
    const handleNameChange = (hole: number, name: string) => {
        const namesCopy = [...names];
        namesCopy[hole] = name;
        setNames(namesCopy);
    };
    const handleAdd = () => {
        const newLayout: NewLayout = {
            name,
            pars,
            holes: holes || 0,
            names,
            deprecated

        };
        if (layout) newLayout.id = layout.id;
        if (onAdd) onAdd(newLayout);
    };

    const isEditMode = !!layout;

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 40, }} style={tyyli.main}>
            <Headline>{isEditMode ? 'Edit' : 'Add'} layout</Headline>
            <Caption>Layout name</Caption>
            <TextInput autoComplete='off' value={name} onChangeText={(value) => setName(value)} disabled={deprecated} />
            <Caption>Number of holes</Caption>
            <TextInput autoComplete='off' keyboardType='numeric' value={(holes || '') + ''} onChangeText={handleHolesChange} disabled={deprecated} />
            {isEditMode && (
                <View style={tyyli.deprecatedSwitch}>
                    <Switch value={deprecated} onChange={() => setDeprecated(value => !value)} />
                    <Text>Mark layout as obsolete</Text>
                </View>
            )}
            <Divider />
            <Title>Holes</Title>
            <HolesPars pars={pars} onParChange={handleParChange} onNameChange={handleNameChange} names={names} deprecated={deprecated} />
            <Text>
                {holes || 0} Holes, par {pars.reduce((p, c) => p + c, 0)}
            </Text>
            <View style={tyyli.buttonsContainer}>
                <Button onPress={handleAdd} icon="check"  mode='contained'>{layout ? 'Save' : 'Add'}</Button>
                <Button onPress={handleCancel} icon="cancel" mode='outlined'>Cancel</Button>
            </View>
        </ScrollView>
    );
};

type HoleParsProps = {
    onParChange: (hole: number, par: number | string) => void,
    pars: number[]
    onNameChange: (hole: number, name: string) => void,
    names: (string | null)[]
    deprecated: boolean
}

const HolesPars = ({ onParChange, pars, onNameChange, names, deprecated }: HoleParsProps) => {
    const returni = [];
    for (let i = 0; i < pars.length; i++) {
        if (pars[i] === undefined) continue;
        returni.push(
            <View key={`HolesParsKey${i}`} style={tyyli.singleHole}>
                <Text>Hole #{i + 1}</Text>
                <TextInput
                    value={names?.[i] || ''}
                    label="Name (optional)"
                    mode="outlined"
                    dense
                    style={{ marginLeft: 10 }}
                    onChangeText={(value) => onNameChange(i, value)}
                    disabled={deprecated}
                />
                <View style={tyyli.parInput}>
                    <TextInput
                        style={tyyli.singlePar}
                        onChangeText={(value) => onParChange(i, value)}
                        mode='outlined'
                        label="Par"
                        value={pars[i] > 0 ? pars[i] + '' : ''}
                        dense
                        autoComplete='off'
                        keyboardType='numeric'
                        disabled={deprecated}
                    />
                    <IconButton
                        style={tyyli.parInputButtons}
                        icon="minus"
                        iconColor="red"
                        onPress={() => {
                            if (pars[i] > 1) {
                                onParChange(i, pars[i] - 1);
                            }
                        }}
                        disabled={deprecated}
                    />
                    <IconButton
                        icon="plus"
                        style={tyyli.parInputButtons}
                        iconColor='green'
                        onPress={() => {
                            onParChange(i, pars[i] + 1);
                        }}
                        disabled={deprecated}
                    />
                </View>
                <Divider />
            </View>
        );
    }
    return (
        <View style={tyyli.parList}>
            {returni}
        </View>
    );
};

const tyyli = StyleSheet.create({
    deprecatedSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    singleHole: {
    },
    parInput: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    main: {
        backgroundColor: '#fafafa',
        height: '90%',
        width: '90%',
        padding: 30,
    },
    parInputButtons: {
        margin: 0,
    },
    singlePar: {
        width: 100,
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
    layout?: Layout,
}

export default AddLayout;