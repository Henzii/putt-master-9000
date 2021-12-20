import { View, Text} from 'react-native';
import React from 'react';
import Player from './Plauyer';

export default function Peli() {
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start' }}> 
            <Text>Peli</Text>
            <Player name="Henkka" />
            <Player name="Jorma" />
            <Player name="Pnea" />
        </View>
    )
}