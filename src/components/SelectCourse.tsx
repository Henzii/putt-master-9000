import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Button, Card, Modal, Searchbar, Portal, List } from "react-native-paper";
import useCourses, { Course } from "../hooks/useCourses";
import AddCourse from "./AddCourse";

const SelectCourses = ({ onSelect }: { onSelect?: (courseId: number | string) => void }) => {
    const courses = useCourses();
    const [displaySearchBar, setDisplaySearchBar] = useState(false);
    const [displayAddCourse, setDisplayAddCourse] = useState(false);
    const [searchQuery, setSearchQuery] = useState('')
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
                {courses.map(c => <SingleCourse course={c} key={c.id} onClick={onSelect} />)}
            </View>
        </View>
    )
}

const SingleCourse = ({ course, onClick }: { course: Course, onClick?: (courseId: number | string) => void }) => {
    const handlePress = (id: number | string) => {
        if (onClick) onClick(id);
    }
    return (
            <List.Accordion 
                title={course.name} 
                description={course.layouts.length + ' layouts'}
            >
                {course.layouts.map(l => 
                    <List.Item 
                        title={l.name}
                        description={'Par ' + l.par}
                        key={l.id}
                        onPress={() => handlePress(l.id)}
                    />
                )}
            </List.Accordion>
    )
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
    parList: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    parListText: {
        color: 'gray',
    },
    floatingAddButton: {

    }
})
export default SelectCourses;