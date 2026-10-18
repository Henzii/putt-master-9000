import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, TouchableRipple, useTheme, Text } from 'react-native-paper';
import Spacer from "../ThemedComponents/Spacer";
import Divider from "../ThemedComponents/Divider";
import { useNavigate } from "react-router-native";
import { useDispatch } from "react-redux";
import { setSelectedLayout } from "../../reducers/selectedLayoutReducer";
import { Course, Layout } from "../../types/course";
import { useAuthenticatedUser } from "src/context/AuthenticatedUserContext";
import { isAdmin } from "src/utils/user";
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

type SelecLayoutProps = {
    course: Course
    onSelect?: (layout: Layout, course: Course) => void,
    onEditLayout: (layout: Layout) => void
}

const SelectLayout = ({ course, onSelect, onEditLayout }: SelecLayoutProps) => {
    const navi = useNavigate();
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const user = useAuthenticatedUser();

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

            {layouts.map(layout => {
                const contentColor = layout.deprecated ? colors.onSurfaceVariant : colors.onPrimary;
                return (
                    <View
                        key={layout.id}
                        style={[{backgroundColor: layout.deprecated ? colors.surface : colors.primary}, styles.layout]}
                    >
                        {layout.deprecated && (
                            <View style={styles.deprecatedTextView}>
                                <Text style={[styles.deprecatedText, { color: colors.onSurfaceDisabled }]}>OBSOLETE</Text>
                            </View>
                        )}
                        <TouchableRipple onPress={() => handleLayoutSelect(layout)} style={{flex: 1}}>
                            <View>
                                <Text style={[styles.layoutName, { color: contentColor }]}>{layout.name}</Text>
                                <Text style={[styles.layoutInfo, { color: contentColor }]}>{layout.holes} holes, par {layout.par}</Text>
                                <Text style={[styles.layoutInfo, { color: contentColor }]}>{layout.pars.join(' ')}</Text>
                            </View>
                        </TouchableRipple>

                        <View style={styles.icons}>
                            {(layout.canEdit || isAdmin(user)) && <IconButton style={{marginRight: 2}} size={30} icon="file-edit-outline" iconColor={contentColor} onPress={() => onEditLayout(layout)} />}
                            <IconButton size={30} onPress={() => handleStatsClick(layout)} icon="chart-bar" iconColor={contentColor} style={{marginLeft: 0}} />
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const createStyles = (colors: MD3Colors) => StyleSheet.create({
    deprecatedTextView: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
        zIndex: 10,
        backgroundColor: colors.secondary,
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
        paddingHorizontal: 7,
        paddingVertical: 9,
        elevation: 4,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.outline,
        position: 'relative',
    },
    layoutName: {
        color: colors.onPrimary,
        fontSize: 18,
        fontWeight: '600'
    },
    layoutInfo: {
        color: colors.onPrimary,
        fontSize: 16,
    },
    icons: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
});

export default SelectLayout;
