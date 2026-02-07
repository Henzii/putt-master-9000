import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph, TextInput, Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import useMe from '../../hooks/useMe';
import Spacer from '../../components/ThemedComponents/Spacer';

type Props = {
    handleDeleteAccount: () => void
}
const DeleteAccount = ({handleDeleteAccount}: Props) => {
    const { t } = useTranslation();
    const {me} = useMe();
    const [showConfirm, setShowConfirm] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const handleDeleteClick = () => {
        if (!showConfirm) setShowConfirm(true);
        else if (nameInput === me?.name.toLowerCase()) {
            handleDeleteAccount();
        }
    };
    return (
        <View style={styles.container}>
            <Title>{t('screens.settings.deleteAccountTitle')}</Title>
            {showConfirm ? (
                <View>
                    <Paragraph>
                        {t('screens.settings.deleteAccountConfirmInfo', { name: me?.name.toLowerCase() })}
                    </Paragraph>
                    <TextInput mode='outlined' autoFocus dense value={nameInput} onChangeText={setNameInput} />
                </View>
            ) : (
                <Paragraph>
                    {t('screens.settings.deleteAccountInfo')}
                </Paragraph>
            )}
            <Spacer />
            <Button
                buttonColor="darkred"
                mode='contained'
                onPress={handleDeleteClick}
                disabled={showConfirm && nameInput !== me?.name.toLowerCase()}
            >
                {t('screens.settings.deleteAccountTitle')}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: 'red',
        tintColor: 'blue',
        color: 'blue'
    }
});

export default DeleteAccount;
