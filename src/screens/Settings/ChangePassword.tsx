import React, { useState } from 'react';
import { StyleSheet, Alert } from "react-native";
import { TextInput, Title, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

type ChangePasswordProps = {
    onPasswordChange: (newPassword: string) => void
}
const ChangePassword = ({ onPasswordChange }: ChangePasswordProps) => {
    const { t } = useTranslation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleSubmit = () => {
        if (newPassword.length < 5) {
            Alert.alert(t('screens.settings.passwordTooShort'), t('screens.settings.passwordTooShortInfo'));
        }
        else if (newPassword !== confirmPassword) {
            Alert.alert(t('screens.settings.passwordNoMatch'), t('screens.settings.passwordsDontMatch'));
        } else {
            onPasswordChange(newPassword);
        }
    };
    return (
        <>
            <Title>{t('screens.settings.changePasswordTitle')}</Title>
            <TextInput
                autoComplete='off'
                mode='outlined'
                secureTextEntry
                label={t('screens.settings.newPassword')}
                dense
                style={tyyli.input}
                value={newPassword}
                onChangeText={(v) => setNewPassword(v)}
            />
            <TextInput
                autoComplete='off'
                mode='outlined'
                secureTextEntry
                label={t('screens.settings.confirmPassword')}
                dense
                style={tyyli.input}
                value={confirmPassword}
                onChangeText={(v) => setConfirmPassword(v)}
            />

            <Button mode='contained' onPress={handleSubmit} style={tyyli.nappi}>{t('common.change')}</Button>
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
