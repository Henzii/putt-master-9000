import React, { useState, useEffect } from 'react';
import { Button, Paragraph } from 'react-native-paper';
import SelectCourses from '../../components/SelectCourse/SelectCourse';
import SplitContainer from '../../components/ThemedComponents/SplitContainer';
import StatsView from './StatsView';
import Container from '../../components/ThemedComponents/Container';
import FriendsList, { Friend } from '../../components/FriendsList';
import useMe from '../../hooks/useMe';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../utils/store';
import { setSelectedLayout } from '../../reducers/selectedLayoutReducer';
import { User } from '../../types/user';
import { Course, Layout } from '../../types/course';
import Activity from './Activity';
import Divider from '../../components/ThemedComponents/Divider';

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
    useEffect(() => {
        if (!selectedUser && me) {
            setSelectedUser(me);
        }
    }, [me]);
    const handleFriendSelect = (friends?: Friend[]) => {
        if (friends) {
            setSelectedUser(friends[0] as User);
        } else if (me) {
            setSelectedUser(me);
        }
        setShowSelectFriend(false);
    };
    if (showSelectCourse) {
        return <SelectCourses onSelect={handleCourseSelect} showTraffic={false} />;
    } else if (showSelectFriend) {
        return <FriendsList onClick={handleFriendSelect} hideRemoveButton />;
    }
    return (
        <>
            <SplitContainer spaceAround>
                <Button onPress={() => setShowSelectCourse(true)}>Select course</Button>
                {selectedUser?.id !== me?.id && <Button onPress={() => setSelectedUser(me || undefined)}>My stats</Button>}
                <Button onPress={() => setShowSelectFriend(true)}>Spy friend</Button>
            </SplitContainer>
            <Container withScrollView noPadding>
                <Activity />
                <Divider />
                {selectedCourse && selectedUser
                    ? <StatsView selectedCourse={selectedCourse} selectedUser={selectedUser} />
                    : (
                        <Paragraph>
                            Select course and layout to view layout specific stats.
                        </Paragraph>
                    )
                }
            </Container>
        </>
    );
};

export default Stats;