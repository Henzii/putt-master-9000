import React, { useState } from 'react';
import { StyleSheet, Alert } from "react-native";
import { TextInput, Title, Button } from 'react-native-paper';

type ChangePasswordProps = {
    onPasswordChange: (newPassword: string) => void
}
const ChangePassword = ({ onPasswordChange }: ChangePasswordProps) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleSubmit = () => {
        if (newPassword.length < 5) {
            Alert.alert('Password too short!', 'Your password should be at least 5 characters');
        }
        else if (newPassword !== confirmPassword) {
            Alert.alert('No match!', 'Passwords don\'t match!');
        } else {
            onPasswordChange(newPassword);
        }
    };
    return (
        <>
            <Title>Change password</Title>
            <TextInput
                autoComplete={false}
                mode='outlined'
                secureTextEntry
                label="New password"
                dense
                style={tyyli.input}
                value={newPassword}
                onChangeText={(v) => setNewPassword(v)}
            />
            <TextInput
                autoComplete={false}
                mode='outlined'
                secureTextEntry
                label="Confirm password"
                dense
                style={tyyli.input}
                value={confirmPassword}
                onChangeText={(v) => setConfirmPassword(v)}
            />

            <Button mode='contained' onPress={handleSubmit} style={tyyli.nappi}>Change</Button>
        </>
    );
};
const tyyli = StyleSheet.create({
    input: {
        maxWidth: 250,
    },
    nappi: {
        left: 1,
        maxWidth: 100,
        marginTop: 10
    }
});
export default ChangePassword;
