import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Text, ViewStyle, StyleProp } from "react-native";
import { Button, Headline, IconButton, Switch, TextInput } from 'react-native-paper';
import FriendsList from '../../components/FriendsList';
import SelectCourses from '../../components/SelectCourse/SelectCourse';
import Container from '../../components/ThemedComponents/Container';
import NumberedTitle from '../../components/NumberedTitle';
import Divider from '../../components/ThemedComponents/Divider';
import Spacer from '../../components/ThemedComponents/Spacer';
import useStats from '../../hooks/useStats';
import { Course, Layout } from '../../types/course';
import { User } from '../../types/user';
import ErrorScreen from '../../components/ErrorScreen';
import SplitContainer from '../../components/ThemedComponents/SplitContainer';
import { useSelector } from 'react-redux';
import { RootState } from '../../utils/store';
import InfoDialog from '../../components/InfoDialog';

export type NewGameData = {
    course?: Course | null,
    layout?: Layout,
    players: Pick<User, 'name' | 'id'>[]
    isCompetition?: boolean,
    bHcMultiplier?: string
}
type CreateGameProps = {
    onCreate?: (data: NewGameData) => void,
    onCancel?: () => void,
    loading?: boolean,
}

const CreateGame = (props: CreateGameProps) => {
    const { t } = useTranslation();
    const [newGameData, setNewGameData] = useState<NewGameData>({ course: undefined, layout: undefined, players: [] });
    const user = useSelector((state: RootState) => state.user);
    const [selectCourse, setSelectCourse] = useState(false);
    const [addFriend, setAddFriend] = useState(false);
    const { getHc, getBest, getField, loading } = useStats(
        (newGameData.layout?.id as string | undefined),
        (newGameData.players.map(player => player.id) as string[]),
        'network-only',
        newGameData.players,
    );
    useEffect(() => {   // Kirjautuneet tiedot playerlistiin mounttauksen yhteydessä
        if (user.isLoggedIn) {
            setNewGameData({
                ...newGameData,
                players: [{
                    id: user.id,
                    name: user.name
                }]
            });
        }
    }, [user]);

    const handleEditGameData = (data: Partial<NewGameData>) => {
        setNewGameData(old => ({
            ...old,
            ...data
        }));
    };

    const handleSelectCourse = (layout: Layout, course: Course) => {
        setNewGameData({
            ...newGameData,
            course: course,
            layout: layout,
        });
        setSelectCourse(false);
    };
    const handleAddFriend = (friends: { name: string, id: string | number }[]) => {

        const filterDuplicates = (friends: { name: string, id: string | number }[]) => {
            return friends.filter(f => {
                return newGameData.players.find(p => p.id === f.id) ? false : true;
            });
        };
        // Jos pelaa ei ole listalla, lisätään se...
        setNewGameData({
            ...newGameData,
            players: newGameData.players.concat(filterDuplicates(friends)),
            layout: newGameData.layout ? { ...newGameData.layout } : undefined
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
        setAddFriend(true);
    };
    const handleSetSelectCourse = () => {
        setSelectCourse(true);
    };

    if (!user.isLoggedIn) {
        return <ErrorScreen errorMessage={t('screens.game.notLoggedIn')} />;
    }

    if (selectCourse) return <SelectCourses onSelect={handleSelectCourse} title={t('screens.game.selectCourse')} onBackAction={() => setSelectCourse(false)} showTraffic={false} />;
    if (addFriend) return <FriendsList onClick={handleAddFriend} hideRemoveButton multiSelect onBackAction={() => setAddFriend(false)} />;

    const tyyli = createStyle();
    const { course, layout } = newGameData;
    return (
        <Container withScrollView noFlex fullHeight>
            <Headline>{t('screens.game.newGame')}</Headline>
            <Spacer size={10} />
            <NumberedTitle number='1' title={course ? `${course.name} / ${layout?.name}` : t('screens.game.selectCourse')} />
            <Spacer size={10} />
            {course ? (
                <>
                    <View style={tyyli.courseContainer}>
                        <Text style={tyyli.courseText}>{t('common.holes')}</Text>
                        <Text style={tyyli.courseText}>{newGameData.layout?.holes || '-'}</Text>
                    </View>
                    <View style={tyyli.courseContainer}>
                        <Text style={tyyli.courseText}>{t('common.par')}</Text>
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
                {newGameData.course ? t('screens.game.changeCourse') : t('screens.game.selectCourse')}
            </Button>
            <Divider margin={30} />

            <NumberedTitle number='2' title={t('screens.game.selectPlayers')} />
            <Spacer />
            <View style={tableStyle.table}>
                <Text style={tableStyle.headerName}>{t('screens.game.tableHeaderName')}</Text>
                <Text style={tableStyle.headerRest}>{t('screens.game.tableHeaderGames')}</Text>
                <Text style={tableStyle.headerRest}>{t('screens.game.tableHeaderBest')}</Text>
                <Text style={tableStyle.headerRest}>{t('screens.game.tableHeaderHc')}</Text>
                <Text style={{ flex: 1.2 }}></Text>
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
                        onRemove={player.id !== user.id ? () => handleRemoveFriend(player.id) : null}
                        additionalStyle={tableStyle.playersTable}
                    />;
                })}
            </>
            <Spacer />
            <Button style={tyyli.button} compact mode={newGameData.players.length > 1 ? 'outlined' : 'contained'} onPress={handleShowFriendsList}>{t('screens.game.addPlayers')}</Button>
            <Divider />
            <NumberedTitle number="3" title={t('screens.game.gameSettings')} accordion>
                <View>
                    {!user.groupName && (<Text style={tyyli.errorText}>{t('screens.game.groupCompetitionDisabled')}</Text>)}
                    <SplitContainer>
                        <View style={tyyli.infoText}>
                            <Text>{t('screens.game.isGroupCompetition')}</Text>
                            <InfoDialog>
                                <Text>
                                    {t('screens.game.groupCompetitionInfo', { groupName: user.groupName ? ` ${user.groupName}` : '' })}
                                </Text>
                                <Text>
                                    {t('screens.game.groupJoinInfo')}
                                </Text>
                            </InfoDialog>
                        </View>
                        <Switch
                            disabled={!user.groupName}
                            value={newGameData.isCompetition}
                            onChange={() => handleEditGameData({ isCompetition: !newGameData.isCompetition })}
                        />
                    </SplitContainer>
                    <SplitContainer>
                        <View style={tyyli.infoText}>
                            <Text>{t('screens.game.bHcMultiplier')}</Text>
                            <InfoDialog>
                                <Text>
                                    {t('screens.game.bHcMultiplierInfo')}
                                </Text>
                                <Text>
                                    {t('screens.game.bHcMultiplierCalc')}
                                </Text>
                            </InfoDialog>
                        </View>
                        <TextInput
                            keyboardType="number-pad"
                            mode="outlined"
                            value={newGameData.bHcMultiplier}
                            onChangeText={value => handleEditGameData({ bHcMultiplier: value })}
                        />
                    </SplitContainer>
                </View>
            </NumberedTitle>
            <Divider />
            <NumberedTitle number='4' title={t('screens.game.createGame')} />
            <Spacer />
            <View style={tyyli.bottomButtons}>
                <Button
                    mode='contained'
                    onPress={handleCreate}
                    disabled={(!newGameData.course || !newGameData.layout || newGameData.players.length < 1 || props.loading || (newGameData.bHcMultiplier !== undefined && isNaN(Number(newGameData.bHcMultiplier))))}
                    loading={props.loading}
                >
                    {t('common.create')}
                </Button>
                <Button mode='outlined' onPress={props.onCancel}>{t('common.cancel')}</Button>
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

const TableItem = ({ name, games, best, hc, even, onRemove, additionalStyle }: TableItemProps) => {
    return (
        <View style={[tableStyle.table, additionalStyle, even && tableStyle.background]}>
            <Text style={tableStyle.listName}>{name}</Text>
            <Text style={tableStyle.listRest}>{games}</Text>
            <Text style={tableStyle.listRest}>{best}</Text>
            <Text style={tableStyle.listRest}>{hc}</Text>
            <IconButton icon="trash-can" iconColor="red" size={15} onPress={onRemove ? onRemove : undefined} style={{ margin: 0, padding: 0, marginRight: 12, }} disabled={!onRemove} />
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
    errorText: {
        color: 'darkred'
    },
    infoText: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        gap: 0
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
