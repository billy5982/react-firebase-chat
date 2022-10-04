import React, { Component } from "react";
import { FaRegSmileWink } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { BsFillTrashFill } from "react-icons/bs";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import { useSelector, useDispatch } from "react-redux";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  update,
  child,
} from "firebase/database";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../redux/actions/chatRoom_actions";
import { async } from "@firebase/util";
import { useEffect } from "react";
const ChatRoomUIComponent = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

function ChatRoom() {
  const [show, setShow] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [chatRoom, setChatRoom] = useState([]);
  const [firstChatRoom, setFirstChatRoom] = useState(true);
  //선택된 아이디의 효과를 주기 위한 상태관리
  const [activeChatRoomId, setActiveChatRoomId] = useState("");
  // chatRoom 테이블의 주소를 가져오는것 ? 들을 가져오는 것?
  const chatRoomRef = ref(getDatabase(), "chatRoomRef");

  // form 상태 관리
  const [formValue, setFormValue] = useState({
    name: "",
    description: "",
  });

  // 모달 창 상태 관리
  const onClick = () => {
    setShow(!show);
  };

  //form 제출 상태 관리
  const formChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid(formValue.name, formValue.description)) {
      addChatRoom();
    }
  };

  // 방 만들었을 때 파이어 베이스 데이터에 업데이트
  const addChatRoom = async () => {
    const { name, description } = formValue;
    // 데이터 베이스 테이블에 chatRoomRef를 만드는 것?? 데이터 베이스의 해당 테이블을 가져옴
    // 테이블 안에 제목으로 분류할 row의 키를 자동으로 생성한 것.
    const key = push(chatRoomRef).key;
    // console.log(key);
    // 새로운 채팅방을 만들 것인데 database chatroom 테이블에, 고유 채팅방 row 안에
    // newChatroom이라는 column 데이터 들을 넣을 것임. row는 데이터 값의 고유 아이디
    // 테이블은 유저,채팅방 같은 큰 틀을 보관하는 장소, column은 row에 대한 상세 정보
    const newChatRoom = {
      id: key,
      name,
      description,
      createBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    };
    try {
      //데이터 베이스에 업데이트 ?? chatRoomRef에 key라는 row을 제작 row의 값(상세정보)
      //newChatRoom 데이터를 넣을 것임
      await update(child(chatRoomRef, key), newChatRoom);
      //state 초기화
      setFormValue({
        name: "",
        description: "",
      });
      // 모달창 닫아주기
      setShow(false);
    } catch (error) {
      alert(error);
    }
  };

  // 방 만든 후 데이터 실시간 업데이트 함수
  const AddChatRoomsListeners = () => {
    // chatRoom 테이블의 id들로 이루어진 배열, id들 => 채팅방 정보
    let chatRoomsArray = [];
    //chatRoomRef의 테이블에서 데이터가 변경되는 것을 계속 확인하고 있는 함수(onChildAdded)
    //data.val()을 하면 현재 row 에 등록되어있는 채팅방 상세정보(column)를 실시간으로 가지고 올 수 있음
    onChildAdded(chatRoomRef, (data) => {
      chatRoomsArray.push(data.val());
      setChatRoom([...chatRoomsArray]);
      // 초기 진입 시 챗룸이 있으면 첫번째 챗룸으로 리듀서를 고정해줄 수 있다.
      // 챗룸이 없으면 리듀서의 상태를 그냥 null 상태로 배치
      if (firstChatRoom && chatRoomsArray.length > 0) {
        //처음 룸이 선택되있게 고정
        dispatch(setCurrentChatRoom(chatRoomsArray[0]));
        setFirstChatRoom(false);
        setActiveChatRoomId(chatRoomsArray[0].id);
      }
    });
  };

  useEffect(() => {
    AddChatRoomsListeners();
  }, []);

  // 간단한 유효성 검사 해당
  const isFormValid = (nam, des) => nam && des;

  // li (채팅방) 클릭시 발생 이벤트 -> 화면 전환 이벤트 -> 현재 리듀서에 클릭한 방의 정보를 담아주고
  // mainpannel에서 해당 방에 대한 정보를 뿌려줘야 함.
  const changeChatRoom = (room) => {
    dispatch(setCurrentChatRoom(room));
    dispatch(setPrivateChatRoom(false));
    // 클릭한 room의 아이디로
    setActiveChatRoomId(room.id);
  };
  // 업데이트를 이용하여 해당 데이터 삭제?
  const removeChatRoom = (room) => {
    console.log(room);
  };
  return (
    <div>
      <ChatRoomUIComponent>
        <FaRegSmileWink style={{ marginRight: 3 }} />
        CHAT ROOMS {chatRoom.length}
        <FaPlus
          onClick={onClick}
          style={{ position: "absolute", right: 0, cursor: "pointer" }}
        />
      </ChatRoomUIComponent>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {chatRoom.length !== 0
          ? chatRoom.map((room) => (
              // 클릭한 정보를 리덕스에다가 넣어줘야함
              <li
                onClick={() => changeChatRoom(room)}
                key={room.id}
                style={{
                  backgroundColor: room.id === activeChatRoomId && "#ffffff45",
                  display: "flex",
                }}
              >
                # {room.name}
                <BsFillTrashFill
                  style={{ cursor: "pointer" }}
                  onClick={() => removeChatRoom(room)}
                />
              </li>
            ))
          : null}
      </ul>
      {/* chatRoom Modal */}

      <Modal show={show} onHide={onClick}>
        <Modal.Header closeButton>
          <Modal.Title>Create a chat room</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ display: "flex", flexDirection: "column" }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>방 이름</Form.Label>
              <Form.Control
                name="name"
                value={formValue.name}
                type="text"
                placeholder="Enter a chat romm name"
                onChange={formChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>방 설명</Form.Label>
              <Form.Control
                name="description"
                value={formValue.description}
                type="text"
                placeholder="Enter a chat room description"
                onChange={formChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClick}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChatRoom;
