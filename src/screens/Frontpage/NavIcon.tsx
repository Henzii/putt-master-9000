import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageSourcePropType, Image } from "react-native";
import { useTheme } from 'react-native-paper';
import { Link } from 'react-router-native';

type NavIconProps = {
    icon: ImageSourcePropType
    title: string
    to: string
    iconColor?: string
    onClick?: () => void
    placeholder?: boolean
} | {placeholder: true}

const NavIcon = (props : NavIconProps) => {
    const [pressed, setPressed] = useState(false);

    const { colors } = useTheme();

    if (props.placeholder) {
        return <View style={{width: styles.icon.width + (styles.iconContainer.padding * 2)}} />;
    }

    const {title, to, icon, iconColor, onClick} = props;

    return (
        <Link style={styles.container} to={to} onPress={onClick} underlayColor="none" onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
            <View>
                <View style={[styles.iconContainer, pressed && {elevation: 0, backgroundColor: colors.tertiary}]}>
                    <Image source={icon} style={styles.icon} tintColor={iconColor} />
                </View>
                <Text style={styles.text}>{title}</Text>
            </View>
        </Link>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    iconContainer: {
        borderRadius: 2,
        backgroundColor: '#ffffff',
        elevation: 2,
        borderWidth: 1,
        borderColor: '#eeeeee',
        padding: 15,
    },
    icon: {
        height: 70,
        width: 70,
    },
    text: {
        marginVertical: 5,
        textAlign: 'center',
        fontWeight: "600"
    }
});

export default NavIcon;