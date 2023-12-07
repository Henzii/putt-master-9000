import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, IconButton, Modal, Portal, TouchableRipple, useTheme } from 'react-native-paper';
import AddLayout from "../AddLayout";
import Spacer from "../ThemedComponents/Spacer";
import Divider from "../ThemedComponents/Divider";
import useMe from "../../hooks/useMe";
import { useNavigate } from "react-router-native";
import { useDispatch } from "react-redux";
import { setSelectedLayout } from "../../reducers/selectedLayoutReducer";
import { Course, Layout, NewLayout } from "../../types/course";

type SelecLayoutProps = {
    course: Course
    onSelect?: (layout: Layout, course: Course) => void,
    onAddLayout?: (courseId: number | string, layout: NewLayout) => void,
}

const SelectLayout = ({ course, onSelect, onAddLayout }: SelecLayoutProps) => {
    const [addLayoutModal, setAddLayoutModal] = useState(false);
    const [editedLayout, setEditedLayout] = useState<Layout>();
    const navi = useNavigate();
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const {isAdmin} = useMe();
    const handleAddLayout = (layout: NewLayout) => {
        if (onAddLayout) onAddLayout(course.id, layout);
        setAddLayoutModal(false);

    };
    const handleLayoutSelect = (layout: Layout) => {
        if (onSelect) onSelect(layout, course);
    };
    const handleEditLayout = (layout: Layout) => {
        setEditedLayout(layout);
        setAddLayoutModal(true);
    };
    const handleStatsClick = (layout: Layout) => {
        dispatch(setSelectedLayout(course, layout));
        navi('/stats');
    };
    return (
        <View>
            <Portal>
                <Modal
                    visible={addLayoutModal}
                    onDismiss={() => setAddLayoutModal(false)}
                    contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <AddLayout
                        onCancel={() => setAddLayoutModal(false)}
                        onAdd={handleAddLayout}
                        layout={editedLayout}
                    />
                </Modal>
            </Portal>
            <Spacer size={5} />
            <Divider margin={3} opacity={1} />
            <Spacer size={5} />

            {course.layouts.map(layout => (
                <View key={layout.id} style={[{ backgroundColor: colors.primary }, styles.layout]}>
                    <TouchableRipple onPress={() => handleLayoutSelect(layout)} style={{flex: 1}}>
                        <View>
                            <Text style={styles.layoutName}>{layout.name}</Text>
                            <Text style={styles.layoutInfo}>{layout.holes} holes, par {layout.par}</Text>
                            <Text style={styles.layoutInfo}>{layout.pars.join(' ')}</Text>
                        </View>
                    </TouchableRipple>

                    <View style={styles.icons}>
                        {(layout.canEdit || isAdmin()) && <IconButton style={{marginRight: 2}} size={30} icon="file-edit-outline" color="white" onPress={() => handleEditLayout(layout)} />}
                        <IconButton size={30} onPress={() => handleStatsClick(layout)} icon="chart-bar" color="white" style={{marginLeft: 0}} />
                    </View>
                </View>
            ))}
            <View style={styles.buttons}>
                <Button onPress={() => setAddLayoutModal(true)} icon="text-box-plus-outline" uppercase={false} mode="outlined" style={styles.button}>Add layout</Button>

                {/* Not implemented*/}
                {(course.canEdit && false) && <Button icon="file-edit-outline" uppercase={false} mode="outlined" style={styles.button}>Edit course</Button>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    layout: {
        borderRadius: 7,
        marginTop: 4,
        elevation: 5,
        paddingHorizontal: 7,
        paddingVertical: 9,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#00000050'
    },
    layoutName: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600'
    },
    layoutInfo: {
        color: '#e0e0e0',
        fontSize: 16,
    },
    icons: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    buttons: {
        marginTop: 12,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    button: {
        borderWidth: 1,
    }
});

export default SelectLayout;
