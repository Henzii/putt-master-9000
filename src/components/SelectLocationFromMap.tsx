import React, { useState } from 'react';
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Button, Portal } from 'react-native-paper';
import { theme } from '../utils/theme';

type Props = {
    onDismiss: () => void;
    initialRegion: Region;
    onSelect: (region: Region) => void;
}

const SelectLocationFromMap = ({ onDismiss, initialRegion, onSelect }: Props) => {
    const [region, setRegion] = useState<Region>(initialRegion);
    return (
        <Portal>
            <View>
                <MapView
                    style={styles.container}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={initialRegion}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    onRegionChange={(region) => setRegion(region)}
                    zoomControlEnabled={true}
                    scrollEnabled={true}
                >
                    <Marker
                        coordinate={{
                            latitude: region?.latitude ?? 0,
                            longitude: region?.longitude ?? 0,
                        }}
                        />
                </MapView>
                    <View style={{position: 'absolute', bottom: 20, width: '90%', zIndex: 999, gap: 8, alignItems: 'center'}}>
                        <Text style={{backgroundColor: theme.colors.background, padding: 8, borderRadius: 100}}>{region.latitude.toFixed(3)}, {region.longitude.toFixed(3)}</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: '100%'}}>
                            <Button mode="contained" onPress={(() => onSelect(region))}>Select</Button>
                            <Button mode="contained-tonal" onPress={onDismiss}>Cancel</Button>
                        </View>
                    </View>
            </View>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    }
});

export default SelectLocationFromMap;