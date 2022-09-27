import { SET_USER } from "./types.js";

export function setUser(user) {
  return {
    type: SET_USER,
    payload: user,
  };
}
