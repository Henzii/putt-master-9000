import React from 'react';
import { View, StyleSheet, ScrollView } from "react-native";
import { ActivityIndicator, IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SEARCH_USER } from '../graphql/queries';
import useTextInput from '../hooks/useTextInput';
import { useLazyQuery } from '@apollo/client';
import { SafeUser } from '../types/user';
import Stack from './Stack';
import Spacer from './ThemedComponents/Spacer';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useSession } from '@hooks/useSession';

type AddFriendProps = {
    onClose?: () => void,
    onAddFriend: (friendName: string) => void,
    friends: SafeUser[]
}

type QueryResponse = {
    searchUser: {
        users: SafeUser[]
    }
}

const AddFriend = ({ onClose, onAddFriend, friends }: AddFriendProps) => {
    const { t } = useTranslation();
    const [searchUsers, { data, loading }] = useLazyQuery<QueryResponse>(SEARCH_USER);
    const { colors } = useTheme();
    const { id } = useSession();
    const searchTextInput = useTextInput({ callBackDelay: 1000, defaultValue: '' }, (value) => {
        searchUsers({ variables: { search: value.toLowerCase() } });
    });

    const tyyli = createStyles(colors);

    const handleAddFriend = (name: string) => {
        if (!name.trim()) {
            return;
        }
        onAddFriend(name);
        if (onClose) onClose();
    };

    const users = data?.searchUser?.users.slice(0, 50) ?? [];
    return (
        <View style={tyyli.container}>
            <Stack direction="row" justifyContent="space-between" alignItems='center'>
                <Text variant="headlineSmall">{t('components.addFriend.title')}</Text>
                <IconButton icon="close" onPress={onClose} />
            </Stack>
            <Text variant="titleSmall">{t('components.addFriend.searchHint')}</Text>
            <TextInput
                autoComplete='off'
                {...searchTextInput}
                mode='outlined'
                label={t('components.addFriend.nameLabel')}
            />
            {loading ? <ActivityIndicator /> : users.length > 0 && <Text>{t('components.addFriend.usersFound', { count: users.length })}</Text>}
            <Spacer />
            <ScrollView>
                <Stack gap={8}>
                    {users?.map(user => {
                        const isFriend = friends.some(f => f.id === user.id);
                        const disabled = user.blockFriendRequests || isFriend || user.id === id;
                        return (
                            <View key={user.id} style={tyyli.user}>
                                <Text variant="labelLarge" style={tyyli.name}>{user.name}</Text>
                                {isFriend && <Text style={tyyli.badge}>{t('components.addFriend.friendBadge')}</Text>}
                                {user.id === id && <Text style={tyyli.badge}>{t('components.addFriend.itsMe')}</Text>}
                                {!isFriend && user.id !== id && (
                                    <IconButton
                                        icon="account-plus"
                                        iconColor={colors.primary}
                                        containerColor={disabled ? colors.surfaceDisabled : colors.tertiary}
                                        disabled={disabled}
                                        onPress={() => handleAddFriend(user.name)}
                                    />
                                )}
                            </View>
                        );
                    })}
                </Stack>
            </ScrollView>
        </View>
    );
};

const createStyles = (color: MD3Colors) => StyleSheet.create({
    container: {
        padding: 10,
        paddingTop: 20,
        flex: 1,
        maxHeight: '100%'
    },
    badge: {
        color: color.primary,
        borderColor: color.primary,
        borderWidth: 1,
        fontWeight: 'bold',
        padding: 5,
        borderRadius: 10

    },
    user: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: color.elevation.level4,
        minHeight: 80,
        gap: 5
    },
    name: {
        flexShrink: 1
    }
});

export default AddFriend;