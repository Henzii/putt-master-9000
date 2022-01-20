import React, { useState } from "react";
import { View, Text, FlatList, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";
import { Button, Headline, Modal, Paragraph, Portal, Subheading } from 'react-native-paper'
import useCourses, { Course, Layout, NewLayout } from "../hooks/useCourses";
import AddLayout from "./AddLayout";

const SelectLayout = ({ course, onSelect, onAddLayout }: SelecLayoutProps) => {
    const [ addLayoutModal, setAddLayoutModal ] = useState(false)
    const handleAddLayout = (layout: NewLayout) => {
        if (onAddLayout) onAddLayout(course.id, layout);
        setAddLayoutModal(false);
    }
    const handleLayoutSelect = (layout: Layout) => {
        if (onSelect) onSelect(layout, course)
    }
    return (
        <View style={tyyli.main}>
            <Portal>
                <Modal
                    visible={addLayoutModal}
                    onDismiss={() => setAddLayoutModal(false)}
                    contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >   
                    <AddLayout onCancel={() => setAddLayoutModal(false) } onAdd={handleAddLayout}/>
                </Modal>
            </Portal>
            <Button icon="plus-thick" onPress={() => setAddLayoutModal(true)}>Add layout</Button>
            <FlatList
                data={course.layouts}
                renderItem={({ item }: ListRenderItemInfo<Layout>) => (
                    <LayoutElement key={item.id} layout={item} onSelect={handleLayoutSelect} />
                )}
                ItemSeparatorComponent={SeparatorComponent}
            />
        </View>
    )
}

const LayoutElement = ({ layout, onSelect }: { layout: Layout, onSelect?: (layout: Layout) => void }) => {
    const handleClick = () => {
        if (onSelect) onSelect(layout)
    }
    return (
        <Pressable onPress={handleClick}>
            <View style={tyyli.item}>
                <View style={tyyli.itemSplit}>
                    <Subheading>{layout.name}</Subheading>
                    <Subheading>Par {layout.par}</Subheading>
                </View>
                <Text style={tyyli.pars}>
                    {layout.pars.join(' ')}
                </Text>
            </View>
        </Pressable>
    )
}
const SeparatorComponent = () => {
    return (
        <View style={tyyli.separator} />
    )
}
var tyyli = StyleSheet.create({
    main: {
        width: '100%',
        marginRight: 5,
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: 'lightgray',
    },
    item: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        minHeight: 20,
        backgroundColor: '#fcfcfc',

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
})
type SelecLayoutProps = {
    course: Course
    onSelect?: (layout: Layout, course: Course) => void,
    onAddLayout?: (courseId: number | string, layout: NewLayout) => void,
}

export default SelectLayout;