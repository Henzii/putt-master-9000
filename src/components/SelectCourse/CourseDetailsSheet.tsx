import React from 'react';
import { Course, Layout } from '../../types/course';
import { View, StyleSheet, ScrollView } from 'react-native';
import Sheet from '../Sheet';
import { Text, useTheme} from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Spacer from '../ThemedComponents/Spacer';
import SplitContainer from '../ThemedComponents/SplitContainer';
import { useDistanceUnit } from '@hooks/useDistanceUnit';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import Button from '@components/ThemedComponents/Button';


type Props = {
    course: Course
    open: boolean
    onClose: () => void
    onSelectLayout: (layout: Layout, course: Course) => void
}

const CourseDetailsSheet = ({course, open, onClose, onSelectLayout}: Props) => {
    const {colors} = useTheme();
    const handleLayoutSelect = (layout: Layout) => {
        onSelectLayout(layout, course);
    };

    const distanceString = useDistanceUnit(course.distance.meters);
    const styles = createStyles(colors);

    return (
        <Sheet open={open} onClose={onClose}>
            <Text variant="headlineMedium">{course.name}</Text>
            <View style={styles.row}>
                <Icon name="golf" size={18} color="#707070" />
                <Text>{course.layouts.length} layouts</Text>
            </View>
            <View style={styles.row}>
                <Icon name="map-marker-distance" size={18} color="#707070" />
                <Text>{distanceString} away</Text>
            </View>
            <ScrollView>
                <Spacer />
                <Text variant="titleLarge">Layouts</Text>
                {course.layouts.map(layout => <SingleLayout layout={layout} key={layout.id} onSelect={handleLayoutSelect} />)}
            </ScrollView>
        </Sheet>
    );
};

const SingleLayout = ({layout, onSelect}: {layout: Layout, onSelect: (layout: Layout) => void}) => {
    const {colors} = useTheme();
    const handleSelectClick = () => {
        onSelect(layout);
    };
    const styles = createStyles(colors);
    return (
        <View style={styles.layout}>
            <SplitContainer>
                <View style={{flexShrink: 1}}>
                    <Text style={styles.layoutName} numberOfLines={2}>{layout.name}</Text>
                    <Text>{layout.holes} holes, par {layout.par}</Text>
                    <Text numberOfLines={2}>{layout.pars.join(',')}</Text>
                </View>
                <View>
                    <Button variant="secondary" onPress={handleSelectClick}>Select</Button>
                </View>
            </SplitContainer>
        </View>
    );
};

const createStyles = (colors: MD3Colors) => StyleSheet.create({
    layout: {
        borderWidth: 0,
        backgroundColor: colors.surface,
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