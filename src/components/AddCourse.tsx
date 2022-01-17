import React, { useState } from "react"
import { View, Text, StyleSheet, TextInputChangeEventData } from "react-native"
import { Caption, TextInput, Title } from "react-native-paper"

const AddCourse = (props: AddCourseProps) => {
    return (
        <View style={tyyli.root}>
            <Title style={{ fontSize: 20 }}>Add Course</Title>
            <Caption>Name:</Caption>
            <TextInput autoComplete={false} placeholder="Course name"/>
            <Caption>Layout name:</Caption>
            <TextInput autoComplete={false} placeholder="Layout name"/>
        </View>
    )
}
const tyyli = StyleSheet.create({
    root: {
        width: '90%',
        height: '90%',
        backgroundColor: '#fff',
        padding: 20,
    }
})
type AddCourseProps = {

}

export default AddCourse;
