import { SET_CURRENT_CHAT_ROOM } from "../actions/types";

const initialChatroomState = {
  currentChatRoom: null,
};

export default function (state = initialChatroomState, action) {
  switch (action.type) {
    case SET_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatRoom: action.payload,
      };
    default:
      return state;
  }
}
