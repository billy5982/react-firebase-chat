import { SET_CURRENT_CHAT_ROOM } from "./types";

export const setCurrentChatRoom = (currentChatRoom) => {
  return {
    type: SET_CURRENT_CHAT_ROOM,
    payload: currentChatRoom,
  };
};
