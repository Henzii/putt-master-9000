import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from "react-native-paper";
import ErrorScreen from '@components/ErrorScreen';
import Loading from '@components/Loading';
import { GET_ACHIEVEMENTS } from '../../graphql/queries';
import Badge from './Badge';
import { User } from '../../types/user';
import FriendsList, { Friend } from '@components/FriendsList';
import Header from '@components/RoundedHeader/Header';
import Stack from '@components/Stack';
import Spacer from '@components/ThemedComponents/Spacer';

const Achievements = () => {
    const { t } = useTranslation();
    const { data, loading, error } = useQuery<{ getMe?: User }>(GET_ACHIEVEMENTS, { fetchPolicy: 'no-cache' });
    const [showSelectFriendView, setShowSelectFriendView] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [headerSpacing, setHeaderSpacing] = useState(60);
    const {colors} = useTheme();

    const handleFriendSelect = (friends: Friend[] | null) => {
        setSelectedFriend(friends?.[0] ?? null);
        setShowSelectFriendView(false);
    };

    const handleSpyButtonPress = () => {
        if (selectedFriend) {
            setSelectedFriend(null);
        } else {
            setShowSelectFriendView(true);
        }
    };

    if (loading) {
        return <Loading />;
    }
    if (error || !data?.getMe?.achievements) {
        return <ErrorScreen errorMessage={t('screens.achievements.errorLoading')} />;
    }

    if (showSelectFriendView) {
        return <FriendsList onClick={handleFriendSelect} />;
    }

    const achievements = selectedFriend ? data.getMe.friends?.find(f => f.id === selectedFriend.id)?.achievements : data.getMe.achievements;

    return (
        <View style={{flex: 1}}>
            <Header setSpacing={setHeaderSpacing} bottomSize={20}>
                <Stack gap={20} direction='row' justifyContent="space-between" alignItems='center' maxWidth="100%">
                    <Text variant="headlineSmall" style={styles.headerText} numberOfLines={2}>
                        {selectedFriend ? t('screens.achievements.userAchievements', { name: selectedFriend.name }) : t('screens.achievements.myAchievements')}
                    </Text>
                    <IconButton onPress={handleSpyButtonPress} icon={selectedFriend ? 'account' : 'incognito'} containerColor={colors.tertiary} iconColor={colors.primary} />
                </Stack>
            </Header>
            <ScrollView>
                <Spacer size={headerSpacing} />
                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {achievements?.map((ach, index) => (
                        <Badge
                            key={`${ach.id}-${index}`}
                            badgeName={ach.id}
                            course={ach.game.course}
                            layout={ach.game.layout}
                            date={ach.game.startTime}
                        />
                    ))}
                    {achievements?.length === 0 && (
                        <Text style={{ textAlign: 'center', width: '100%' }}>{t('screens.achievements.noAchievements')}</Text>
                    )}
                </View>
                <Spacer />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    headerText: {
        color: '#fff',
        flexShrink: 1
    }
});


export default Achievements;