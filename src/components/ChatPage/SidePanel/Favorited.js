import {
  getDatabase,
  onChildAdded,
  ref,
  child,
  onChildRemoved,
} from "firebase/database";
import { useState, useEffect } from "react";
import { FaRegSmileBeam } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_actions";

function Favorited({ heart, setHeart }) {
  const [favorited, setFavorited] = useState([]);
  const user = useSelector((state) => state.user.currentUser);
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const [activeChatRoom, setActiveChatRoomId] = useState("");
  const userRef = ref(getDatabase(), `users`);
  const dispatch = useDispatch();

  const changeChatRoom = (chatRoom) => {
    dispatch(setCurrentChatRoom(chatRoom));
    dispatch(setPrivateChatRoom(false));
    // 클릭한 room의 아이디로
    setActiveChatRoomId(chatRoom.id);
  };

  const addListeners = (userId) => {
    const chatArray = [];
    onChildAdded(child(userRef, `${userId}/favorited`), (data) => {
      // 리덕스에 현재 방정보와 id를 넣어줘야함. 그래야 mainpanel chat에서 내가 찾고자 하는 데이터를 찾을 수 있음
      chatArray.push({ id: data.key, ...data.val() });
      setFavorited([...chatArray]);
    });
    onChildRemoved(child(userRef, `${userId}/favorited`), (data) => {
      // 지워진 데이터가 data로 들어옴
      const chatRoomToRemove = { id: data.key, ...data.val() };
      const filteredChatRooms = chatArray.filter(
        (chatRoom) => chatRoom.id !== chatRoomToRemove.id
      );

      setFavorited([...filteredChatRooms]);
    });
  };

  useEffect(() => {
    if (user) {
      addListeners(user.uid);
    }
  }, [heart]); //임의의 state을 만들어서 해당 state이 바뀔때마다 버튼을 누를때마다, 리스너를 실행해서 변경점을 확인
  return (
    <div>
      <span style={{ display: "flex", alignItems: "center" }}>
        <FaRegSmileBeam style={{ marginRight: "3px" }} />
        Favorited ({favorited.length})
      </span>
      <ul style={{ listStyle: "none" }}>
        {favorited &&
          favorited.map((room) => {
            return (
              <li
                key={room.id}
                onClick={() => {
                  changeChatRoom(room);
                }}
                style={{
                  backgroundColor:
                    chatRoom.id === activeChatRoom && "#ffffff45",
                }}
              >
                # {room.name}
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default Favorited;
