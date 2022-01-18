import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text } from "react-native"
import { Button, Caption, Divider, Headline, TextInput, Title } from "react-native-paper"
import { Layout } from '../hooks/useCourses';

const AddLayout = ({ onCancel, onAdd }: AddLayoutProps) => {
    const [holes, setHoles] = useState<number | null>(null)
    const [pars, setPars] = useState<number[]>([])
    const [name, setName] = useState('')

    const handleHolesChange = (value: string) => {
        const holesInt = Number.parseInt(value);
        if (!isNaN(holesInt)) {
            setHoles(holesInt)
            setPars(Array(holesInt).fill(3))
        }
    }
    const handleParChange = (hole: number, rawPar: number | string) => {
        let par = rawPar;
        if (typeof par === 'string') {
            par = Number.parseInt(par)
        }
        if (isNaN(par)) return;
        
        const parsCopy = [...pars]
        parsCopy[(hole-1)] = par;
        setPars(parsCopy)
    }
    console.log(pars)
    const handleCancel = () => {
        if (onCancel) onCancel()
    }
    const handleAdd = () => {
        const newLayout: Omit<Layout, 'id'> = {
            name,
            pars,
            par: pars.reduce((p,c) => p+c, 0),
            holes: holes || 0,
        }
        if (onAdd) onAdd(newLayout)
    }
    return (
        <ScrollView style={tyyli.main} contentContainerStyle={{ paddingBottom: 50, }}>
            <Headline>Add layout</Headline>
            <Caption>Layout name</Caption>
            <TextInput autoComplete={false} value={name} onChangeText={(value) => setName(value)}/>
            <Caption>Number of holes</Caption>
            <TextInput autoComplete={false} keyboardType='numeric' onChangeText={handleHolesChange} />
            <Divider />
            <Title>Pars</Title>
            <HolesPars holes={holes} onParChange={handleParChange}/>
            <Text>
                {holes || 0} Holes, par {pars.reduce((p,c) => p+c,0)}
            </Text>
            <View style={tyyli.buttonsContainer}>
                <Button onPress={handleAdd}>Add</Button>
                <Button onPress={handleCancel}>Cancel</Button>
            </View>
        </ScrollView>
    )
}

const HolesPars = ({ holes, onParChange }: { holes: number | null, onParChange: (hole: number, par: number | string) => void }) => {
    if (!holes) return null;
    const returni = []
    for (let i = 1; i <= holes; i++) {
        returni.push(<TextInput
            style={tyyli.singlePar}
            onChangeText={(value) => onParChange(i, value)}
            mode='outlined'
            label={`Hole ${i}`}
            defaultValue='3'
            dense
            autoComplete={false}
            keyboardType='numeric'
        />)
    }
    return (
        <View style={tyyli.parList}>
            {returni}
        </View>
    )
}

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
        justifyContent: 'space-evenly'
    }
})
type AddLayoutProps = {
    onCancel?: () => void,
    onAdd?: (layout: Omit<Layout, "id">) => void,
}

export default AddLayout;