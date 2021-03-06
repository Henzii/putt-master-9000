import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from "react-native";
import { Button, Chip, Headline, Title, useTheme } from 'react-native-paper';
import { Course, Layout } from '../../hooks/useCourses';
import useMe, { User } from '../../hooks/useMe';
import FriendsList from '../../components/FriendsList';
import SelectCourses from '../../components/SelectCourse';
import Container from '../../components/ThemedComponents/Container';
import Loading from '../../components/Loading';

export type NewGameData = {
    course: Course | null,
    layout: Layout | null,
    players: Pick<User, 'name' | 'id'>[]
}
type CreateGameProps = {
    onCreate?: (data: NewGameData) => void,
    onCancel?: () => void,
    loading?: boolean,
}

const CreateGame = (props: CreateGameProps) => {
    const [newGameData, setNewGameData] = useState<NewGameData>({ course: null, layout: null, players: [] });

    const [selectCourse, setSelectCourse] = useState(false);
    const [addFriend, setAddFriend] = useState(false);
    const { colors } = useTheme();
    const me = useMe();

    useEffect(() => {   // Kirjautuneet tiedot playerlistiin mounttauksen yhteydessä
        if (me.me) {
            setNewGameData({
                ...newGameData,
                players: [{
                    id: me.me.id,
                    name: me.me.name
                }]
            });
        }
    }, [me.me]);
    if (me.error || !me.me) {
        return <Loading loadingText='Loading user...' />;
    }
    const handleSelectCourse = (layout: Layout, course: Course) => {
        setNewGameData({
            ...newGameData,
            course: course,
            layout: layout,
        });
        setSelectCourse(false);
    };
    const handleAddFriend = (friends: { name: string, id: string | number}[]) => {

        const filterDuplicates = (friends: { name: string, id: string | number}[]) => {
            return friends.filter(f => {
                return newGameData.players.find(p => p.id === f.id) ? false : true;
            });
        };
        // Jos pelaa ei ole listalla, lisätään se...
            setNewGameData({
                ...newGameData,
            players: newGameData.players.concat(filterDuplicates(friends))
            });
        setAddFriend(false);
    };
    const handleRemoveFriend = (id: string | number) => {
        const updatedGameData: NewGameData = {
            ...newGameData,
            players: newGameData.players.filter(p => p.id !== id)
        };
        setNewGameData(updatedGameData);
    };
    const handleCreate = () => {
        if (props.onCreate) props.onCreate(newGameData);
    };

    if (selectCourse) return <SelectCourses onSelect={handleSelectCourse} title="Select course" />;
    if (addFriend) return <FriendsList onClick={handleAddFriend} hideRemoveButton multiSelect />;

    // Luodaan tyyli, parametrinä teeman väritys
    const tyyli = createStyle(colors);

    return (
        <Container withScrollView noFlex fullHeight>
            <Headline>New Game</Headline>
            <Title style={tyyli.title}>Course</Title>
            <View style={tyyli.courseContainer}>
                <Text style={tyyli.courseText}>Course</Text>
                <Text style={tyyli.courseTextBig}>{newGameData.course?.name || '-'}</Text>
            </View>
            <View style={tyyli.courseContainer}>
                <Text style={tyyli.courseText}>Layout</Text>
                <Text style={tyyli.courseTextBig}>{newGameData.layout?.name || '-'}</Text>
            </View>
            <View style={tyyli.courseContainer}>
                <Text style={tyyli.courseText}>Holes</Text>
                <Text style={tyyli.courseText}>{newGameData.layout?.holes || '-'}</Text>
            </View>
            <View style={tyyli.courseContainer}>
                <Text style={tyyli.courseText}>Par</Text>
                <Text style={tyyli.courseText}>{newGameData.layout?.par || '-'}</Text>
            </View>
            <Button style={tyyli.button} onPress={() => setSelectCourse(true)} compact mode={newGameData.course ? 'outlined' : 'contained'}>
                {newGameData.course ? 'Change course' : 'Select course'}
            </Button>
            <Title style={tyyli.title}>Players</Title>
            <>
                {newGameData.players.map((player) => {
                    return <Chip
                                style={tyyli.chip}
                                key={player.id}
                                icon='account'
                                onClose={player.id !== me.me?.id ? () => handleRemoveFriend(player.id) : undefined}
                                textStyle={{ fontSize: 16 }}
                            >{player.name}</Chip>;
                })}
            </>
            <Button style={tyyli.button} compact mode='outlined' onPress={() => setAddFriend(true)}>Select players</Button>
            <View style={tyyli.bottomButtons}>
                <Button
                    color='green'
                    mode='contained'
                    onPress={handleCreate}
                    disabled={(!newGameData.course || !newGameData.layout || newGameData.players.length < 1 || props.loading)}
                    loading={props.loading}
                >
                    Create
                </Button>
                <Button color='red' mode='contained' onPress={props.onCancel}>Cancel</Button>
            </View>
        </Container>
    );
};

const createStyle = (colors?: ReactNativePaper.ThemeColors) => StyleSheet.create({
    chip: {
        display: 'flex',
        backgroundColor: colors?.surface,
        marginTop: 5,
        elevation: 2,
        fontSize: 20,
        maxWidth: '70%'
    },
    courseText: {
        width: '50%',
    },
    title: {
        marginVertical: 10,
    },
    courseTextBig: {
        width: '50%',
        fontSize: 16,
        fontWeight: 'bold',
    },
    courseContainer: {
        width: '70%',
        minWidth: 200,
        display: 'flex',
        flexDirection: 'row',
    },
    button: {
        maxWidth: 150,
        marginTop: 15,
        borderRadius: 8,
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
});

export default CreateGame;
