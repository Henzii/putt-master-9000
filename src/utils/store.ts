import { createStore, combineReducers } from "redux";
import gameDataReducer from '../reducers/gameDataReducer';

const reducers = combineReducers({
    gameData: gameDataReducer
})

export type RootState = ReturnType<typeof reducers>;

export default createStore(reducers)
