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
    const [loadStats, { data, loading, error }] = useLazyQuery(GET_STATS);
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
        return <SelectCourses onSelect={handleCourseSelect} title="Show stats from" />;
    }
    if (loading || !data) {
        return <Loading />;
    }
    return (
        <>
            <Container>
                <Title>Stats</Title>
                {
                    (!data.getHc || data.getHc.length === 0)
                        ? <Text>No data</Text>
                        : <>
                            <Paragraph>
                                Course: {selectedCourse?.course.name + ' / ' + selectedCourse?.layout.name}
                                <Button onPress={() => setSelectedCourse(null)}>Change</Button>
                            </Paragraph>
                            <Text>Games: {data.getHc[0].games}</Text>
                            <Text>Hc: {data.getHc[0].hc}</Text>
                            <Text>Scores: {data.getHc[0].scores.map((n: number) => n - (selectedCourse?.layout.par || 0)).join(', ')} </Text>
                        </>
                }
            </Container>
            <LineChart />
        </>
    );
};

export default Stats;