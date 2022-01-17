import React, { useState } from "react";
import { View, Text, FlatList, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";
import { Button, Headline, Modal, Paragraph, Portal, Subheading } from 'react-native-paper'
import useCourses, { Layout } from "../hooks/useCourses";
import AddLayout from "./AddLayout";

const SelectLayout = ({ courseId, onSelect }: SelecLayoutProps) => {
    const courses = useCourses(courseId);
    const [ addLayoutModal, setAddLayoutModal ] = useState(false)
    if (!courses) return (
        <View>
            <Text>Loading...</Text>
        </View>
    )
    const course = courses[0]
    return (
        <View style={tyyli.main}>
            <Portal>
                <Modal
                    visible={addLayoutModal}
                    onDismiss={() => setAddLayoutModal(false)}
                    contentContainerStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >   
                    <AddLayout onCancel={() => setAddLayoutModal(false) }/>
                </Modal>
            </Portal>
            <Headline style={{ padding: 10 }}>{course.name}</Headline>
            <Button icon="plus-thick" onPress={() => setAddLayoutModal(true)}>Add layout</Button>
            <FlatList
                data={course.layouts}
                renderItem={({ item }: ListRenderItemInfo<Layout>) => (
                    <LayoutElement layout={item} onSelect={onSelect} />
                )}
                ItemSeparatorComponent={SeparatorComponent}
            />
        </View>
    )
}

const LayoutElement = ({ layout, onSelect }: { layout: Layout, onSelect?: (id: number | string) => void }) => {
    const handleClick = () => {
        if (onSelect) onSelect(layout.id)
    }
    return (
        <Pressable onPress={handleClick}>
            <View style={tyyli.item}>
                <View style={tyyli.itemSplit}>
                    <Subheading>{layout.name}</Subheading>
                    <Subheading>Par {layout.par}</Subheading>
                </View>
                <Text>
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
    },
    item: {
        padding: 20,
        minHeight: 20,
        backgroundColor: '#fafafa',
    },
    itemSplit: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    separator: {
        width: '100%',
        minHeight: 2,
        backgroundColor: '#efefef'
    }
})
type SelecLayoutProps = {
    courseId: string | number,
    onSelect?: (id: number | string) => void,
}

export default SelectLayout;