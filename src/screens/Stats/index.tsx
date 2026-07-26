import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text } from 'react-native-paper';
import SelectCourses from '@components/SelectCourse/SelectCourse';
import StatsView from './StatsView';
import Container from '@components/ThemedComponents/Container';
import FriendsList, { Friend } from '@components/FriendsList';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/store';
import { setSelectedLayout } from '../../reducers/selectedLayoutReducer';
import { User } from '../../types/user';
import { Course, Layout } from '../../types/course';
import Activity from './Activity';
import Divider from '@components/ThemedComponents/Divider';
import Spacer from '@components/ThemedComponents/Spacer';
import { View } from 'react-native';
import Header from '@components/RoundedHeader/Header';
import Stack from '@components/Stack';
import HeaderButton from '@components/RoundedHeader/HeaderButton';
import { useSessionV2 } from '@hooks/session/useSessionV2';

const Stats = () => {
    const { t } = useTranslation();
    const [selectedUser, setSelectedUser] = useState<User>();
    const [showSelectCourse, setShowSelectCourse] = useState(false);
    const [showSelectFriend, setShowSelectFriend] = useState(false);
    const dispatch = useDispatch();
    const selectedCourse = useSelector((state: RootState) => state.selectedLayout);
    const [headerSpacing, setHeaderSpacing] = useState(60);

    const handleCourseSelect = (layout: Layout, course: Course) => {
        dispatch(setSelectedLayout(course, layout));
        setShowSelectCourse(false);
    };
    const { user } = useSessionV2();

    const handleFriendSelect = (friends?: Friend[]) => {
        if (friends) {
            setSelectedUser(friends[0] as User);
        }
        setShowSelectFriend(false);
    };

    if (showSelectCourse) {
        return <SelectCourses onSelect={handleCourseSelect} showTraffic={false} onBackAction={() => setShowSelectCourse(false)} />;
    } else if (showSelectFriend) {
        return <FriendsList onClick={handleFriendSelect} hideRemoveButton onBackAction={() => setShowSelectFriend(false)} />;
    }
    return (
        <View style={{flex: 1}}>
            <Header setSpacing={setHeaderSpacing} bottomSize={20}>
            <Stack gap={20} direction='column' justifyContent="space-between" maxWidth="100%">
                <Text variant="titleLarge" style={{color: '#fff'}} numberOfLines={2}>
                    {selectedUser ? t('screens.stats.userStats', { name: selectedUser.name }) : t('screens.stats.myStats')}
                </Text>
                <Stack direction='row' justifyContent='space-between'>
                    <HeaderButton onPress={() => setShowSelectFriend(true)} icon="incognito">{t('screens.stats.spyFriend')}</HeaderButton>
                    {selectedUser && <HeaderButton onPress={() => setSelectedUser(undefined)}>{t('screens.stats.myStats')}</HeaderButton>}
                </Stack>
            </Stack>
            </Header>
            <Container withScrollView noPadding fullHeight>
                <Spacer size={headerSpacing} />
                <Activity selectedUser={selectedUser} />
                <Divider />
                {selectedCourse ? (
                    <>
                        <View style={{paddingHorizontal: 10}}>
                            <Button icon="golf" onPress={() => setShowSelectCourse(true)} mode="outlined">{t('screens.stats.changeCourse')}</Button>
                        </View>
                        <StatsView selectedCourse={selectedCourse} selectedUser={selectedUser ?? user} />
                    </>
                ) : (
                    <Container>
                        <Text>{t('screens.stats.noCourseSelected')}</Text>
                        <Spacer />
                        <Button icon="golf" onPress={() => setShowSelectCourse(true)} mode="contained">{t('screens.stats.selectCourse')}</Button>
                    </Container>
                )}
            </Container>
        </View>
    );
};

export default Stats;