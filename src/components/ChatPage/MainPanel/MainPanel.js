import { Container } from "../../styled/Container";
import Message from "./Message";
import MessageForm from "./MessageForm";
import MessageHeader from "./MessageHeader";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, push, onChildAdded, child } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";

function MainPanel() {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);
  const dataBase = getDatabase();
  const messagesRef = ref(dataBase, "messages");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState([]);

  // 현재 채팅방에 메세지를 전부 가지고 있음
  const [messages, setMessages] = useState([]);
  // onChildAdded가 메세지를 불러올때
  const [messageLoading, setMessageLoading] = useState(true);

  // search가 header에 있는 input에서 동작하지만 전체적인 메세지랑 구분하려면
  // 직접 메세지를 다루는 부분에서 해야함. 그래서 props로 해당 input에 value를 제어하고 확인할 것임
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchLoading(true);

    const chatRoomMessages = [...messages];
    // 검색 정규식 g => global 해당 단어가 포함된 전체를 가지고 옴, i => 대소문자 구분하지 않음
    const regex = new RegExp(searchTerm, "gi");
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      // 텍스트만 찾아주기 위함
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResult([...searchResults]);
  };

  const addMessagesListener = (chatRoomId) => {
    let messagesArray = [];
    // child를 써서 message 데이터 베이스에 자식요소로 있는 chatRoomId의 변경값을
    // 확인하는 메서드 -> 여기서 변경값이란 message의 추가 여부임
    onChildAdded(child(messagesRef, chatRoomId), (data) => {
      messagesArray.push(data.val());
      // spread연산자에 무엇인가 있다...
      setMessages([...messagesArray]);
      setMessageLoading(false);
    });
  };

  useEffect(() => {
    if (chatRoom) {
      addMessagesListener(chatRoom.id);
    }
    // 첫 진입시 chatRoom 이 들어오지 않음
    // chatRoom이 들어왔을 때 해당 해당 함수를 실행시켜야함.
  }, []);
  
  return (
    <Container padding="2rem 2rem 0 2rem">
      <MessageHeader handleSearchChange={handleSearchChange} />
      <Container
        width={"100%"}
        height={"450px"}
        border={".2rem solid #ececec"}
        borderR={"4px"}
        padding={"1rem"}
        margin={"0 0 1rem 0"}
        overflowY={"auto"}
      >
        {/* search 진행중이면 searchResult를 뿌려줌 */}
        {searchTerm
          ? searchResult.map((msg) => (
              <Message key={msg.timestamp} message={msg} user={user}></Message>
            ))
          : messages.map((msg) => (
              <Message key={msg.timestamp} message={msg} user={user}></Message>
            ))}
      </Container>
      <MessageForm />
    </Container>
  );
}

export default MainPanel;
