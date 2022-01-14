import React, { useState } from "react"
import { View, Text, StyleSheet, TextInputChangeEventData } from "react-native"
import { Caption, TextInput, Title } from "react-native-paper"

const AddCourse = (props: AddCourseProps) => {
    const [holes, setHoles] = useState<number | null>(null)
    const handleHolesChange = (text: unknown) => {
        const number = Number.parseInt(text as string)
        console.log(text, number)
        if (!isNaN(number)) {
            setHoles(number);
        } else {
            setHoles(null);
        }
    }
    return (
        <View style={tyyli.root}>
            <Title style={{ fontSize: 20 }}>Add Course</Title>
            <Caption>Name:</Caption>
            <TextInput autoComplete={false} placeholder="Course name"/>
            <Caption>Layout name:</Caption>
            <TextInput autoComplete={false} placeholder="Layout name"/>
            <Caption>Number of holes</Caption>
            <TextInput autoComplete={false}
                placeholder="Number of holes"
                keyboardType="numeric"
                value={''+ (holes || '')}
                onChangeText={handleHolesChange}
            />
            {holes && <HolesParList holes={holes} />}
        </View>
    )
}
const HolesParList = ({holes}: {holes: number}) => {
    const holeInputs = []
    for (let i=0;i<holes;i++) {
        holeInputs.push(
            <TextInput autoComplete={false} value={'3'} style={{ width: 50 }} />
        )
    }
    return (
        <>
            {holeInputs}
        </>
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
