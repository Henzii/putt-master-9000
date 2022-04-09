import { useLazyQuery } from 'react-apollo';
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { Button, Paragraph, Title } from 'react-native-paper';
import Loading from '../../components/Loading';
import Container from '../../components/ThemedComponents/Container';
import { GET_STATS } from '../../graphql/queries';
import SelectCourses from '../../components/SelectCourse';
import { Course, Layout } from '../../hooks/useCourses';
import ErrorScreen from '../../components/ErrorScreen';
import LineChart from './LineChart';

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
        return <SelectCourses onSelect={handleCourseSelect} title="Show stats from" showTraffic={false} showDistance={false} />;
    }
    if (loading || !data) {
        return <Loading />;
    }
    const scoresToDisplay = data.getHc[0].scores;
    return (
        <>
            <Container withScrollView>
                <Title>Stats</Title>
                {
                    (!data.getHc || data.getHc.length === 0)
                        ? <Text>No data</Text>
                        : <>
                            <Paragraph>
                                Course: {selectedCourse?.course.name + ' / ' + selectedCourse?.layout.name}
                            </Paragraph>
                            <Text>Games: {data.getHc[0].games}</Text>
                            <Text>Hc: {data.getHc[0].hc}</Text>
                            <Text>Scores: {data.getHc[0].scores.map((n: number) => n - (selectedCourse?.layout.par || 0)).join(', ')} </Text>
                        </>
                }
                <Button onPress={() => setSelectedCourse(null)}>Change course</Button>
                <LineChart par={selectedCourse.layout.par} data={scoresToDisplay} />
            </Container>
        </>
    );
};

export default Stats;