import gql from "graphql-tag";
import React, { useState } from "react";
import { useQuery } from "react-apollo";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Button, Card, Modal, Searchbar, Portal, List } from "react-native-paper";
import useCourses, { Course, Layout, NewLayout } from "../hooks/useCourses";
import AddCourse from "./AddCourse";
import SelectLayout from "./SelectLayout";
import Container from "./ThemedComponents/Container";

type SingleCourseProps = {
    course: Course,
    onAddLayout?: (courseId: number | string, layout: NewLayout) => void,
    onLayoutClick?: (layout: Layout, course: Course) => void,
}
type SelectCoursesProps = {
    onSelect?: (layout: Layout, course: Course) => void
}
const SelectCourses = ({ onSelect }: SelectCoursesProps) => {
    const { courses, loading, addLayout, addCourse } = useCourses();
    const [displaySearchBar, setDisplaySearchBar] = useState(false);
    const [displayAddCourse, setDisplayAddCourse] = useState(false);
    const [searchQuery, setSearchQuery] = useState('')

    const handleAddLayout = (courseId: number | string, layout: NewLayout) => {
        addLayout(courseId, layout)
    }
    const handleClickLayout = (layout: Layout, course: Course) => {
        if (onSelect) onSelect(layout, course)
    }
    const handleAddCourse = (newCourseName: string) => {
        addCourse(newCourseName)
        setDisplayAddCourse(false)
    }
    if (loading || !courses) return (
        <View><Text>Loading...</Text></View>
    )

    return (
        <Container noPadding>
            <Portal>
                <Modal
                    visible={displayAddCourse}
                    onDismiss={() => setDisplayAddCourse(false)}
                    contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <AddCourse
                        onCancel={() => setDisplayAddCourse(false)}
                        onAdd={handleAddCourse}
                    />
                </Modal>
            </Portal>
            {displaySearchBar && <Searchbar
                autoComplete={false}
                placeholder="Search"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />}
            <View style={tyyli.topButtons}>
                <Button icon="plus-thick" onPress={() => setDisplayAddCourse(true)}>Add Course</Button>
                <Button icon="magnify" onPress={() => setDisplaySearchBar(!displaySearchBar)}>Search</Button>
            </View>
            <Container noPadding>
                {courses.map(c => (
                    <SingleCourse
                        course={c}
                        key={c.id}
                        onAddLayout={handleAddLayout}
                        onLayoutClick={handleClickLayout}
                    />
                ))}
            </Container>
        </Container>
    )
}

const SingleCourse = ({ course, onAddLayout, onLayoutClick }: SingleCourseProps) => {
    return (
        <List.Accordion
            style={tyyli.container}
            title={course.name}
            titleStyle={{ fontSize: 18 }}
            description={course.layouts.length + ' layouts'}
        >
            <SelectLayout course={course} onAddLayout={onAddLayout} onSelect={onLayoutClick} />
        </List.Accordion>
    )
}

const tyyli = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 5,
        
    },
    topButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 10,
    },
    card: {
        width: '100%',
        marginBottom: 3,
        borderWidth: 1,
    },

})
export default SelectCourses;