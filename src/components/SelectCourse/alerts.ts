import { Alert } from "react-native";

export const confirmCourseDeletion = ({onConfirm, onCancel}: {onConfirm: () => void, onCancel: () => void}) => {
    Alert.alert(
        'Are you sure?',
        'Do you really want to delete this course? It cannot be undone later',
        [
            {text: "Delete", onPress: onConfirm},
            {text: "Cancel", onPress: onCancel}
        ]);
};