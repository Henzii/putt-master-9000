import React from 'react'
import { Drawer } from 'react-native-paper'
import { View, Text, StyleSheet} from 'react-native'
import { Link } from 'react-router-native';

export default function Menu({ menuOpen }: { menuOpen: boolean }) {
    if (!menuOpen) return null;
    return (
        <View style={tyyli.root}>
            <Link to="/peli">
                <Text>Pelit</Text>
            </Link>
        </View>
    )
}

const tyyli = StyleSheet.create({
    root: {
        minWidth: '40%',
        height: '100%',
        backgroundColor: 'lightgray',
        position: 'absolute',
        left: 0,
        top: 70,
        zIndex: 10,
    }
})

