import React, { useState, useEffect } from 'react';
import { Button, Paragraph } from 'react-native-paper';
import SelectCourses from '../../components/SelectCourse';
import { Course, Layout } from '../../hooks/useCourses';
import SplitContainer from '../../components/ThemedComponents/SplitContainer';
import StatsView from './StatsView';
import Container from '../../components/ThemedComponents/Container';
import FriendsList, { Friend } from '../../components/FriendsList';
import useMe, { User } from '../../hooks/useMe';

const Stats = () => {
    const [selectedCourse, setSelectedCourse] = useState<{ course: Course, layout: Layout } | null>(null);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [showSelectCourse, setShowSelectCourse] = useState(false);
    const [showSelectFriend, setShowSelectFriend] = useState(false);
    const handleCourseSelect = (layout: Layout, course: Course) => {
        setSelectedCourse({ course, layout });
        setShowSelectCourse(false);
    };
    const {me} = useMe();
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
            {selectedCourse && selectedUser
                ? <StatsView selectedCourse={selectedCourse} selectedUser={selectedUser} />
                : (
                    <Container>
                        <Paragraph>
                            No course/layout selected.
                        </Paragraph>
                    </Container>
                )
            }
        </>
    );
};

export default Stats;