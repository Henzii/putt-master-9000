import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Button, Card, Modal, Searchbar, Portal, List } from "react-native-paper";
import useCourses, { Course, Layout } from "../hooks/useCourses";
import AddCourse from "./AddCourse";
import SelectLayout from "./SelectLayout";

const SelectCourses = ({ onSelect }: { onSelect?: (layoutId: number| string, courseId?: number | string) => void }) => {
    const { courses, addLayout } = useCourses();
    const [displaySearchBar, setDisplaySearchBar] = useState(false);
    const [displayAddCourse, setDisplayAddCourse] = useState(false);
    const [searchQuery, setSearchQuery] = useState('')

    const handleAddLayout = (courseId: number | string, layout: Omit<Layout,"id">) => {
        addLayout(courseId, layout)
    }
    const handleClickLayout = (layoutId: number | string, courseId?: number | string) => {
        if (onSelect) onSelect(layoutId, courseId)
    }
    if (!courses) return (
        <View><Text>Loading...</Text></View>
    )

    return (
        <View style={tyyli.wide}>
            <Portal>
                <Modal
                    visible={displayAddCourse}
                    onDismiss={() => setDisplayAddCourse(false)}
                    contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <AddCourse />
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
            <View style={tyyli.wide}>
                {courses.map(c => (
                    <SingleCourse 
                        course={c}
                        key={c.id}
                        onAddLayout={handleAddLayout}
                        onLayoutClick={handleClickLayout}
                    />
                ))}
            </View>
        </View>
    )
}

const SingleCourse = ({ course, onAddLayout, onLayoutClick }: SingleCourseProps ) => {
    return (
            <List.Accordion
                title={course.name}
                description={course.layouts.length + ' layouts'}
            >
                <SelectLayout course={course} onAddLayout={onAddLayout} onSelect={onLayoutClick}/>
            </List.Accordion>
    )
}

type SingleCourseProps = {
    course: Course,
    onAddLayout?: (courseId: number | string, layout: Omit<Layout, "id">) => void,
    onLayoutClick?: (layoutId: number | string) => void,
}

const tyyli = StyleSheet.create({
    topButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 10,
    },
    wide: {
        width: '100%',
    },
    card: {
        width: '100%',
        marginBottom: 3,
        borderWidth: 1,
    },

})
export default SelectCourses;