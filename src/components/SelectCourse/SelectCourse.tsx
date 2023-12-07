import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Button, Modal, Searchbar, Portal, Headline, useTheme } from "react-native-paper";
import useCourses from "../../hooks/useCourses";
import useTextInput from "../../hooks/useTextInput";
import AddCourse from "../AddCourse";
import ErrorScreen from "../ErrorScreen";
import Loading from "../Loading";
import Container from "../ThemedComponents/Container";
import SingleCourse from './SingleCourse';
import { Coordinates, Course, Layout, NewLayout } from "../../types/course";

type SelectCoursesProps = {
    onSelect?: (layout: Layout, course: Course) => void,
    title?: string,
    showDistance?: boolean,
    showTraffic?: boolean,
}
const SelectCourses = ({ onSelect, title, showDistance = true }: SelectCoursesProps) => {
    const [displaySearchBar, setDisplaySearchBar] = useState(false);
    const [displayAddCourse, setDisplayAddCourse] = useState(false);
    const { courses, loading, addLayout, addCourse, fetchMore, error, gpsAvailable, ...restOfUseCourses } = useCourses(showDistance);
    const searchInput = useTextInput({ defaultValue: '', callBackDelay: 500 }, restOfUseCourses.setSearchString);
    const [expandedCourse, setExpandedCourse] = useState<Course | null>(null);
    const ref = useRef<FlatList>(null);
    const { colors } = useTheme();

    useEffect(() => {
        if (expandedCourse) {
           setTimeout(() => ref.current?.scrollToItem({item: expandedCourse, animated: true, viewOffset: 5}), 300);
        }
    }, [expandedCourse]);

    const handleAddLayout = (courseId: number | string, layout: NewLayout) => {
        addLayout(courseId, layout);
    };
    const handleClickLayout = (layout: Layout, course: Course) => {
        if (onSelect) onSelect(layout, course);
    };
    const handleClickCourse = (course: Course | null) => {
        setExpandedCourse(course ?? null);
    };
    const handleAddCourse = (newCourseName: string, coordinates: Coordinates) => {
        addCourse(newCourseName, coordinates);
        setDisplayAddCourse(false);
    };
    const handleClickSearch = () => {
        if (!displaySearchBar) {
            setDisplaySearchBar(true);
            setExpandedCourse(null);
            ref.current?.scrollToIndex({index: 0});
        } else setDisplaySearchBar(false);
    };
    if (error) return (
        <ErrorScreen errorMessage={error.message} />
    );

    if (!courses) return (
        <Loading loadingText="Loading courses..." />
    );
    return (
        <Container noPadding>
            <Portal>
                <Modal
                    visible={displayAddCourse}
                    onDismiss={() => setDisplayAddCourse(false)}
                    contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    {displayAddCourse && <AddCourse
                        onCancel={() => setDisplayAddCourse(false)}
                        onAdd={handleAddCourse}
                        loading={loading}
                    />}
                </Modal>
            </Portal>
            {title ? <Headline style={{ padding: 10, backgroundColor: colors.surface }}>
                {(expandedCourse ? 'Select layout' : title)}
            </Headline> : null}
            <View style={tyyli.topButtons}>
                <Button mode="outlined" icon="text-box-plus-outline" onPress={() => setDisplayAddCourse(true)} testID="AddCourseButton">Add Course</Button>
                <Button mode="outlined" icon="magnify" onPress={handleClickSearch}>Search</Button>
            </View>
            {displaySearchBar ? <Searchbar
                autoComplete='off'
                {...searchInput}
                autoFocus
            /> : null}
            <Shadow borderColor={colors.primary} />
            <FlatList
                ref={ref}
                data={courses}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tyyli.container}
                keyExtractor={(item) => item.id as string}
                onScrollToIndexFailed={() => null}
                ListFooterComponent={
                    (loading)
                        ? <Loading noFullScreen loadingText="" />
                    : <Text style={{ color: 'rgba(0,0,0,0.2)' }}>    No more... No más...</Text>
                }
                onEndReached={fetchMore}
                onEndReachedThreshold={0.1}
                renderItem={({ item, index }) => (
                    <SingleCourse
                        course={item}
                        listIndex={index}
                        onAddLayout={handleAddLayout}
                        onLayoutClick={handleClickLayout}
                        onCourseClick={handleClickCourse}
                        expanded={expandedCourse?.id === item.id}
                        dimmed={Boolean(expandedCourse && expandedCourse?.id !== item.id)}
                        showDistance={gpsAvailable}
                    />)
                }
            />
        </Container>
    );
};

const Shadow = ({borderColor}: {borderColor: string}) => <View style={[tyyli.shadow, {borderColor}]} />;

const tyyli = StyleSheet.create({
    container: {
        paddingTop: 10
    },
    topButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    shadow: {
        backgroundColor: '#13131320',
        position: 'relative',
        bottom: -5,
        height: 5,
        zIndex: 999,
        opacity: 1,
        borderTopWidth: 1
    }
});
export default SelectCourses;