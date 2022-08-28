import { useLazyQuery } from 'react-apollo';
import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Button, Headline, Title } from 'react-native-paper';
import Loading from '../../components/Loading';
import Container from '../../components/ThemedComponents/Container';
import { GET_STATS } from '../../graphql/queries';
import SelectCourses from '../../components/SelectCourse';
import { Course, Layout } from '../../hooks/useCourses';
import ErrorScreen from '../../components/ErrorScreen';
import LineChart from './LineChart';
import InfoCard from '../../components/InfoCard';

const Stats = () => {
    const [selectedCourse, setSelectedCourse] = useState<{ course: Course, layout: Layout } | null>(null);
    const [loadStats, { data, loading, error }] = useLazyQuery(GET_STATS, { fetchPolicy: 'cache-and-network' });
    useEffect(() => {
        if (selectedCourse) {
            loadStats({ variables: { course: selectedCourse.course.name, layout: selectedCourse.layout.name } });
        }
    }, [selectedCourse]);

    const handleCourseSelect = (layout: Layout, course: Course) => {
        setSelectedCourse({ course, layout });
    };
    if (error) {
        <ErrorScreen errorMessage={error.message} />;
    }
    if (!selectedCourse) {
        return <SelectCourses onSelect={handleCourseSelect} title="Show stats from" showTraffic={false} />;
    }
    if (loading || !data || !data?.getHc) {
        return <Loading />;
    }
    const scores = data.getHc[0].scores.map((score: number) => score - selectedCourse.layout.par || 0);
    const scoresToDisplay = scores;
    return (
        <>
            <Container withScrollView>
                <Headline>Stats</Headline>
                {
                    (!data.getHc || data.getHc.length === 0)
                        ? <Text>No data</Text>
                        : <>
                            <Title>
                                {selectedCourse?.course.name + ' / ' + selectedCourse?.layout.name}
                            </Title>
                            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <InfoCard title="Games" text={data.getHc[0].games} />
                                <InfoCard title="Best" text={Math.min(...scores).toString()} />
                                <InfoCard title="Average" text={
                                    (Math.round((scores.reduce((p:number,c:number) => p+c, 0) / scores.length * 100)) / 100)
                                    .toString()}
                                />
                                <InfoCard title="Ten latest sorted" text={
                                    [...scores.slice(-10)]
                                    .sort((a:number, b:number) => a-b)
                                    .join(', ')
                                }/>
                                <InfoCard title="HC" text={data.getHc[0].hc} />
                            </View>
                        </>
                }
                <Button onPress={() => setSelectedCourse(null)}>Change course</Button>
                <LineChart par={0} data={scoresToDisplay} />
            </Container>
        </>
    );
};

export default Stats;