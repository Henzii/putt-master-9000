import { createStore, combineReducers } from "redux";
import gameDataReducer from '../reducers/gameDataReducer';
import notificationReducer from '../reducers/notificationReducer';

const reducers = combineReducers({
    gameData: gameDataReducer,
    notifications: notificationReducer,
})

export type RootState = ReturnType<typeof reducers>;

export default createStore(reducers)
