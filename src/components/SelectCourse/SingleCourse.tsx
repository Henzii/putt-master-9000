import React, { useState } from 'react';
import { View, StyleSheet, Text } from "react-native";
import { Button, List, Modal, Portal, Surface, TouchableRipple, useTheme } from "react-native-paper";
import { Course, Layout, NewLayout } from "../../types/course";
import SelectLayout from "./SelectLayout";
import AddLayout from '../AddLayout';
import ExtraMenu from './ExtraMenu';

type SingleCourseProps = {
    course: Course,
    onAddLayout?: (courseId: number | string, layout: NewLayout) => void,
    onEditCoursePress: () => void
    onLayoutClick?: (layout: Layout, course: Course) => void,
    onCourseClick?: (course: Course | null, listIndex?: number) => void,
    expanded: boolean,
    dimmed: boolean,
    listIndex: number
    showDistance?: boolean,
    isAdmin: boolean
}

const SingleCourse = ({ course, onAddLayout, onLayoutClick, onCourseClick, onEditCoursePress, expanded, dimmed, listIndex, isAdmin, showDistance = true}: SingleCourseProps) => {
    const { colors } = useTheme();
    const [addLayoutModal, setAddLayoutModal] = useState(false);
    const [layoutToEdit, setLayoutToEdit] = useState<Layout>();
    const handleCourseClick = () => {
        if (!onCourseClick) return;
        if (expanded) onCourseClick(null);
        else onCourseClick(course, listIndex);
    };

    const handleAddLayoutClick = () => {
        if (layoutToEdit) setLayoutToEdit(undefined);
        setAddLayoutModal(true);
    };

    const addLayout = (layout: NewLayout) => {
        onAddLayout?.(course.id, layout);
        setAddLayoutModal(false);
    };

    const handleEditLayout = (layout: Layout) => {
        setLayoutToEdit(layout);
        setAddLayoutModal(true);
    };

    const description = course.layouts.length + ' layout' + (course.layouts.length !== 1 ? 's' : '');

    return (
        <Surface
            style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.primary }, dimmed && styles.notSelected]}
        >
              <Portal>
                <Modal
                    visible={addLayoutModal}
                    onDismiss={() => setAddLayoutModal(false)}
                    contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <AddLayout
                        onCancel={() => setAddLayoutModal(false)}
                        onAdd={addLayout}
                        layout={layoutToEdit}
                    />
                </Modal>
            </Portal>
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

            {expanded && (
                <View>
                    <SelectLayout course={course} onSelect={onLayoutClick} onEditLayout={handleEditLayout} />
                    <View style={styles.bottomButtons}>
                        <Button onPress={handleAddLayoutClick} mode='outlined' icon="text-box-plus-outline" uppercase={false}>Add layout</Button>
                        {(course.canEdit || isAdmin) && <ExtraMenu course={course} onEditCoursePress={onEditCoursePress} />}
                    </View>
                </View>
            )}
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
    bottomButtons: {
        marginTop: 12,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default SingleCourse;
