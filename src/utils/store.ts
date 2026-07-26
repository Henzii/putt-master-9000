import { createStore, combineReducers } from "redux";
import gameDataReducer from '../reducers/gameDataReducer';
import notificationReducer from '../reducers/notificationReducer';
import selectedLayoutReducer from '../reducers/selectedLayoutReducer';
import commonReducer from '../reducers/commonReducer';

const reducers = combineReducers({
    gameData: gameDataReducer,
    notifications: notificationReducer,
    selectedLayout: selectedLayoutReducer,
    common: commonReducer
});

export type RootState = ReturnType<typeof reducers>;

export default createStore(reducers);
