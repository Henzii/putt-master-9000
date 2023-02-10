import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Button, Chip, Headline, Title, useTheme } from 'react-native-paper';
import { Course, Layout } from '../../hooks/useCourses';
import useMe, { User } from '../../hooks/useMe';
import FriendsList from '../../components/FriendsList';
import SelectCourses from '../../components/SelectCourse';
import Container from '../../components/ThemedComponents/Container';
import Loading from '../../components/Loading';
import { useBackButton } from '../../components/BackButtonProvider';
import NumberedTitle from '../../components/NumberedTitle';
import Divider from '../../components/ThemedComponents/Divider';
import Spacer from '../../components/ThemedComponents/Spacer';
import useStats from '../../hooks/useStats';

export type NewGameData = {
    course?: Course | null,
    layout?: Layout,
    players: Pick<User, 'name' | 'id'>[]
}
type CreateGameProps = {
    onCreate?: (data: NewGameData) => void,
    onCancel?: () => void,
    loading?: boolean,
}

const CreateGame = (props: CreateGameProps) => {
    const [newGameData, setNewGameData] = useState<NewGameData>({ course: undefined, layout: undefined, players: [] });

    const [selectCourse, setSelectCourse] = useState(false);
    const [addFriend, setAddFriend] = useState(false);
    const { colors } = useTheme();
    const me = useMe();
    const backButton = useBackButton();
    const {getHc, getBest, loading} = useStats(
        (newGameData.layout?.id as string | undefined),
        (newGameData.players.map(player => player.id) as string[]),
        'network-only',
        newGameData.players,
    );
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
            players: newGameData.players.concat(filterDuplicates(friends)),
            layout: newGameData.layout ? {...newGameData.layout} : undefined
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
    const handleShowFriendsList = () => {
        backButton.setCallBack(() => setAddFriend(false));
        setAddFriend(true);
    };
    const handleSetSelectCourse = () => {
        backButton.setCallBack(() => setSelectCourse(false));
        setSelectCourse(true);
    };
    if (selectCourse) return <SelectCourses onSelect={handleSelectCourse} title="Select course" />;
    if (addFriend) return <FriendsList onClick={handleAddFriend} hideRemoveButton multiSelect />;

    // Luodaan tyyli, parametrinä teeman väritys
    const tyyli = createStyle(colors);
    const {course, layout} = newGameData;
    return (
        <Container withScrollView noFlex fullHeight>
            <Headline>New Game</Headline>
            <Spacer size={10} />
            <NumberedTitle number='1' title={course ? `${course.name} / ${layout?.name}` : 'Select course'} />
            <Spacer size={10} />
            {course ? (
                <>
                    <View style={tyyli.courseContainer}>
                        <Text style={tyyli.courseText}>Holes</Text>
                        <Text style={tyyli.courseText}>{newGameData.layout?.holes || '-'}</Text>
                    </View>
                    <View style={tyyli.courseContainer}>
                        <Text style={tyyli.courseText}>Par</Text>
                        <Text style={tyyli.courseText}>{newGameData.layout?.par || '-'}</Text>
                    </View>
                    <Spacer />
                    <View style={tyyli.courseContainer}>
                        <Text style={tyyli.parsText}>{layout?.pars.join(', ')}</Text>
                    </View>
                    <Spacer size={10} />
                </>
            ) : null}
            <Button style={tyyli.button} onPress={handleSetSelectCourse} mode={newGameData.course ? 'outlined' : 'contained'}>
                {newGameData.course ? 'Change course' : 'Select course'}
            </Button>
            <Divider margin={30} />

            <NumberedTitle number='2' title='Select Players' />
            <Spacer />
            <View style={tableStyle.playersTable}>
                <Text style={tableStyle.headerName}>Name</Text>
                <Text style={tableStyle.headerRest}>Best</Text>
                <Text style={tableStyle.headerRest}>HC</Text>
                <Text style={{flex: 1}}></Text>
            </View>
            <>
                {newGameData.players.map((player, index) => {
                    const best = getBest(player.id);
                    return <TableItem
                        key={player.id}
                        name={player.name}
                        hc={loading ? '...' : getHc(player.id) ?? ''}
                        best={layout?.par && best ? best - layout.par : ''}
                        even={index % 2 === 0}
                        onRemove={player.id !== me?.me?.id ? () => handleRemoveFriend(player.id) : null}
                    />;
                })}
            </>
            <Spacer />
            <Button style={tyyli.button} compact mode={newGameData.players.length > 1 ? 'outlined' : 'contained'} onPress={handleShowFriendsList}>Add players</Button>
            <Divider margin={30} />
            <NumberedTitle number='3' title="Create game" />
            <Spacer />
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
const TableItem = ({name, best, hc, even, onRemove}: {even: boolean, name: string, best: number | string, hc: number | string, onRemove: (() => void) | null}) => {
    return (
        <View style={[tableStyle.playersTable, even && tableStyle.background]}>
                <Text style={tableStyle.listName}>{name}</Text>
                <Text style={tableStyle.listRest}>{best}</Text>
                <Text style={tableStyle.listRest}>{hc}</Text>
                <Pressable onPress={onRemove} style={{flex: 1}}>
                    <Text>X</Text>
                </Pressable>
        </View>
    );
};

const tableStyle = StyleSheet.create({
    background: {
        backgroundColor: '#f5f5f5'
    },
    playersTable: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        padding: 8,
    },
    headerName: {
        flex: 5,
        fontSize: 18,
        fontWeight: '600',
    },
    headerRest: {
        flex: 2,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    listName: {
        flex: 5,
        fontSize: 16,
    },
    listRest: {
        flex: 2,
        fontSize: 16,
        textAlign: 'center',
    }
});
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
        fontSize: 18,
    },
    parsText: {
        color: 'gray',
        fontSize: 16,
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
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 38,
    },
    button: {
        width: '80%',
        alignSelf: 'center',
    },
    bottomButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    }
});

export default CreateGame;
