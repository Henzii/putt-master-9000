import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { View } from 'react-native';
import { Button, Headline } from "react-native-paper";
import ErrorScreen from '../../components/ErrorScreen';
import Loading from '../../components/Loading';
import Container from '../../components/ThemedComponents/Container';
import { GET_ACHIEVEMENTS } from '../../graphql/queries';
import Badge from './Badge';
import { User } from '../../types/user';
import SplitContainer from '../../components/ThemedComponents/SplitContainer';
import FriendsList, { Friend } from '../../components/FriendsList';

const Achievements = () => {
    const {data, loading, error} = useQuery<{getMe?: User}>(GET_ACHIEVEMENTS, {fetchPolicy: 'no-cache'});
    const [showSelectFriendView, setShowSelectFriendView] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

    const handleFriendSelect = (friends: Friend[] | null) => {
        setSelectedFriend(friends?.[0] ?? null);
        setShowSelectFriendView(false);
    };

    if (loading) {
        return <Loading />;
    }
    if (error || !data?.getMe?.achievements) {
        return <ErrorScreen errorMessage="Does not compute" />;
    }

    if (showSelectFriendView) {
        return <FriendsList onClick={handleFriendSelect} />;
    }

    const achievements = selectedFriend ? data.getMe.friends?.find(f => f.id === selectedFriend.id)?.achievements : data.getMe.achievements;

    return (
        <Container withScrollView fullScreen noPadding>
            <SplitContainer style={{paddingHorizontal: 8}}>
                <Button icon="incognito" onPress={() => setShowSelectFriendView(true)}>Friends&apos; achievements</Button>
                {selectedFriend && (<Button onPress={() => handleFriendSelect(null)}>My achievements</Button>)}
            </SplitContainer>
            <Headline style={{margin: 20, marginTop: 25, marginBottom: 25}}>{selectedFriend ? `${selectedFriend.name}'s` : 'My'} achievements</Headline>
            <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                {achievements?.map((ach, index) => (
                    <Badge
                        key={`${ach.id}-${index}`}
                        badgeName={ach.id}
                        course={ach.game.course}
                        layout={ach.game.layout}
                        date={ach.game.startTime}
                    />
                ))}
            </View>
        </Container>
    );
};


export default Achievements;