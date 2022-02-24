import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Button, Modal, Searchbar, Portal, List } from "react-native-paper";
import useCourses, { Course, Layout, NewLayout } from "../hooks/useCourses";
import useTextInput from "../hooks/useTextInput";
import AddCourse from "./AddCourse";
import Loading from "./Loading";
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
    const [displaySearchBar, setDisplaySearchBar] = useState(false);
    const [displayAddCourse, setDisplayAddCourse] = useState(false);
    const { courses, loading, addLayout, addCourse, fetchMore, ...restOfUseCourses } = useCourses();

    const [searchInput] = useTextInput({ defaultValue: '', callBackDelay: 500, callBack: restOfUseCourses.setSearchString });

    const handleAddLayout = (courseId: number | string, layout: NewLayout) => {
        addLayout(courseId, layout);
    };
    const handleClickLayout = (layout: Layout, course: Course) => {
        if (onSelect) onSelect(layout, course);
    };
    const handleAddCourse = (newCourseName: string) => {
        addCourse(newCourseName);
        setDisplayAddCourse(false);
    };
    if (!courses) return (
        <Loading />
    );

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
            {displaySearchBar ? <Searchbar
                autoComplete={false}
               {...searchInput}
            /> : null}
            <View style={tyyli.topButtons}>
                <Button icon="plus-thick" onPress={() => setDisplayAddCourse(true)} testID="AddCourseButton">Add Course</Button>
                <Button icon="magnify" onPress={() => setDisplaySearchBar(!displaySearchBar)}>Search</Button>
            </View>
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id as string}
                ItemSeparatorComponent={Separaattori}
                ListFooterComponent={(loading) ? <Loading noFullScreen loadingText="" /> : <Text>The end is here</Text>}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.1}
                renderItem={({ item }) => (
                    <SingleCourse
                        course={item}
                        onAddLayout={handleAddLayout}
                        onLayoutClick={handleClickLayout}
                    />)
                }
            />
        </Container>
    );
};
const Separaattori = () => <View style={tyyli.separaattori} />;
const SingleCourse = ({ course, onAddLayout, onLayoutClick }: SingleCourseProps) => {
    return (
        <List.Accordion
            style={tyyli.container}
            title={course.name}
            titleStyle={{ fontSize: 18 }}
            description={course.layouts.length + ' layouts'}
            testID='SingleCourse'
        >
            <SelectLayout course={course} onAddLayout={onAddLayout} onSelect={onLayoutClick} />
        </List.Accordion>
    );
};

const tyyli = StyleSheet.create({
    container: {
        padding: 5,
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
    separaattori: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)'
    }
});
export default SelectCourses;