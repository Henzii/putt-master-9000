const reducer = (state:Notification[] = [], action: notificationReducerAction) => {
    switch(action.type) {
        case 'REMOVE_FIRST':
            return state.slice(1);
        case 'ADD_NOTIFICATION':
            return ([...state, { message: action.data.message, type: action.data.type }])
        default:
            return state;
    }
}
export const addNotification = (message: string, type?: Notification['type']): AddNotification => {
    return {
        type:'ADD_NOTIFICATION',
        data: {
            message,
            type,
        }
    }
}
export const removeNotification = ():RemoveFirstAction => {
    return {
        type: 'REMOVE_FIRST',
    }
}
type Notification = {
    message: string,
    type?: 'info' | 'alert' | 'success' | 'warning'
}
type RemoveFirstAction = {
    type: 'REMOVE_FIRST'
}
type AddNotification = {
    type: 'ADD_NOTIFICATION',
    data: Notification
}
type notificationReducerAction = RemoveFirstAction | AddNotification
export default reducer;