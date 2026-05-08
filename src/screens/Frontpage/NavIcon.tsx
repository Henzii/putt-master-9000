import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageSourcePropType, Image } from "react-native";
import { useTheme } from 'react-native-paper';
import { Link } from 'react-router-native';

type NavIconProps = {
    icon: ImageSourcePropType
    title: string
    to: string
    description?: string
    badge?: string
    iconColor?: string
    onClick?: () => void
    placeholder?: boolean
} | {placeholder: true}

const NavIcon = (props : NavIconProps) => {
    const [pressed, setPressed] = useState(false);

    const { colors } = useTheme();

    if (props.placeholder) {
        return null;
    }

    const {title, to, icon, iconColor, onClick, description, badge} = props;

    return (
        <Link style={[styles.container, pressed && {backgroundColor: colors.surfaceVariant}]} to={to} onPress={onClick} underlayColor="none" onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
            <View style={styles.inner}>
                <View style={styles.iconContainer}>
                    <Image source={icon} style={styles.icon} tintColor={iconColor} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{title}</Text>
                    {description && <Text style={styles.description}>{description}</Text>}
                </View>
                {badge && (
                    <View style={[styles.badge, {backgroundColor: colors.primary}]}>
                        <Text style={[styles.badgeText, {color: colors.onPrimary}]}>{badge}</Text>
                    </View>
                )}
            </View>
        </Link>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#eeeeee',
        marginHorizontal: 12,
        marginVertical: 4,
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        paddingHorizontal: 16,
        gap: 20,
    },
    iconContainer: {
        width: 52,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        height: 48,
        width: 48,
    },
    textContainer: {
        flex: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: '600',
    },
    description: {
        fontSize: 13,
        color: '#888',
        marginTop: 3,
    },
    badge: {
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
});

export default NavIcon;
