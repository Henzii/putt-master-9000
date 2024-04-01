import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageSourcePropType, Image } from "react-native";
import { useTheme } from 'react-native-paper';
import { Link } from 'react-router-native';

type NavIconProps = {
    icon: ImageSourcePropType
    title: string
    to: string
    backgroundColor?: string
    iconColor?: string
    onClick?: () => void
}

const NavIcon = ({title, to, icon, backgroundColor, iconColor, onClick} : NavIconProps) => {
    const [pressed, setPressed] = useState(false);
    const {colors} = useTheme();

    return (
        <Link style={styles.container} to={to} onPress={onClick} underlayColor="none" onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
            <View>
                <View style={[styles.iconContainer, pressed && {elevation: 0}, {backgroundColor: backgroundColor || colors.surface}]}>
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
        borderRadius: 12,
        backgroundColor: '#EFFFEF',
        elevation: 8,
        padding: 15,
    },
    icon: {
        height: 70,
        width: 70,
    },
    text: {
        marginVertical: 5,
        textAlign: 'center',
    }
});

export default NavIcon;