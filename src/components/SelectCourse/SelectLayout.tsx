import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton, TouchableRipple, useTheme } from 'react-native-paper';
import Spacer from "../ThemedComponents/Spacer";
import Divider from "../ThemedComponents/Divider";
import useMe from "../../hooks/useMe";
import { useNavigate } from "react-router-native";
import { useDispatch } from "react-redux";
import { setSelectedLayout } from "../../reducers/selectedLayoutReducer";
import { Course, Layout } from "../../types/course";

type SelecLayoutProps = {
    course: Course
    onSelect?: (layout: Layout, course: Course) => void,
    onEditLayout: (layout: Layout) => void
}

const SelectLayout = ({ course, onSelect, onEditLayout }: SelecLayoutProps) => {
    const navi = useNavigate();
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const {isAdmin} = useMe();

    const handleLayoutSelect = (layout: Layout) => {
        if (onSelect) onSelect(layout, course);
    };

    const handleStatsClick = (layout: Layout) => {
        dispatch(setSelectedLayout(course, layout));
        navi('/stats');
    };

    const layouts = [...course.layouts].sort(a => a.deprecated ? 1 : -1);

    return (
        <View>
            <Spacer size={5} />
            <Divider margin={3} opacity={1} />
            <Spacer size={5} />

            {layouts.map(layout => (
                <View
                    key={layout.id}
                    style={[{backgroundColor: colors.primary}, styles.layout, layout.deprecated && styles.deprecatedLayout]}
                >
                    {layout.deprecated && (
                        <View style={styles.deprecatedTextView}>
                            <Text style={styles.deprecatedText}>OBSOLETE</Text>
                        </View>
                    )}
                    <TouchableRipple onPress={() => handleLayoutSelect(layout)} style={{flex: 1}}>
                        <View>
                            <Text style={styles.layoutName}>{layout.name}</Text>
                            <Text style={styles.layoutInfo}>{layout.holes} holes, par {layout.par}</Text>
                            <Text style={styles.layoutInfo}>{layout.pars.join(' ')}</Text>
                        </View>
                    </TouchableRipple>

                    <View style={styles.icons}>
                        {(layout.canEdit || isAdmin()) && <IconButton style={{marginRight: 2}} size={30} icon="file-edit-outline" color="white" onPress={() => onEditLayout(layout)} />}
                        <IconButton size={30} onPress={() => handleStatsClick(layout)} icon="chart-bar" color="white" style={{marginLeft: 0}} />
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    deprecatedLayout: {
        backgroundColor: '#999999',
        overlayColor: 'black'
    },
    deprecatedTextView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.2,
        marginHorizontal: 7,
        marginVertical: 9
    },
    deprecatedText: {
        fontSize: 40,
        transform: [
            {rotate: '-7deg'}
        ]
    },
    layout: {
        borderRadius: 7,
        marginTop: 4,
        elevation: 5,
        paddingHorizontal: 7,
        paddingVertical: 9,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#00000050',
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
});

export default SelectLayout;
