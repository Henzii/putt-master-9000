import React from 'react';
import { Course, Layout } from '../../types/course';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Sheet from '../Sheet';
import { Button, Headline } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Spacer from '../ThemedComponents/Spacer';
import SplitContainer from '../ThemedComponents/SplitContainer';


type Props = {
    course: Course
    open: boolean
    onClose: () => void
    onSelectLayout: (layout: Layout, course: Course) => void
}

const CourseDetailsSheet = ({course, open, onClose, onSelectLayout}: Props) => {
    const handleLayoutSelect = (layout: Layout) => {
        onSelectLayout(layout, course);
    };

    return (
        <Sheet open={open} onClose={onClose}>
            <Headline style={styles.courseName}>{course.name}</Headline>
            <View style={styles.row}>
                <Icon name="golf" size={18} color="#707070" />
                <Text>{course.layouts.length} layouts</Text>
            </View>
            <View style={styles.row}>
                <Icon name="map-marker-distance" size={18} color="#707070" />
                <Text>{course.distance.string} away</Text>
            </View>
            <ScrollView>
                <Spacer />
                <Headline>Layouts</Headline>
                {course.layouts.map(layout => <SingleLayout layout={layout} key={layout.id} onSelect={handleLayoutSelect} />)}
            </ScrollView>
        </Sheet>
    );
};

const SingleLayout = ({layout, onSelect}: {layout: Layout, onSelect: (layout: Layout) => void}) => {
    const handleSelectClick = () => {
        onSelect(layout);
    };
    return (
        <View style={styles.layout}>
            <SplitContainer>
                <View style={{flexShrink: 1}}>
                    <Text style={styles.layoutName} numberOfLines={2}>{layout.name}</Text>
                    <Text>{layout.holes} holes, par {layout.par}</Text>
                    <Text numberOfLines={2}>{layout.pars.join(',')}</Text>
                </View>
                <View>
                    <Button onPress={handleSelectClick}>Select</Button>
                </View>
            </SplitContainer>
        </View>
    );
};

const styles = StyleSheet.create({
    courseName: {
        fontSize: 30,
        fontWeight: '600'
    },
    layout: {
        borderWidth: 0,
        backgroundColor: 'white',
        elevation: 3,
        marginBottom: 5,
        marginTop: 5,
        padding: 8,
        borderRadius: 2,
    },
    layoutName: {
        fontSize: 16,
        fontWeight: '600'
    },
    row: {
        flexDirection: 'row',
        gap: 5
    }
});

export default CourseDetailsSheet;