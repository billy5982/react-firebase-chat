import React from "react";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState, useRef } from "react";
import { getDatabase, ref, set, push, child } from "firebase/database";
import { useSelector, useDispatch } from "react-redux";
import {
  getStorage,
  ref as strRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

function MessageForm() {
  const dataBase = getDatabase();
  const messagesRef = ref(dataBase, "messages");
  const user = useSelector((state) => state.user.currentUser);
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const isPrivateChatRoom = useSelector(
    (state) => state.chatRoom.isPrivateChatRoom
  );

  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const inputFileRef = useRef(null);
  //form 입력값 상태 관리 함수
  const handleContent = (e) => {
    setContent(e.target.value);
  };

  // 메세지 제작 함수. 객체를 반환 반환한 객체를 버튼 로직에서 데이터베이스에 전달하여 저장
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

  // submit 버튼을 누르면 해당 메세지를 파이어베이스 데이터베이스에 저장하는 로직
  // content가 있으면 해당 채팅방의 id의 자식요소로 해당 데이터 저장
  const handleSubmit = async () => {
    if (!content) {
      setErrors((prev) => prev.concat("Type contents first"));
      return;
    }
    setLoading(true);
    // firebase에 메세지를 저장하는 방법
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

  const handleOpenImageRef = () => {
    inputFileRef.current.click();
  };
  const getPath = () => {
    if (isPrivateChatRoom) {
      return `/message/private/${chatRoom.id}`;
    } else {
      return `/message/public`;
    }
  };
  // upload 버튼 로직
  // 이미지 파일 정보를 파이어 베이스 스토리지에 저장 -> 해당 파일에 대한 파이어 베이스 스토리지 url을 받아와서
  // 메세지를 제작 => 제작한 메세지를 파이어베이스 스토리지에 저장
  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    const filePath = `${getPath()}${file.name}`;
    const metadata = { contentType: file.type };
    const storage = getStorage();
    setLoading(true);
    //파이어 베이스 스토리지에 해당 이미지 저장하기
    try {
      // 파이어베이스 스토리지에 파일 저장 await을 사용하면 uploadTask엔 데이터가 업로드 된 후에 초기화됨.
      let uploadTask = uploadBytesResumable(
        strRef(storage, filePath),
        file,
        metadata
      );
      // 파일 저장되는 퍼센티지 구하기
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // state 업로드의 진행속도를 snapshot.bytesTransferred, snapshot.totalBytes 으로 해서 구할 수 있음.
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercentage(progress);
        },
        (err) => {
          setLoading(false);
          console.error(err);
        },
        // 파일 저장이 다 된 후에 파일 메세지 전송
        () => {
          // 다운로드 url을 가져올 수 있음. 해당 리턴값을 then을 이용해서 url을 받아서 dataBase에 해당 메세지를 저장
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            console.log(downloadUrl);
            set(
              push(child(messagesRef, chatRoom.id)),
              createMessage(downloadUrl)
            );
            setLoading(false);
          });
        }
      );
    } catch (error) {}
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
      {!(percentage === 0 || percentage === 100) && (
        <ProgressBar
          variant="warning"
          label={`${percentage} %`}
          now={percentage}
        />
      )}
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
            disabled={loading ? true : false}
          >
            Send
          </button>
        </Col>
        <Col>
          <button
            className="message-form-button"
            style={{ width: "100%" }}
            onClick={handleOpenImageRef}
            disabled={loading ? true : false}
          >
            Upload
          </button>
        </Col>
      </Row>

      <input
        accept="image/jpeg, image/png"
        type="file"
        style={{ display: "none" }}
        ref={inputFileRef}
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessageForm;
