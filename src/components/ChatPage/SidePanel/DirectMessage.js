import { getDatabase, onChildAdded, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { FaRegSmile } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_actions";
function DirectMessage() {
  const userRef = ref(getDatabase(), "users");
  const [users, setUsers] = useState([]);
  const myName = useSelector((state) => state.user.currentUser.uid);
  const [activeChatRoom, setActiveChatRoom] = useState("");
  const dispatch = useDispatch();
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);

  const addUsersListener = () => {
    let usersArray = [];
    onChildAdded(userRef, (data) => {
      //data.key로 접근하면 users 데이터 베이스 안에있는 uid값에 접근할 수 있음
      if (myName !== data.key) {
        let user = data.val();
        user["uid"] = data.key;
        user["status"] = "offline";
        usersArray.push(user);
        setUsers([...usersArray]);
      }
    });
  };

  // 유저 이름 방 제작하기, 나와 다른 사람의 id로 채팅방을 생성하는 구조
  // 그러기 위해서는 나의 아이디와 상대방의 아이디를 이용해서 챗룸을 만들어야하는데
  // 두 아이디를 대소비교 해서 하나로 통합시켜줄 수 있는 함수를 작성해야함
  const getChatRoomId = (userId) => {
    const currentUserId = myName;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  const changeChatRoom = (user) => {
    const chatRoomId = getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name,
    };
    dispatch(setCurrentChatRoom(chatRoomData));
    dispatch(setPrivateChatRoom(true));
    setActiveChatRoom(chatRoomId);
  };

  useEffect(() => {
    if (myName) {
      addUsersListener();
    }
  }, []);

  return (
    <div>
      <span style={{ display: "flex", alignItems: "center" }}>
        <FaRegSmile style={{ marginRight: 3 }} />
        DirectMessage(1)
      </span>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {users.length > 0
          ? users.map((user) => {
              return (
                <li
                  style={{
                    backgroundColor:
                      chatRoom.id === activeChatRoom && "#ffff45",
                  }}
                  key={user.uid}
                  onClick={() => {
                    changeChatRoom(user);
                  }}
                >
                  # {user.name}
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
}

export default DirectMessage;
