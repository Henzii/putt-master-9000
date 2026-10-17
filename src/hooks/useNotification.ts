import { useDispatch } from "react-redux";
import { addNotification } from "src/reducers/notificationReducer";
import type { Notification } from "src/reducers/notificationReducer";

export const useNotification = () => {
    const dispatch = useDispatch();
    const notify = (message: Notification['message'], type?: Notification['type']) => {
        dispatch(addNotification(message, type));
    };
    return notify;
};