import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ViewStyle, StyleProp } from "react-native";
import { Button, Headline, IconButton} from 'react-native-paper';
import useMe from '../../hooks/useMe';
import FriendsList from '../../components/FriendsList';
import SelectCourses from '../../components/SelectCourse/SelectCourse';
import Container from '../../components/ThemedComponents/Container';
import Loading from '../../components/Loading';
import { useBackButton } from '../../components/BackButtonProvider';
import NumberedTitle from '../../components/NumberedTitle';
import Divider from '../../components/ThemedComponents/Divider';
import Spacer from '../../components/ThemedComponents/Spacer';
import useStats from '../../hooks/useStats';
import { Course, Layout } from '../../types/course';
import { User } from '../../types/user';

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
    const me = useMe();
    const backButton = useBackButton();
    const {getHc, getBest, getField, loading} = useStats(
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

    const tyyli = createStyle();
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
            <View style={tableStyle.table}>
                <Text style={tableStyle.headerName}>Name</Text>
                <Text style={tableStyle.headerRest}>Games</Text>
                <Text style={tableStyle.headerRest}>Best</Text>
                <Text style={tableStyle.headerRest}>HC</Text>
                <Text style={{flex: 1.2}}></Text>
            </View>
            <>
                {newGameData.players.map((player, index) => {
                    const best = getBest(player.id);
                    return <TableItem
                        key={player.id}
                        name={player.name}
                        hc={loading ? '...' : getHc(player.id) ?? ''}
                        games={getField(player.id, 'games') as number}
                        best={layout?.par && best ? best - layout.par : ''}
                        even={index % 2 === 0}
                        onRemove={player.id !== me?.me?.id ? () => handleRemoveFriend(player.id) : null}
                        additionalStyle={tableStyle.playersTable}
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

type TableItemProps = {
    name: string,
    even: boolean,
    games: number,
    best: number | string,
    hc: number | string,
    additionalStyle?: StyleProp<ViewStyle>
    onRemove: (() => void) | null
}

const TableItem = ({name, games, best, hc, even, onRemove, additionalStyle}: TableItemProps) => {
    return (
        <View style={[tableStyle.table, additionalStyle, even && tableStyle.background]}>
                <Text style={tableStyle.listName}>{name}</Text>
                <Text style={tableStyle.listRest}>{games}</Text>
                <Text style={tableStyle.listRest}>{best}</Text>
                <Text style={tableStyle.listRest}>{hc}</Text>
                <IconButton icon="trash-can" color="red" size={15} onPress={onRemove ? onRemove : undefined} style={{margin: 0, padding: 0, marginRight: 12,}} disabled={!onRemove} />
        </View>
    );
};

const tableStyle = StyleSheet.create({
    background: {
        backgroundColor: '#f5f5f5'
    },
    playersTable: {
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 10,
        elevation: 4,
        backgroundColor: '#f0f0f0',
        minHeight: 30,
        alignItems: 'center',
    },
    table: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        padding: 8,
        paddingRight: 0,
    },
    headerName: {
        flex: 5,
        fontSize: 14,
        fontWeight: '600',
    },
    headerRest: {
        flex: 2,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    listName: {
        flex: 5,
        fontSize: 15,
    },
    listRest: {
        flex: 2,
        fontSize: 13,
        textAlign: 'center',
    }
});
const createStyle = () => StyleSheet.create({
    courseText: {
        width: '50%',
        fontSize: 16,
    },
    parsText: {
        color: 'gray',
        fontSize: 14,
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
