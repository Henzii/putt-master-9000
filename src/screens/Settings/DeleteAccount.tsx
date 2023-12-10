import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Paragraph, TextInput, Title } from 'react-native-paper';
import useMe from '../../hooks/useMe';
import Spacer from '../../components/ThemedComponents/Spacer';

type Props = {
    handleDeleteAccount: () => void
}
const DeleteAccount = ({handleDeleteAccount}: Props) => {
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
            <Title>Delete account</Title>
            {showConfirm ? (
                <View>
                    <Paragraph>
                        To delete your account, type <Text style={{fontWeight: "800"}}>{me?.name.toLowerCase()}</Text> in the input field below
                        and press Delete account.
                    </Paragraph>
                    <TextInput mode='outlined' autoFocus dense value={nameInput} onChangeText={setNameInput} />
                </View>
            ) : (
                <Paragraph>
                    Delete your account permanently. Deleted accounts can not be restored afterwards.
                </Paragraph>
            )}
            <Spacer />
            <Button
                color="red"
                mode='contained'
                onPress={handleDeleteClick}
                disabled={showConfirm && nameInput !== me?.name.toLowerCase()}
            >
                Delete account
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
