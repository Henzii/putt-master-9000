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

const Stats = () => {
    const [selectedUser, setSelectedUser] = useState<User>();
    const [showSelectCourse, setShowSelectCourse] = useState(false);
    const [showSelectFriend, setShowSelectFriend] = useState(false);
    const dispatch = useDispatch();
    const selectedCourse = useSelector((state: RootState) => state.selectedLayout);

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
        <>
            <SplitContainer spaceAround>
                {selectedUser && <Button onPress={() => setSelectedUser(undefined)}>My stats</Button>}
                <Button onPress={() => setShowSelectFriend(true)} icon="incognito">Spy a friend</Button>
            </SplitContainer>
            <Container withScrollView noPadding fullHeight>
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
        </>
    );
};

export default Stats;