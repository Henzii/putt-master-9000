import React from "react";
import { ReactNode, useState } from "react";
import { Button, Dialog, IconButton, Portal } from "react-native-paper";

const InfoDialog = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                    <Dialog.Content>
                        {children}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <IconButton icon="information-outline" onPress={() => setVisible(true)} size={18} style={{marginTop: -2, marginLeft: -5}} />
        </>
    );
};

export default InfoDialog;