import { Container } from "../../styled/Container";
import Message from "./Message";
import MessageForm from "./MessageForm";
import MessageHeader from "./MessageHeader";
import { useEffect, useState, useRef } from "react";
import {
  getDatabase,
  ref,
  onChildAdded,
  child,
  onChildRemoved,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { setUserPosts } from "../../../redux/actions/chatRoom_actions";
import Skeleton from "../../../commons/components/Skeleton";

function MainPanel({ heart, setHeart }) {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);

  const dataBase = getDatabase();
  const typingRef = ref(dataBase, "typing");
  const messagesRef = ref(dataBase, "messages");

  const dispatch = useDispatch();
  const messageEnd = useRef(null);

  //버튼을 눌러줄 때마다 state를 변경해서 해당 state가 변경되면 값을 다시 가져올 수 있도록 구현
  const [btnClick, setBtnClick] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
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

  // 드롭다운 유저 명과 카운터 갯수를 표현하는 함수,
  // 로직 -> key in obj로 해당 유저가 이미 존재하면 count+1 해주고
  // 해당 key(user name)이 없다면 count = 1, userURL , key를 등록해준다.
  //해당 채팅방에 메세지 정보가 들어옴
  const userPostCount = (messages) => {
    const filter = messages.reduce((acc, message) => {
      // 객체에 해당 키가 있는 지 확인하는 로직 in을 사용
      if (message.user.name in acc) {
        acc[message.user.name].count += 1; // 해당 유저가 이미 존재한다면 메세지 수 카운트
      } else {
        acc[message.user.name] = { image: message.user.image, count: 1 }; // 객체 키로 유저 네임, 값으로 카운트와 이미지 넣기
      }
      return acc;
    }, {});
    // 최종적으로 모은 정보를 redux 상태에 저장
    // console.log(setUserPosts(filter));
    dispatch(setUserPosts(filter));
  };

  // 접근한 현재 방에 메세지를 가져오는 로직 + 드롭다운에 유저 명과 카운터 갯수를 표현하는 로직의 실행구문
  const addMessagesListener = (chatRoomId) => {
    const messagesArray = [];
    // child를 써서 message 데이터 베이스에 자식요소로 있는 chatRoomId의 변경값을
    // 확인하는 메서드 -> 여기서 변경값이란 message의 추가 여부임
    onChildAdded(child(messagesRef, chatRoomId), (data) => {
      messagesArray.push(data.val());
      setMessageLoading(false);
      setMessages([...messagesArray]);
      userPostCount(messagesArray);
    });
  };

  const addTypingListeners = (chatRoomId) => {
    // 타이핑이 추가됐을때
    let typingData = [];
    onChildAdded(child(typingRef, chatRoomId), (data) => {
      if (data.key !== user.uid) {
        let obj = {
          id: data.key,
          name: data.val(),
        };
        if (typingData.length === 0) {
          typingData.push(obj);
        } else {
          let idx = typingData.findIndex((x) => x.id === obj.id);
          if (idx === -1) {
            // 해당 데이터가 존재하지 않는다면 데이터를 푸쉬해줌
            typingData.push(obj);
          }
        }
        setTypingUsers([...typingData]);
      }
    });
    // 타이핑이 제거 됐을때
    onChildRemoved(child(typingRef, chatRoomId), (data) => {
      //지워진 데이터 => data
      const index = typingData.findIndex((user) => user.id === data.key);

      if (index !== -1) {
        if (typingData.filter((user) => user.id !== data.key).length === 0) {
          setTypingUsers([]);
          typingData = [];
          console.log(typingData);
        } else {
          let arr = typingData.filter((user) => user.id !== data.key);
          setTypingUsers([...arr]);
          typingData = [...arr];
          console.log(typingData);
        }
      }
    });
  };

  useEffect(() => {
    if (chatRoom) {
      addMessagesListener(chatRoom.id);
      addTypingListeners(chatRoom.id);
    }
    // 첫 진입시 chatRoom 이 들어오지 않음
    // chatRoom이 들어왔을 때 해당 해당 함수를 실행시켜야함.
  }, []);

  useEffect(() => {
    if (messageEnd.current) {
      messageEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <Container padding="2rem 2rem 0 2rem">
      <MessageHeader
        handleSearchChange={handleSearchChange}
        heart={heart}
        setHeart={setHeart}
      />
      <Container
        width={"100%"}
        height={"450px"}
        border={".2rem solid #ececec"}
        borderR={"4px"}
        padding={"1rem"}
        margin={"0 0 1rem 0"}
        overflowY={"auto"}
      >
        {/* 스켈레톤 설정 */}
        {messageLoading && [...Array(10)].map((x) => <Skeleton />)}

        {/* search 진행중이면 searchResult를 뿌려줌 */}
        {searchTerm
          ? searchResult.map((msg) => (
              <Message key={msg.timestamp} message={msg} user={user}></Message>
            ))
          : messages.map((msg) => (
              <Message key={msg.timestamp} message={msg} user={user}></Message>
            ))}
        <div ref={messageEnd}>ref</div>

        {typingUsers.length > 0 &&
          typingUsers.map((user) => {
            return <div key={user.id}>{user.name.userUid}가 입력중입니다.</div>;
          })}
      </Container>
      {/* div 로 스크롤을 내릴 자리를 만들어주기 Ref.scrollIntoView */}
      <MessageForm
        btnClick={btnClick}
        setBtnClick={setBtnClick}
        messageEnd={messageEnd}
      />
    </Container>
  );
}

export default MainPanel;
