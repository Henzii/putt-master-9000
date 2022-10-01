import React, { useState } from "react";
import { useQuery } from "react-apollo";
import { View } from "react-native";
import { Headline, Title } from "react-native-paper";
import ErrorScreen from "../../components/ErrorScreen";
import { Friend } from "../../components/FriendsList";
import InfoCard from "../../components/InfoCard";
import Loading from "../../components/Loading";
import RoundTabs from "../../components/RoundTabs";
import Container from "../../components/ThemedComponents/Container";
import Divider from "../../components/ThemedComponents/Divider";
import Spacer from "../../components/ThemedComponents/Spacer";
import { GET_STATS } from "../../graphql/queries";
import { Course, Layout } from "../../hooks/useCourses";
import useMe from "../../hooks/useMe";
import useStats from "../../hooks/useStats";
import LineChart from "./LineChart";

type StatsViewProps = {
    selectedCourse: {
        course: Course,
        layout: Layout
    },
    selectedFriend?: Friend

}
export default function StatsView({ selectedCourse, selectedFriend }: StatsViewProps) {
    const { me } = useMe();
    const userId = (selectedFriend?.id || me?.id || '') as string;
    const [selectedHole, setSelectedHole] = useState(0);
    const { data, loading, error } = useQuery(GET_STATS, {
        variables: {
            course: selectedCourse.course.name,
            layout: selectedCourse.layout.name,
            userIds: [userId],
        }
    });
    const stats = useStats(selectedCourse.layout.id as string, [userId], 'cache-and-network');
    if (loading || !data?.getHc || !me) {
        return <Loading />;
    }
    if (error) {
        return <ErrorScreen errorMessage="Error just happened" />;
    }
    const scores = selectedCourse ? data?.getHc[0]?.scores.map((score: number) => score - selectedCourse.layout.par || 0) : 0;
    const scoresToDisplay = scores;
    const statsForHole = stats.getStatsForHole(userId as string, selectedHole);
    return (
        <Container withScrollView noPadding>
            <Container>
                <Headline>{selectedFriend ? `${selectedFriend.name}'s` : 'My'} stats</Headline>
                <Title>
                    {selectedCourse?.course.name + ' / ' + selectedCourse?.layout.name}
                </Title>
                <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <InfoCard title="Games" text={data.getHc[0].games} />
                    <InfoCard title="Best" text={Math.min(...scores).toString()} />
                    <InfoCard title="Average" text={
                        (Math.round((scores.reduce((p: number, c: number) => p + c, 0) / scores.length * 100)) / 100)
                            .toString()}
                    />
                    <InfoCard title="Ten latest sorted" text={
                        [...scores.slice(-10)]
                            .sort((a: number, b: number) => a - b)
                            .join(', ')
                    } />
                    <InfoCard title="HC" text={data.getHc[0].hc} />
                </View>
                <LineChart par={0} data={scoresToDisplay} />
                <Spacer size={15} />
                <Divider />
                <Title>Holes data</Title>
            </Container>
            <RoundTabs
                selectedRound={selectedHole}
                setSelectedRound={setSelectedHole}
                gameData={{
                    holes: selectedCourse.layout.holes,
                    scorecards: []
                }}
            />
            <Container>
                {!statsForHole
                    ? <Title>No data available</Title>
                    : <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <InfoCard text={statsForHole.count} title="Total" />
                        <InfoCard text={statsForHole.best} title="Best" />
                        <InfoCard text={statsForHole.average} title="Average" />
                        <InfoCard text={statsForHole.eagle} title="Eagles" />
                        <InfoCard text={statsForHole.birdie} title="Birdies" />
                        <InfoCard text={statsForHole.par} title="Pars" />
                        <InfoCard text={statsForHole.bogey} title="Bogeys" />
                        <InfoCard text={statsForHole.doubleBogey} title="2x Bogeys" />
                        <InfoCard text={ // Ääääääääääääääääääääääääääää
                            statsForHole.count - statsForHole.eagle - statsForHole.birdie - statsForHole.par -
                            statsForHole.bogey - statsForHole.doubleBogey
                        } title="Others" />
                    </View>
                }
            </Container>

        </Container>
    );
}

