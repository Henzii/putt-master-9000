import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Avatar, Button, Checkbox, IconButton, Text, useTheme } from 'react-native-paper';
import AddFriend from './AddFriend';
import ErrorScreen from './ErrorScreen';
import Loading from './Loading';
import SplitContainer from './ThemedComponents/SplitContainer';
import { InitialsAndColors, initialsAndColorGenerator } from '../utils/initialsAndColorGenerator';
import { User } from '../types/user';
import { useBackButton } from './BackButtonProvider';
import { theme } from '../utils/theme';
import Spacer from './ThemedComponents/Spacer';
import { useFriends } from '../hooks/useFriends';
import SignUp from './SignUp';
import Header from './RoundedHeader/Header';
import HeaderButton from './RoundedHeader/HeaderButton';
import Color from 'color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sheet from './Sheet';


type FriendListProps = {
    onClick?: (friends: Friend[]) => void,
    hideRemoveButton?: boolean,
    multiSelect?: boolean,
    onBackAction?: () => void
}
export type Friend = {
    id: number | string,
    name: string,
}
const FriendsList = (props: FriendListProps) => {
    const { friends, loading, error, removeFriend, addFriend } = useFriends();
    const [addFriendModal, setAddFriendModal] = useState(false);
    const [showCreateFriendView, setShowCreateFriendView] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
    const backButton = useBackButton();
    const [headerSpacing, setHeaderSpacing] = useState(50);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (props.onBackAction) {
            backButton.setCallBack(props.onBackAction);
            return () => backButton.setCallBack(undefined);
        }
    }, []);

    const handleFriendClick = (friend: Friend) => {
        if (!props.multiSelect) {
            if (props.onClick) {
                props.onClick([friend]);
            }
        }
        else if (!selectedFriends.find(f => f.id === friend.id)) {
            setSelectedFriends(selectedFriends.concat(friend));
        } else {
            setSelectedFriends(selectedFriends.filter(f => f.id !== friend.id));
        }
    };
    const handleOkClick = () => {
        if (props.onClick) props.onClick(selectedFriends);
    };

    if (error) {
        return <ErrorScreen errorMessage={error.message} />;
    }

    if (showCreateFriendView) {
        return (
            <SignUp onClose={() => setShowCreateFriendView(false)} isFriendSignUp />
        );
    }

    const initialsAndColors = initialsAndColorGenerator(friends);

    return (
        <View style={{ position: 'relative', flex: 1 }}>
            <Sheet open={addFriendModal} onClose={() => setAddFriendModal(false)}>
                <AddFriend onClose={() => setAddFriendModal(false)} onAddFriend={addFriend} friends={friends} />
            </Sheet>

            <Header bottomSize={20} setSpacing={setHeaderSpacing}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text variant="headlineSmall" style={tyyli.headline}>Friends</Text>
                    {selectedFriends.length > 0 && props.multiSelect && (
                        <Text style={{ color: 'white' }}>({selectedFriends.length} selected)</Text>)}
                </View>
                <Spacer size={10} />
                <SplitContainer spaceAround>
                    <HeaderButton icon="account-plus-outline" onPress={() => setAddFriendModal(true)}>Add friend</HeaderButton>
                    <HeaderButton icon="baby-face-outline" onPress={() => setShowCreateFriendView(true)}>Create friend</HeaderButton>
                </SplitContainer>

            </Header>
            {loading ? <Loading loadingText="Loading friends..." /> : (
                <FlatList
                    style={tyyli.lista}
                    contentContainerStyle={{ paddingTop: headerSpacing * 2 - 15, paddingBottom: headerSpacing * 2 }}
                    data={friends}
                    renderItem={({ item }) => (
                        <SingleFriend
                            onClick={handleFriendClick}
                            onDelete={removeFriend}
                            friend={item}
                            selected={selectedFriends.find(f => f.id === item.id) ? true : false}
                            showRemoveButton={!props.hideRemoveButton}
                            showCheckBox={props.multiSelect}
                            initialsAndColors={initialsAndColors}
                        />
                    )}
                />
            )}
            {props.multiSelect ?
                <Button
                    style={[tyyli.button, { bottom: insets.bottom }]}
                    mode="contained"
                    buttonColor={Color(theme.colors.primary).alpha(0.9).toString()}
                    onPress={handleOkClick}
                >
                    Add players to game
                </Button>
                : null}
        </View>
    );
};

type SingleFriendProps = {
    friend: User,
    onClick?: (friend: Friend) => void,
    onDelete?: (id: number | string, name?: string) => void,
    showRemoveButton?: boolean,
    showCheckBox?: boolean,
    selected?: boolean,
    initialsAndColors: InitialsAndColors
}
const SingleFriend = ({ friend, onClick, onDelete, showRemoveButton = true, showCheckBox = false, selected = false, initialsAndColors }: SingleFriendProps) => {
    const { colors } = useTheme();
    const handleFriendClick = () => {
        if (onClick) onClick(friend);
    };
    const handleDelete = () => {
        if (onDelete) onDelete(friend.id as string, friend.name);
    };
    const { label: avatarLabel, color: avatarColor } = initialsAndColors[friend.id];
    return (
        <Pressable onPress={handleFriendClick}>
            <View style={[tyyli.singleFriend, { backgroundColor: '#fff' }, (selected && tyyli.selectedBackground)]}>
                <View style={tyyli.singleFriendName}>
                    <Avatar.Text
                        label={avatarLabel}
                        size={40}
                        labelStyle={{ fontSize: avatarLabel.length > 1 ? 18 : 20 }}
                        style={{ backgroundColor: avatarColor }}
                    />
                    {/*<Avatar.Icon icon={selected ? 'account-tie' : 'account'} size={40} style={{backgroundColor: selected ? colors.surface : '#89ab9f'}} />*/}
                    <Text style={tyyli.singleFriendText}>{friend.name}</Text>
                </View>
                {showRemoveButton && <IconButton icon="trash-can-outline" iconColor='darkred' onPress={handleDelete} style={{ backgroundColor: colors.inverseOnSurface }} />}
                {showCheckBox && <Checkbox status={selected ? 'checked' : 'unchecked'} />}
            </View>
        </Pressable>
    );
};

const tyyli = StyleSheet.create({
    button: {
        position: 'absolute',
        zIndex: 2,
        bottom: 0,
        width: '90%',

        paddingVertical: 10,
        alignSelf: 'center',

    },
    header: {
        marginHorizontal: 20,
        marginVertical: 8
    },
    selectedBackground: {
        backgroundColor: theme.colors.tertiary,
        elevation: 4
    },
    singleFriendName: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    singleFriendText: {
        fontSize: 18,
        marginLeft: 8,
    },
    singleFriend: {
        borderWidth: 0,
        borderColor: 'lightgray',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 1,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 3,
    },
    separator: {
        minHeight: 1,
        borderTopWidth: 1,
        borderColor: 'lightgray',
    },
    lista: {
        backgroundColor: theme.colors.surface,
    },
    otsikko: {
        padding: 10,
        textAlign: 'center',
    },
    headline: {
        color: 'white',
    }
});
export default FriendsList;