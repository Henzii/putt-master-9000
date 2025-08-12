import React, { useState } from 'react';
import { Button, Text } from 'react-native-paper';
import SelectCourses from '@components/SelectCourse/SelectCourse';
import StatsView from './StatsView';
import Container from '@components/ThemedComponents/Container';
import FriendsList, { Friend } from '@components/FriendsList';
import useMe from '../../hooks/useMe';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/store';
import { setSelectedLayout } from '../../reducers/selectedLayoutReducer';
import { User } from '../../types/user';
import { Course, Layout } from '../../types/course';
import Activity from './Activity';
import Divider from '@components/ThemedComponents/Divider';
import Loading from '@components/Loading';
import Spacer from '@components/ThemedComponents/Spacer';
import { View } from 'react-native';
import Header from '@components/RoundedHeader/Header';
import Stack from '@components/Stack';
import HeaderButton from '@components/RoundedHeader/HeaderButton';

const Stats = () => {
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
    const { me } = useMe();

    const handleFriendSelect = (friends?: Friend[]) => {
        if (friends) {
            setSelectedUser(friends[0] as User);
        }
        setShowSelectFriend(false);
    };

    if (!me) return <Loading />;
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
                    {selectedUser ? `${selectedUser.name}'s stats` : 'My stats'}
                </Text>
                <Stack direction='row' justifyContent='space-between'>
                    <HeaderButton onPress={() => setShowSelectFriend(true)} icon="incognito">Spy a friend</HeaderButton>
                    {selectedUser && <HeaderButton onPress={() => setSelectedUser(undefined)}>My stats</HeaderButton>}
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
                            <Button icon="golf" onPress={() => setShowSelectCourse(true)} mode="outlined">Change course</Button>
                        </View>
                        <StatsView selectedCourse={selectedCourse} selectedUser={selectedUser ?? me} />
                    </>
                ) : (
                    <Container>
                        <Text>No course selected. Select a course to view layout specific stats.</Text>
                        <Spacer />
                        <Button icon="golf" onPress={() => setShowSelectCourse(true)} mode="contained">Select course</Button>
                    </Container>
                )}
            </Container>
        </View>
    );
};

export default Stats;