// Reducer을 합쳐주기 위해 불러옴
import { combineReducers } from "redux";
import user from "./user_reducer";
import chatRoom from "./chatRoom_reducer";
// import chatRoom from './chatRoom_reducer'

const rootReducer = combineReducers({
  user,
  chatRoom,
});

export default rootReducer;
