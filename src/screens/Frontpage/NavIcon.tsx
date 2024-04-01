import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageSourcePropType, Image } from "react-native";
import { Link } from 'react-router-native';

type NavIconProps = {
    icon: ImageSourcePropType
    title: string
    to: string
    backgroundColor: string
}

const NavIcon = ({title, to, icon, backgroundColor} : NavIconProps) => {
    const [pressed, setPressed] = useState(false);
    return (
        <Link style={styles.container} to={to} underlayColor="none" onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
            <View>
                <View style={[styles.iconContainer, {backgroundColor}, pressed && {elevation: 0}]}>
                    <Image source={icon} style={styles.icon} />
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