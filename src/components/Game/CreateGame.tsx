import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from "react-native"
import { Button, Caption, Divider, Subheading, Title } from 'react-native-paper';
import { Course, Layout } from '../../hooks/useCourses';
import useMe, { User } from '../../hooks/useMe';
import FriendsList from '../FriendsList';
import SelectCourses from '../SelectCourse';

export type NewGameData = {
    course: Course | null,
    layout: Layout | null,
    players: Pick<User, 'name' | 'id'>[]
}
type CreateGameProps = {
    onCreate?: (data: NewGameData) => void,
    onCancel?: () => void,
}

const CreateGame = (props: CreateGameProps) => {
    const [newGameData, setNewGameData] = useState<NewGameData>({ course: null, layout: null, players: [] });

    const [selectCourse, setSelectCourse] = useState(false);
    const [addFriend, setAddFriend] = useState(false);
    const me = useMe();

    useEffect(() => {   // Kirjautuneet tiedot playerlistiin mounttauksen yhteydessä
        if (me.me) {
            setNewGameData({
                ...newGameData,
                players: [{
                    id: me.me.id,
                    name: me.me.name
                }]
            })
        }
    }, [me.me])

    const handleSelectCourse = (layout: Layout, course: Course) => {
        setNewGameData({
            ...newGameData,
            course: course,
            layout: layout,
        })
        setSelectCourse(false)
    }
    const handleAddFriend = (id: string | number, name?: string) => {

        // Jos pelaa ei ole listalla, lisätään se...
        if (!newGameData.players.find(p => p.id === id)) {
            setNewGameData({
                ...newGameData,
                players: newGameData.players.concat({ id, name: name || 'unknown' })
            })
        }
        setAddFriend(false);
    }
    const handleCreate = () => {
        if (props.onCreate) props.onCreate(newGameData)
    }

    if (selectCourse) return <SelectCourses onSelect={handleSelectCourse} />
    if (addFriend) return <FriendsList onClick={handleAddFriend} />
    
    return (
        <View style={tyyli.main}>
            <Title style={tyyli.title}>Create game</Title>
            <Subheading>Selected course</Subheading>
            <View style={tyyli.selectCourse}>
                <Text>{newGameData?.course?.name || 'N'} / {newGameData?.layout?.name || 'A'}</Text>
                <Button onPress={() => setSelectCourse(true)}>Select</Button>
            </View>
            <Subheading>Select players</Subheading>
            <View style={tyyli.selectPlayers}>
                {newGameData.players.map((p, i) =>
                    <Text key={p.id} style={[tyyli.player, (i%2!==0 ? tyyli.even : null)]}>{p.name}</Text>
                )}
            </View>
                <Button onPress={() => setAddFriend(true)}>Add player</Button>
            <View style={tyyli.bottomButtons}>
                <Button color='green' mode='contained' onPress={handleCreate}>Create</Button>
                <Button color='red' mode='contained' onPress={props.onCancel}>Cancel</Button>
            </View>
        </View>
    )
}

const tyyli = StyleSheet.create({
    main: {
        width: '100%',
        padding: 20,
    },
    selectCourse: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        padding: 10,
        borderColor: 'lightgray',
        marginBottom: 20,
        borderRadius: 5,
    },
    title: {
        marginBottom: 15,
        fontSize: 25,
    },
    selectPlayers: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'lightgray',
        marginBottom: 20,
    },
    player: {
        width: '100%',
        fontSize: 15,
        padding: 10,
    },
    even: {
        backgroundColor: '#fafafa'
    },
    bottomButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'lightgray',
    }
})

export default CreateGame;