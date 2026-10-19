import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Avatar, Button, Checkbox, IconButton, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import AddFriend from './AddFriend';
import ErrorScreen from './ErrorScreen';
import Loading from './Loading';
import SplitContainer from './ThemedComponents/SplitContainer';
import { InitialsAndColors, initialsAndColorGenerator } from '../utils/initialsAndColorGenerator';
import { User } from '../types/user';
import { useBackButton } from './BackButtonProvider';
import Spacer from './ThemedComponents/Spacer';
import { useFriends } from '../hooks/useFriends';
import SignUp from './SignUp';
import Header from './RoundedHeader/Header';
import HeaderButton from './RoundedHeader/HeaderButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sheet from './Sheet';
import { useAuthenticatedUser } from 'src/context/AuthenticatedUserContext';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';


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
    const { t } = useTranslation();
    const { id: currentUserId } = useAuthenticatedUser();
    const { friends, loading, error, removeFriend, addFriend } = useFriends();
    const [addFriendModal, setAddFriendModal] = useState(false);
    const [showCreateFriendView, setShowCreateFriendView] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
    const backButton = useBackButton();
    const [headerSpacing, setHeaderSpacing] = useState(50);
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const styles = createStyles(colors);

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
                <AddFriend
                    onClose={() => setAddFriendModal(false)}
                    onAddFriend={addFriend}
                    friends={friends}
                    currentUserId={currentUserId}
                />
            </Sheet>

            <Header bottomSize={20} setSpacing={setHeaderSpacing}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text variant="headlineSmall" style={styles.headline}>{t('components.friendsList.title')}</Text>
                    {selectedFriends.length > 0 && props.multiSelect && (
                        <Text style={{ color: colors.onPrimary }}>{t('components.friendsList.selectedCount', { count: selectedFriends.length })}</Text>)}
                </View>
                <Spacer size={10} />
                <SplitContainer spaceAround>
                    <HeaderButton icon="account-plus-outline" onPress={() => setAddFriendModal(true)}>{t('components.friendsList.addFriend')}</HeaderButton>
                    <HeaderButton icon="baby-face-outline" onPress={() => setShowCreateFriendView(true)}>{t('components.friendsList.createFriend')}</HeaderButton>
                </SplitContainer>

            </Header>
            {loading ? <Loading loadingText={t('components.friendsList.loadingFriends')} /> : (
                <FlatList
                    style={styles.lista}
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
                    style={[styles.button, { bottom: insets.bottom }]}
                    mode="contained"
                    buttonColor={colors.primary}
                    onPress={handleOkClick}
                >
                    {t('components.friendsList.addPlayersToGame')}
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
    const styles = createStyles(colors);
    const handleFriendClick = () => {
        if (onClick) onClick(friend);
    };
    const handleDelete = () => {
        if (onDelete) onDelete(friend.id as string, friend.name);
    };
    const { label: avatarLabel, color: avatarColor } = initialsAndColors[friend.id];
    return (
        <Pressable onPress={handleFriendClick}>
            <View style={[styles.singleFriend, selected && styles.selectedBackground]}>
                <View style={styles.singleFriendName}>
                    <Avatar.Text
                        label={avatarLabel}
                        size={40}
                        labelStyle={{ fontSize: avatarLabel.length > 1 ? 18 : 20 }}
                        style={{ backgroundColor: avatarColor }}
                    />
                    <Text style={styles.singleFriendText}>{friend.name}</Text>
                </View>
                {showRemoveButton && <IconButton icon="trash-can-outline" iconColor={colors.error} onPress={handleDelete} style={{ backgroundColor: colors.surfaceVariant }} />}
                {showCheckBox && <Checkbox status={selected ? 'checked' : 'unchecked'} />}
            </View>
        </Pressable>
    );
};

const createStyles = (colors: MD3Colors) => StyleSheet.create({
    button: {
        position: 'absolute',
        zIndex: 2,
        bottom: 0,
        width: '90%',

        paddingVertical: 10,
        alignSelf: 'center',

    },
    selectedBackground: {
        backgroundColor: colors.tertiaryContainer,
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
        color: colors.onSurface,
    },
    singleFriend: {
        borderWidth: 1,
        borderColor: colors.outlineVariant,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 1,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 3,
        backgroundColor: colors.surface,
    },
    separator: {
        minHeight: 1,
        borderTopWidth: 1,
        borderColor: colors.outlineVariant,
    },
    lista: {
        backgroundColor: colors.surface,
    },
    headline: {
        color: colors.onPrimary,
    }
});
export default FriendsList;