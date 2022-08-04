import React, { useState } from "react";
import { View, Text, FlatList, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";
import { Button, Menu, Modal, Portal, Subheading, useTheme } from 'react-native-paper';
import { Course, Layout, NewLayout } from "../hooks/useCourses";
import AddLayout from "./AddLayout";

const SelectLayout = ({ course, onSelect, onAddLayout }: SelecLayoutProps) => {
    const [addLayoutModal, setAddLayoutModal] = useState(false);
    const [editedLayout, setEditedLayout] = useState<Layout>();
    const handleAddLayout = (layout: NewLayout) => {
        if (onAddLayout) onAddLayout(course.id, layout);
        setAddLayoutModal(false);

    };
    const handleLayoutSelect = (layout: Layout) => {
        if (onSelect) onSelect(layout, course);
    };
    const handleEditLaytou = (layout: Layout) => {
        setEditedLayout(layout);
        setAddLayoutModal(true);
    };
    return (
        <View style={tyyli.main}>
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
            <Button icon="plus-thick" onPress={() => setAddLayoutModal(true)}>Add layout</Button>
            <FlatList
                data={course.layouts}
                renderItem={({ item }: ListRenderItemInfo<Layout>) => (
                    <LayoutElement key={item.id} layout={item} onSelect={handleLayoutSelect} onEdit={handleEditLaytou} canEditCourse={course.canEdit} />
                )}
                ItemSeparatorComponent={SeparatorComponent}
            />
        </View>
    );
};
type LayoutElementProps = {
    layout: Layout,
    onSelect?: (layout: Layout) => void,
    onEdit?: (layout: Layout) => void,
    canEditCourse: boolean,
}
const LayoutElement = ({ layout, onSelect, onEdit, canEditCourse }: LayoutElementProps) => {
    const { colors } = useTheme();
    const [showMenu, setShowMenu] = useState(false);
    const handleClick = () => {
        if (onSelect) onSelect(layout);
    };
    const handleLongPress = () => {
        if (layout.canEdit || canEditCourse) setShowMenu(true);
    };
    const handleEditPress = () => {
        if (onEdit) onEdit(layout);
        setShowMenu(false);
    };
    const laytoutStyles = [
        tyyli.item,
        { backgroundColor: colors.surface },
        (layout.canEdit || canEditCourse) && tyyli.owned
    ];
    return (
        <Pressable onPress={handleClick} onLongPress={handleLongPress}>
            <Menu visible={showMenu} onDismiss={() => setShowMenu(false)}
                anchor={
                    <View style={laytoutStyles}>
                        <View style={tyyli.itemSplit}>
                            <Subheading>{layout.name}</Subheading>
                            <Subheading>Par {layout.par}</Subheading>
                        </View>
                        <Text style={tyyli.pars}>
                            {layout.pars.join(' ')}
                        </Text>
                    </View>

                }
            >
                <Menu.Item title="Edit" onPress={handleEditPress} />
            </Menu>
        </Pressable>
    );
};
const SeparatorComponent = () => {
    return (
        <View style={tyyli.separator} />
    );
};
const tyyli = StyleSheet.create({
    main: {
        width: '100%',
        marginBottom: 10,
    },
    owned: {
        borderWidth: 1,
        borderColor: 'rgba(0,255,0,0.2)',
    },
    item: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        minHeight: 20,
        borderRadius: 5,
        elevation: 1,
    },
    itemSplit: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pars: {
        color: 'gray',
    },
    separator: {
        width: '100%',
        minHeight: 2,
        backgroundColor: '#efefef'
    }
});
type SelecLayoutProps = {
    course: Course
    onSelect?: (layout: Layout, course: Course) => void,
    onAddLayout?: (courseId: number | string, layout: NewLayout) => void,
}

export default SelectLayout;
