import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import SelectButton from './SelectButton';

export default function Player({ name }: PlayerArgs) {
    const [selected, setSelected] = useState<number | null>(null)
    return (
        <Card style={tyyli.main}>
            <Card.Title
                title={name}
            />
            <Card.Content style={tyyli.content}>
                <View style={tyyli.contentLeft}>
                    <Tulosnapit name={name} selected={selected} setSelected={setSelected} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text>Jotain</Text>
                </View>
            </Card.Content>
        </Card>

    )

}
const Tulosnapit = ({ name, selected, setSelected }: { name: string, selected: number | null, setSelected: (i: number) => void }) => {
    const ret = [];
    for (let i = -1; i < 4; i++) ret.push(
        <SelectButton selected={(i === selected)}
            key={name.concat(i.toString())}
            width="10vw"
            onClick={() => setSelected(i)}
            text={i + ''}
        />)

    return <>{ret}</>
}
type PlayerArgs = {
    name: string
}

const tyyli = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    contentLeft: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '70%'
    },
    main: {
        minHeight: 120,
        width: '100vw',
        shadowRadius: 3,
        marginBottom: 1,
        padding: 10,
    }
})
