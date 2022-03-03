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

const Stats = () => {
    const [selectedCourse, setSelectedCourse] = useState<{ course: Course, layout: Layout } | null>(null);
    const [loadStats, { data, loading, error }] = useLazyQuery(GET_STATS);
    const [selectCourse, setSelectCourse] = useState(false);
    useEffect(() => {
        if (selectedCourse) {
            loadStats({ variables: { course: selectedCourse.course.name, layout: selectedCourse.layout.name } });
        }
    }, [selectedCourse]);

    const handleCourseSelect = (layout: Layout, course: Course) => {
        setSelectedCourse({ course, layout });
        setSelectCourse(false);
    };
    if (error) {
        <ErrorScreen errorMessage={error.message} />;
    }
    if (selectCourse) {
        return <SelectCourses onSelect={handleCourseSelect} />;
    }
    return (
        <Container>
            <Title>Stats</Title>
            <Button onPress={() => setSelectCourse(true)}>Select course</Button>
            {
                (loading)
                    ? <Loading noFullScreen />
                    : (!data)
                        ? <Text>Hmm... select course maybe?</Text>
                        : (data.getHc.length === 0)
                            ? <Text>No data</Text>
                            : <>
                                <Paragraph>
                                    Course: {selectedCourse?.course.name + ' / ' + selectedCourse?.layout.name}
                                </Paragraph>
                                <Text>Games: {data.getHc[0].games}</Text>
                                <Text>Hc: {data.getHc[0].hc}</Text>
                                <Text>Scores: {data.getHc[0].scores.map((n:number) => n-(selectedCourse?.layout.par||0)).join(', ')} </Text>
                            </>
            }
        </Container>
    );
};

export default Stats;