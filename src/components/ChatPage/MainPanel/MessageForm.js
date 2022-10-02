import React from "react";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import { getDatabase, ref, set, push, child } from "firebase/database";
import { useSelector, useDispatch } from "react-redux";

function MessageForm() {
  const dataBase = getDatabase();
  const messagesRef = ref(dataBase, "messages");
  const user = useSelector((state) => state.user.currentUser);
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  //form 입력값 상태 관리 함수
  const handleContent = (e) => {
    setContent(e.target.value);
  };

  const createMessage = (fileUrl = null) => {
    const message = {
      // new Date만 넣으면 왜 안되지?
      timestamp: `${new Date()}`,
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };

    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = content;
    }
    return message;
  };

  const handleSubmit = async () => {
    if (!content) {
      setErrors((prev) => prev.concat("Type contents first"));
      return;
    }
    setLoading(true);
    // firebase에 메세지를 저장하는 방법
    console.log(createMessage());
    try {
      // push 데이터 베이스의 목록을 추가하는 메소드, 새 노드를 푸시할 떄마다 고유키를 생성
      // messages/users/<unique-user-id>/<username>) 느낌
      // set	정의된 경로(예: messages/users/<username>)에 데이터를 쓰거나 대체합니다.
      await set(push(child(messagesRef, chatRoom.id)), createMessage());
      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {
      setErrors((pre) => pre.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control
            onChange={handleContent}
            value={content}
            as="textarea"
            rows={3}
          />
        </Form.Group>
      </Form>
      <ProgressBar variant="warning" label="60%" now={60} />
      <div>
        {errors.map((errorMsg) => (
          <p style={{ color: "red" }} key={errorMsg}>
            {errorMsg}
          </p>
        ))}
      </div>
      <Row>
        <Col>
          <button
            onClick={handleSubmit}
            className="message-form-button"
            style={{ width: "100%" }}
          >
            Send
          </button>
        </Col>
        <Col>
          <button className="message-form-button" style={{ width: "100%" }}>
            Upload
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default MessageForm;
