import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Modal, Searchbar, Portal, useTheme, IconButton, Text } from "react-native-paper";
import useCourses from "../../hooks/useCourses";
import useTextInput from "../../hooks/useTextInput";
import AddCourse from "../AddCourse";
import ErrorScreen from "../ErrorScreen";
import Loading from "../Loading";
import SingleCourse from './SingleCourse';
import { Coordinates, Course, Layout, NewLayout } from "../../types/course";
import { useBackButton } from "../BackButtonProvider";
import useMe from "../../hooks/useMe";
import useLiveData from "../../hooks/useLiveData";
import SelectCourseMap from "./SelectCourseMap";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import SplitContainer from "../ThemedComponents/SplitContainer";
import Header from "../RoundedHeader/Header";
import HeaderButton from "../RoundedHeader/HeaderButton";
import Spacer from "../ThemedComponents/Spacer";

type SelectCoursesProps = {
    onSelect?: (layout: Layout, course: Course) => void,
    title?: string,
    showDistance?: boolean,
    showTraffic?: boolean,
    onBackAction?: () => void
}
const SelectCourses = ({ onSelect, onBackAction, title, showDistance = true, showTraffic }: SelectCoursesProps) => {
    const [displaySearchBar, setDisplaySearchBar] = useState(false);
    const [displayAddCourse, setDisplayAddCourse] = useState(false);
    const [displayMap, setDisplayMap] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState<Course>();
    const { courses, loading, addLayout, addCourse, fetchMore, error, gpsAvailable, ...restOfUseCourses } = useCourses(showDistance);
    const searchInput = useTextInput({ defaultValue: '', callBackDelay: 500 }, restOfUseCourses.setSearchString);
    const [expandedCourse, setExpandedCourse] = useState<Course | null>(null);
    const ref = useRef<FlatList>(null);
    const { colors } = useTheme();
    const backButton = useBackButton();
    const { isAdmin } = useMe();
    const liveData = useLiveData(showTraffic);
    const styles = createStyles(colors);
    const [headerSpacing, setHeaderSpacing] = useState(50);

    useEffect(() => {
        if (onBackAction) {
            backButton.setCallBack(onBackAction);
        }
        return () => backButton.setCallBack(undefined);
    }, []);

    useEffect(() => {
        if (expandedCourse) {
            setTimeout(() => ref.current?.scrollToItem({ item: expandedCourse, animated: true, viewOffset: headerSpacing * 2 }), 300);
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

    const handleAddCourse = (newCourseName: string, coordinates: Coordinates, courseId?: string) => {
        addCourse(newCourseName, coordinates, courseId);
        setDisplayAddCourse(false);
    };

    const handleClickSearch = () => {
        if (!displaySearchBar) {
            setDisplaySearchBar(true);
            setExpandedCourse(null);
            ref.current?.scrollToIndex({ index: 0 });
        } else setDisplaySearchBar(false);
    };

    const handleEditCourse = (course: Course) => {
        setCourseToEdit(course);
        setDisplayAddCourse(true);
    };

    const handleAddCourseClick = () => {
        if (courseToEdit) setCourseToEdit(undefined);
        setDisplayAddCourse(true);
    };

    if (error) return (
        <ErrorScreen errorMessage={error.message} />
    );

    if (displayMap) {
        return <SelectCourseMap onClose={() => setDisplayMap(false)} onSelectLayout={handleClickLayout} />;
    }


    return (
        <View>
            <Portal>
                <Modal
                    visible={displayAddCourse}
                    onDismiss={() => setDisplayAddCourse(false)}
                    contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    {displayAddCourse && <AddCourse
                        onCancel={() => setDisplayAddCourse(false)}
                        onAdd={handleAddCourse}
                        course={courseToEdit}
                        loading={loading}
                    />}
                </Modal>
            </Portal>
            <Header setSpacing={setHeaderSpacing} bottomSize={30}>
                {title ? <Text variant="headlineSmall" style={styles.title}>
                    {(expandedCourse ? 'Select layout' : title)}
                </Text> : null}
                <SplitContainer>
                    <HeaderButton icon="plus" onPress={handleAddCourseClick} testID="AddCourseButton">Add Course</HeaderButton>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <IconButton icon="magnify" onPress={handleClickSearch} mode="contained" containerColor={colors.tertiary} />
                            <IconButton icon="map-outline" onPress={() => setDisplayMap(true)} mode="contained" containerColor={colors.tertiary} />
                        </View>
                    </View>
                </SplitContainer>
                {displaySearchBar ? (
                    <>
                        <Spacer size={5} />
                        <Searchbar
                            autoComplete='off'
                            {...searchInput}
                            autoFocus
                        />
                    </>
                ) : null}
            </Header>
            {!courses && loading ? (
                <Loading loadingText="Loading courses..." />
            ) : (
                <FlatList
                    ref={ref}
                    data={courses}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.container, { paddingVertical: headerSpacing * 2 - 10 }]}
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
                            onEditCoursePress={() => handleEditCourse(item)}
                            expanded={expandedCourse?.id === item.id}
                            dimmed={Boolean(expandedCourse && expandedCourse?.id !== item.id)}
                            showDistance={gpsAvailable}
                            isAdmin={isAdmin()}
                            liveData={liveData}
                        />)
                    }
                />
            )}
        </View>
    );
};

const createStyles = (colors: MD3Colors) => StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
    },
    title: {
        color: 'white',
        paddingBottom: 10
    }
});
export default SelectCourses;