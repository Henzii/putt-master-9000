import React, { useState, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { View, Text, StyleSheet } from "react-native";
import { Headline, Title } from "react-native-paper";
import ErrorScreen from "../../components/ErrorScreen";
import InfoCard from "../../components/InfoCard";
import Loading from "../../components/Loading";
import RoundTabs from "../../components/RoundTabs";
import Container from "../../components/ThemedComponents/Container";
import Divider from "../../components/ThemedComponents/Divider";
import Spacer from "../../components/ThemedComponents/Spacer";
import { GET_STATS } from "../../graphql/queries";
import useStats from "../../hooks/useStats";
import LineChart from "./LineChart";
import SelectButtonGroup from "../../components/SelectButtonGroup";
import SelectButton from "../../components/SelectButton";
import BarChart from "./BarChart";
import BestPoolGame from "./BestPoolGame";
import { Course, Layout } from "../../types/course";
import { User } from "../../types/user";

type StatsViewProps = {
    selectedCourse: {
        course: Course,
        layout: Layout
    },
    selectedUser: User

}
export default function StatsView({ selectedCourse, selectedUser }: StatsViewProps) {
    const [selectedHole, setSelectedHole] = useState(0);
    const [chartScoresCount, setChartScoresCount] = useState('All');
    const stats = useStats(selectedCourse.layout.id as string, [selectedUser.id as string], 'cache-and-network', selectedUser.id);
    const { data, loading, error } = useQuery(GET_STATS, {
        variables: {
            layoutId: selectedCourse.layout.id,
            userIds: [selectedUser.id],
        }
    });
    const scores = selectedCourse ? data?.getHc[0]?.scores.map((score: number) => score - selectedCourse.layout.par || 0) : 0;

    const scoresCount = Number.parseInt(chartScoresCount);
    const scoresToDisplay = isNaN(scoresCount) ? scores : scores.slice(-scoresCount);

    const getStatsForHole = useCallback(() => {
        return stats.getStatsForHole(selectedUser.id as string, selectedHole);
    }, [stats, selectedUser]);
    const statsForHole = getStatsForHole();
    if (loading || !data?.getHc) {
        return <Loading />;
    }
    if (error) {
        return <ErrorScreen errorMessage="Error just happened" />;
    }
    if (!data.getHc?.length) {
        return <View><Text> No data...</Text></View>;
    }
    return (
        <Container noPadding>
            <Container>
                <Headline>{`${selectedUser.name}'s`} stats</Headline>
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
                            .map((score, index, allScores) => {
                                const midIndex = allScores.length / 2;
                                const isHcSCore = allScores.length >= 10 && (midIndex % 2 === 0 ? index === midIndex : [midIndex - 1, midIndex].includes(index));
                                return (
                                    <React.Fragment key={index}>
                                        <Text style={isHcSCore && styles.bold}>
                                            {score}
                                        </Text>
                                        {index < allScores.length - 1 && <Text>, </Text>}
                                    </React.Fragment>
                                );
                            })
                    } />
                    <InfoCard title="HC" text={data.getHc[0].hc} />
                </View>
                <Spacer size={15} />
                <SelectButtonGroup selectedDefault={chartScoresCount} onSelect={setChartScoresCount}>
                    <SelectButton name="All">All</SelectButton>
                    <SelectButton name="50">50</SelectButton>
                    <SelectButton name="10">10</SelectButton>
                </SelectButtonGroup>
            </Container>
            <LineChart par={0} data={scoresToDisplay} />
            <Spacer size={15} />
            <Divider />
            <Headline style={{ marginLeft: 25 }}>Holes data</Headline>
            <Spacer />
            <BarChart stats={stats.getHolesStats(selectedUser.id as string)} holes={selectedCourse.layout.holes} />
            <Spacer size={15} />
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
            <Divider />
            <Container>
                <BestPoolGame layoutId={selectedCourse.layout.id} />
            </Container>

        </Container>
    );
}

const styles = StyleSheet.create({
    bold: {
        fontWeight: '900',
        fontSize: 15,
    }
});