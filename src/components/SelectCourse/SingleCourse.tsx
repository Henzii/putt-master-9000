import React from 'react';
import { View, StyleSheet, Text } from "react-native";
import { List, Surface, TouchableRipple, useTheme } from "react-native-paper";
import { Course, Layout, NewLayout } from "../../hooks/useCourses";
import SelectLayout from "./SelectLayout";

type SingleCourseProps = {
    course: Course,
    onAddLayout?: (courseId: number | string, layout: NewLayout) => void,
    onLayoutClick?: (layout: Layout, course: Course) => void,
    onCourseClick?: (course: Course | null, listIndex?: number) => void,
    expanded: boolean,
    dimmed: boolean,
    listIndex: number
    showDistance?: boolean,
}

const SingleCourse = ({ course, onAddLayout, onLayoutClick, onCourseClick, expanded, dimmed, listIndex, showDistance = true}: SingleCourseProps) => {
    const { colors } = useTheme();
    const handleCourseClick = () => {
        if (!onCourseClick) return;
        if (expanded) onCourseClick(null);
        else onCourseClick(course, listIndex);
    };

    const description = course.layouts.length + ' layout' + (course.layouts.length !== 1 ? 's' : '');

    return (
        <Surface
            style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.primary }, dimmed && styles.notSelected]}
        >
            <TouchableRipple onPress={handleCourseClick}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.courseName}>{course.name}</Text>
                        <Text style={styles.layouts}>{`${description} layouts`}</Text>
                    </View>
                    {showDistance && (
                        <View style={styles.distance}>
                            <List.Icon icon="map-marker-distance" style={styles.icon} />
                            <Text style={styles.iconText}>{course.distance.string}</Text>
                        </View>
                    )}
                    <View>
                        <List.Icon icon={expanded ? 'chevron-up' : 'chevron-down'} style={styles.icon} />
                    </View>
                </View>
            </TouchableRipple>

            {expanded && <SelectLayout course={course} onSelect={onLayoutClick} onAddLayout={onAddLayout} />}
        </Surface>
    );
};

const styles = StyleSheet.create({
    notSelected: {
        opacity: 0.4
    },
    container: {
        borderRadius: 7,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginHorizontal: 6,
        marginVertical: 3,
        borderWidth: 1,
        elevation: 4,
        minHeight: 77,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    courseName: {
        fontSize: 18,
    },
    layouts: {
        fontSize: 14,
        color: '#808080'
    },
    distance: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexBasis: 70,
    },
    icon: {
        height: 24,
        width: 24,
        margin: 2
    },
    iconText: {
        textAlign: 'center',
        margin: 0,
        padding: 0,
    },

});

export default SingleCourse;
