import SidePanel from "./SidePanel/SidePanel";
import MainPanel from "./MainPanel/MainPanel";
import { useSelector } from "react-redux";
import { useState } from "react";

function ChatPage() {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const currentUser = useSelector((state) => state.user.currentChatRoom);
  const [heart, setHeart] = useState(false);
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "300px" }}>
        <SidePanel
          key={currentUser && currentUser.uid}
          heart={heart}
          setHeart={setHeart}
        />
      </div>
      <div style={{ width: "100%" }}>
        {chatRoom && (
          <MainPanel
            key={chatRoom && chatRoom.id}
            heart={heart}
            setHeart={setHeart}
          />
        )}
      </div>
    </div>
  );
}

export default ChatPage;
