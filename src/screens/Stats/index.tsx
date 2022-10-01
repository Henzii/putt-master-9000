import React, { useState } from 'react';
import { Button, Paragraph } from 'react-native-paper';
import SelectCourses from '../../components/SelectCourse';
import { Course, Layout } from '../../hooks/useCourses';
import SplitContainer from '../../components/ThemedComponents/SplitContainer';
import StatsView from './StatsView';
import Container from '../../components/ThemedComponents/Container';
import FriendsList, { Friend } from '../../components/FriendsList';

const Stats = () => {
    const [selectedCourse, setSelectedCourse] = useState<{ course: Course, layout: Layout } | null>(null);
    const [selectedFriend, setSelectedFriend] = useState<Friend>();
    const [showSelectCourse, setShowSelectCourse] = useState(false);
    const [showSelectFriend, setShowSelectFriend] = useState(false);
    const handleCourseSelect = (layout: Layout, course: Course) => {
        setSelectedCourse({ course, layout });
        setShowSelectCourse(false);
    };
    const handleFriendSelect = (friends: Friend[]) => {
        if (friends) {
            setSelectedFriend(friends[0]);
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
                <Button onPress={() => setShowSelectCourse(true)}>Change course</Button>
                {selectedFriend && <Button onPress={() => setSelectedFriend(undefined)}>My stats</Button>}
                <Button onPress={() => setShowSelectFriend(true)}>Spy friend</Button>
            </SplitContainer>
            {selectedCourse
                ? <StatsView selectedCourse={selectedCourse} selectedFriend={selectedFriend} />
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