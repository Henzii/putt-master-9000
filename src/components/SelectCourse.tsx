import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Card } from "react-native-paper";
import useCourses, { Course } from "../hooks/useCourses";

const SelectCourses = ({ onSelect }: { onSelect?: (courseId: number | string) => void }) => {
    const { courses } = useCourses();
    if (!courses) return (
        <View><Text>Loading...</Text></View>
    )
    return (
        <View>
            {courses.map(c => <SingleCourse course={c} key={c.id} onClick={onSelect} />)}
        </View>
    )
}

const SingleCourse = ({ course, onClick }: { course: Course, onClick?: (courseId: number | string) => void }) => {
    const handlePress = () => {
        if (onClick) onClick(course.id);
    }
    return (
        <Pressable onPress={handlePress}>
            <Card style={tyyli.card}>
                <Card.Title
                    title={course.name}
                    subtitle={course.layout}
                />
                <Card.Content>
                    <View style={tyyli.parList}>
                        {course.pars.map((p, i) => <Text key={course.id + '' + i} style={tyyli.parListText}>{p}</Text>)}
                    </View>
                </Card.Content>
            </Card>
        </Pressable>
    )
}
const tyyli = StyleSheet.create({
    card: {
        width: '95vw',
        marginBottom: 3,
        borderWidth: 1,
    },
    parList: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    parListText: {
        color: 'gray',
    }
})
export default SelectCourses;