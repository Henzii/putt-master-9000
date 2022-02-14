import React, { useState } from "react"
import { useMutation } from "react-apollo"
import { View, Text, StyleSheet, TextInputChangeEventData } from "react-native"
import { Button, Caption, TextInput, Title } from "react-native-paper"

const AddCourse = ({onCancel, onAdd}: AddCourseProps) => {
    const [newName, setNewName] = useState('')
    const handleAddCourse = () => {
        if (onAdd) onAdd(newName)
    }
    return (
        <View style={tyyli.root}>
            <Title style={{ fontSize: 20 }} testID="AddCourseTitle">Add Course</Title>
            <Caption>Name:</Caption>
            <TextInput value={newName} autoComplete={false} placeholder="Course name" onChangeText={(value) => setNewName(value)}/>
            <View style={tyyli.split}>
                <Button icon="check" onPress={handleAddCourse} mode="contained" color='green'>Add</Button>
                <Button icon="cancel" onPress={onCancel} mode="contained" color='red'>Cancel</Button>
            </View>
        </View>
    )
}
const tyyli = StyleSheet.create({
    root: {
        width: '90%',
        height: '90%',
        backgroundColor: '#fff',
        padding: 20,
    },
    split: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        margin: 20,
    }
})
type AddCourseProps = {
    onCancel?: () => void,
    onAdd?: (name: string) => void,
}

export default AddCourse;
