import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Button, Modal, Searchbar, Portal, List, Headline, useTheme } from "react-native-paper";
import useCourses, { Coordinates, Course, Layout, NewLayout } from "../hooks/useCourses";
import useLiveData from '../hooks/useLiveData';
import useTextInput from "../hooks/useTextInput";
import AddCourse from "./AddCourse";
import CoursesMap from "./CoursesMap";
import ErrorScreen from "./ErrorScreen";
import Loading from "./Loading";
import SelectLayout from "./SelectLayout";
import Container from "./ThemedComponents/Container";

type SelectCoursesProps = {
    onSelect?: (layout: Layout, course: Course) => void,
    title?: string,
    showDistance?: boolean,
    showTraffic?: boolean,
}
const SelectCourses = ({ onSelect, title, showTraffic = true, showDistance = true }: SelectCoursesProps) => {
    const [displaySearchBar, setDisplaySearchBar] = useState(false);
    const [displayAddCourse, setDisplayAddCourse] = useState(false);
    const [displayMap, setDisplayMap] = useState(false);
    const { courses, loading, addLayout, addCourse, fetchMore, error, gpsAvailable, ...restOfUseCourses } = useCourses(showDistance);
    const liveData = useLiveData(showTraffic);
    const searchInput = useTextInput({ defaultValue: '', callBackDelay: 500 }, restOfUseCourses.setSearchString);
    const [expandedCourse, setExpandedCourse] = useState<null | Course['id']>(null);
    const { colors } = useTheme();

    const handleAddLayout = (courseId: number | string, layout: NewLayout) => {
        addLayout(courseId, layout);
    };
    const handleClickLayout = (layout: Layout, course: Course) => {
        if (onSelect) onSelect(layout, course);
    };
    const handleClickCourse = (courseId: Course['id'] | null) => {
        setExpandedCourse(courseId);
    };
    const handleAddCourse = (newCourseName: string, coordinates: Coordinates) => {
        addCourse(newCourseName, coordinates);
        setDisplayAddCourse(false);
    };
    const handleClickSearch = () => {
        const disp = !displaySearchBar;
        setDisplaySearchBar(disp);
    };
    const handleDistanceChnage = (dist: string) => {
        const distInt = Number.parseInt(dist);
        if (isNaN(distInt)) return;
        restOfUseCourses.setSearchLimits({
            limit: 500,
            offset: 0,
            maxDistance: distInt*1000
        });
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
                    visible={displayMap}
                    onDismiss={() => setDisplayMap(false)}
                >
                    <CoursesMap
                        gps={restOfUseCourses.gps}
                        courses={courses}
                        onClose={() => setDisplayMap(false)}
                        onDistanceChange={handleDistanceChnage}
                    />
                </Modal>
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
            {displaySearchBar ? <Searchbar
                autoComplete={false}
                {...searchInput}
                autoFocus
            /> : null}
            <View style={tyyli.topButtons}>
                <Button icon="plus-thick" onPress={() => setDisplayAddCourse(true)} testID="AddCourseButton">Add Course</Button>
                <Button icon="magnify" onPress={handleClickSearch}>Search</Button>
                <Button disabled={!gpsAvailable} icon="map" onPress={() => setDisplayMap(true)}>Map</Button>
            </View>
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id as string}
                ItemSeparatorComponent={Separaattori}
                ListFooterComponent={
                    (loading)
                        ? <Loading noFullScreen loadingText="" />
                    : (restOfUseCourses.restricted)
                        ? (
                            <View style={{ alignItems: 'center'}}>
                                <Text>Search results restricted by Map view</Text>
                                <Button
                                    onPress={() => {
                                        restOfUseCourses.setSearchLimits({
                                            limit: 500,
                                            offset: 0,
                                            maxDistance: undefined
                                        });
                                    }}
                                >Clear restrictions</Button>
                            </View>
                        )
                    : <Text style={{ color: 'rgba(0,0,0,0.2)' }}>    No more... No más...</Text>
                }
                onEndReached={fetchMore}
                onEndReachedThreshold={0.1}
                renderItem={({ item }) => (
                    <SingleCourse
                        course={item}
                        liveData={liveData ? liveData[item.name] : undefined}
                        onAddLayout={handleAddLayout}
                        onLayoutClick={handleClickLayout}
                        onCourseClick={handleClickCourse}
                        expanded={expandedCourse}
                        showDistance={gpsAvailable}
                    />)
                }
            />
        </Container>
    );
};
const Separaattori = () => <View style={tyyli.separaattori} />;

type SingleCourseProps = {
    course: Course,
    onAddLayout?: (courseId: number | string, layout: NewLayout) => void,
    onLayoutClick?: (layout: Layout, course: Course) => void,
    onCourseClick?: (courseId: Course['id'] | null) => void,
    expanded: Course['id'] | null,
    showDistance?: boolean,
    liveData?: { live: number, today: number },
}

const SingleCourse = ({ course, onAddLayout, onLayoutClick, onCourseClick, expanded, showDistance = true, liveData }: SingleCourseProps) => {
    const handleCourseClick = () => {
        if (!onCourseClick) return;
        if (expanded === course.id) onCourseClick(null);
        else onCourseClick(course.id);
    };
    const InfoIcons = () => {
        return (
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {liveData && <LiveDataIcon live={liveData} />}
                {showDistance && <CourseDistanceIcon distance={course.distance} />}
            </View>
        );
    };
    let description = course.layouts.length + ' layout' + (course.layouts.length !== 1 ? 's' : '');
    const selected = expanded === course.id;
    // Jos rata on avattu & liveDataa tarjolla, lisätään se descriptioniin
    if (selected && liveData) {
        description = description.concat(`\n${liveData.live} / ${liveData.today}`);
    }
    return (
        <View style={[
            tyyli.container,
            (expanded !== null && !selected) && { opacity: 0.2 },
            course.canEdit && tyyli.owned,
            selected && { elevation: 4 },
        ]}>
            <List.Accordion
                style={[tyyli.accordion]}
                title={course.name}
                titleStyle={[tyyli.title, selected && tyyli.opened]}
                description={description}
                descriptionNumberOfLines={3}
                right={InfoIcons}
                descriptionStyle={[tyyli.title, { fontSize: 14 }]}
                testID='SingleCourse'
                onPress={handleCourseClick}
                expanded={expanded === course.id}
            >
                <SelectLayout course={course} onAddLayout={onAddLayout} onSelect={onLayoutClick} />
            </List.Accordion>
        </View>
    );
};
const CourseDistanceIcon = ({ distance }: { distance: { string: string } }) => {
    return (<View style={{ display: 'flex', flexDirection: 'column' }}>
        <List.Icon
            style={tyyli.tight}
            color='gray'
            icon="map-marker-distance" />
        <Text style={tyyli.tight}>{distance.string || '?'}</Text>
    </View>);
};
const LiveDataIcon = ({ live }: { live: { today: number, live: number } }) => {
    const icon = (live.live === 0) ? 'signal-cellular-outline'
        : (live.live > 40) ? 'signal-cellular-3'
            : (live.live > 15) ? 'signal-cellular-2'
                : (live.live > 0) ? 'signal-cellular-1'
                    : 'signal-off';
    return (
        <List.Icon
            style={tyyli.tight}
            icon={icon}
            color='gray'
        />
    );
};
const tyyli = StyleSheet.create({
    container: {
        padding: 5,
        marginHorizontal: 6,
        backgroundColor: '#fefefe',
        elevation: 1,
        borderRadius: 3,
    },
    accordion: {
        backgroundColor: '#fff'
    },
    owned: {
        borderWidth: 1,
        borderColor: 'rgba(0,255,0,0.2)',
    },
    title: {
        fontSize: 19,
    },
    notOpened: {
        opacity: 0.25,
    },
    opened: {
        fontSize: 20,
    },
    tight: {
        margin: 0,
        padding: 0,
        color: 'gray',
    },
    topButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 10,
    },
    separaattori: {
        height: 3,
    }
});
export default SelectCourses;