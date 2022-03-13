import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Button, Modal, Searchbar, Portal, List } from "react-native-paper";
import useCourses, { Course, Layout, NewLayout } from "../hooks/useCourses";
import useTextInput from "../hooks/useTextInput";
import AddCourse from "./AddCourse";
import ErrorScreen from "./ErrorScreen";
import Loading from "./Loading";
import SelectLayout from "./SelectLayout";
import Container from "./ThemedComponents/Container";

type SingleCourseProps = {
    course: Course,
    onAddLayout?: (courseId: number | string, layout: NewLayout) => void,
    onLayoutClick?: (layout: Layout, course: Course) => void,
    onCourseClick?: (courseId: Course['id'] | null) => void,
    expanded: Course['id'] | null,
}
type SelectCoursesProps = {
    onSelect?: (layout: Layout, course: Course) => void
}
const SelectCourses = ({ onSelect }: SelectCoursesProps) => {
    const [displaySearchBar, setDisplaySearchBar] = useState(false);
    const [displayAddCourse, setDisplayAddCourse] = useState(false);
    const { courses, loading, addLayout, addCourse, fetchMore, error, ...restOfUseCourses } = useCourses();

    const searchInput = useTextInput({ defaultValue: '', callBackDelay: 500 }, restOfUseCourses.setSearchString);

    const [expandedCourse, setExpandedCourse] = useState<null | Course['id']>(null);
    const handleAddLayout = (courseId: number | string, layout: NewLayout) => {
        addLayout(courseId, layout);
    };
    const handleClickLayout = (layout: Layout, course: Course) => {
        if (onSelect) onSelect(layout, course);
    };
    const handleClickCourse = (courseId: Course['id'] | null) => {
        setExpandedCourse(courseId);
    };
    const handleAddCourse = (newCourseName: string) => {
        addCourse(newCourseName);
        setDisplayAddCourse(false);
    };
    const handleClickSearch = () => {
        const disp = !displaySearchBar;
        setDisplaySearchBar(disp);
    };
    if (!courses) return (
        <Loading />
    );
    if (error) return (
        <ErrorScreen errorMessage="Error" />
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
                autoFocus
            /> : null}
            <View style={tyyli.topButtons}>
                <Button icon="plus-thick" onPress={() => setDisplayAddCourse(true)} testID="AddCourseButton">Add Course</Button>
                <Button icon="magnify" onPress={handleClickSearch}>Search</Button>
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
                        onCourseClick={handleClickCourse}
                        expanded={expandedCourse}
                    />)
                }
            />
        </Container>
    );
};
const Separaattori = () => <View style={tyyli.separaattori} />;
const SingleCourse = ({ course, onAddLayout, onLayoutClick, onCourseClick, expanded }: SingleCourseProps) => {
    const handleCourseClick = () => {
        if (!onCourseClick) return;
        if (expanded === course.id) onCourseClick(null);
        else onCourseClick(course.id);
    };
    const titleStyles = [
        tyyli.title,
        (expanded === course.id && tyyli.opened),
        (expanded !== null && expanded !== course.id && tyyli.notOpened),
    ];
    return (
        <View style={tyyli.container}>
            <List.Accordion
                style={tyyli.container}
                title={course.name}
                titleStyle={titleStyles}
                description={course.layouts.length + ' layouts'}
                descriptionStyle={[titleStyles, { fontSize: 14 }]}
                testID='SingleCourse'
                onPress={handleCourseClick}
                expanded={expanded === course.id}
            >
                <SelectLayout course={course} onAddLayout={onAddLayout} onSelect={onLayoutClick} />
            </List.Accordion>
        </View>
    );
};

const tyyli = StyleSheet.create({
    container: {
        padding: 5,
        backgroundColor: '#fafafa'
    },
    title: {
        fontSize: 18,
    },
    notOpened: {
        opacity: 0.3,
    },
    opened: {
        fontSize: 20,
    },
    topButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 10,
    },
    separaattori: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)'
    }
});
export default SelectCourses;