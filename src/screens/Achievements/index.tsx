import React from 'react';
import { useQuery } from '@apollo/client';
import { View } from 'react-native';
import { Headline } from "react-native-paper";
import ErrorScreen from '../../components/ErrorScreen';
import Loading from '../../components/Loading';
import Container from '../../components/ThemedComponents/Container';
import { GET_ACHIEVEMENTS } from '../../graphql/queries';
import { User } from '../../hooks/useMe';
import Badge from './Badge';

const Achievements = () => {
    const {data, loading, error} = useQuery<{getMe?: User}>(GET_ACHIEVEMENTS, {fetchPolicy: 'no-cache'});
    if (loading) {
        return <Loading />;
    }
    if (error || !data?.getMe?.achievements) {
        return <ErrorScreen errorMessage="Does not compute" />;
    }

    return (
        <Container withScrollView fullScreen noPadding>
            <Headline style={{margin: 20, marginTop: 25, marginBottom: 25}}>Achievements</Headline>
            <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                {data.getMe.achievements.map((ach, index) => (
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