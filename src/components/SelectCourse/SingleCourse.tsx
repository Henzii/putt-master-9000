import React, { useState } from 'react';
import { View, StyleSheet, Text } from "react-native";
import { Button, List, Modal, Portal, TouchableRipple } from "react-native-paper";
import { Course, Layout, NewLayout } from "../../types/course";
import SelectLayout from "./SelectLayout";
import AddLayout from '../AddLayout';
import ExtraMenu from './ExtraMenu';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LiveData } from '../../hooks/useLiveData';
import { theme } from '../../utils/theme';

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
    liveData?: LiveData[]
}

const SingleCourse = ({ course, onAddLayout, onLayoutClick, onCourseClick, onEditCoursePress, expanded, dimmed, listIndex, isAdmin, showDistance = true, liveData}: SingleCourseProps) => {
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
    const courseLiveData = liveData?.find(liveCourse => liveCourse.name.includes(course.name));

    return (
        <View
            style={[styles.container, dimmed && styles.notSelected, expanded && styles.expanded]}
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
                        <View>
                        <Text style={styles.layouts}>{description}</Text>
                        <View style={styles.extraInfo}>
                            {showDistance && (
                                <View style={styles.distance}>
                                    <Icon name="map-marker-distance" size={18} color="gray" />
                                    <Text style={styles.iconText}>{course.distance.string}</Text>
                                </View>
                            )}
                            {courseLiveData && (
                                <View style={styles.distance}>
                                    <Icon name={getLiveIcon(courseLiveData.liveNow)} size={18} color="gray" />
                                    <Text style={styles.iconText}>{courseLiveData.liveNow} ({courseLiveData.liveToday})</Text>
                                </View>
                            )}
                        </View>
                        </View>
                    </View>
                    <View>
                        <List.Icon icon={expanded ? 'chevron-up' : 'chevron-down'} style={{height: 24, marginRight: 0}} />
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
        </View>
    );
};

const styles = StyleSheet.create({
    notSelected: {
        opacity: 0.4
    },
    container: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginHorizontal: 3,
        marginVertical: 3,
        elevation: 1,
        minHeight: 77,
        backgroundColor: '#fff',
    },
    expanded: {
        backgroundColor: theme.colors.elevation.level4,
        elevation: 4
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    courseName: {
        fontSize: 20,
    },
    layouts: {
        fontSize: 14,
        color: '#808080',
        marginRight: 10
    },
    extraInfo: {
        flexDirection: 'row',
        gap: 5,
        marginTop: 2,
    },
    distance: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginRight: 6,
    },
    iconText: {
        margin: 0,
        padding: 0,
        fontSize: 13,
        color: '#808080',

    },
    bottomButtons: {
        marginTop: 12,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    }
});

const getLiveIcon = (count: number) => {
    if (count < 10) return 'signal-cellular-outline';
    if (count < 30) return 'signal-cellular-1';
    if (count < 50) return 'signal-cellular-2';

    return 'signal-cellular-3';
};

export default SingleCourse;
