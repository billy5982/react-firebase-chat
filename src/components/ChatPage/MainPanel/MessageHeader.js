import React from "react";
import { Container as Con } from "../../styled/Container";
import Container from "react-bootstrap/Container";

import { FaLock, FaLockOpen } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import {
  getDatabase,
  ref,
  child,
  remove,
  update,
  onValue,
} from "firebase/database";
import Image from "react-bootstrap/Image";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";

import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

export default function MessageHeader({ handleSearchChange, heart, setHeart }) {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);
  const userPosts = useSelector((state) => state.chatRoom.userPosts);

  const userRef = ref(getDatabase(), "users");

  const isPrivateChatRoom = useSelector(
    (state) => state.chatRoom.isPrivateChatRoom
  );

  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorited = () => {
    if (isFavorited) {
      setIsFavorited(!isFavorited);
      remove(child(userRef, `${user.uid}/favorited/${chatRoom.id}`));
      setHeart(!heart);
    } else {
      // 현재 로그인한 유저의 uid로 데이터베이스에 저장되어 있는데 /favorited이라는 하위 폴더에 만들어줌
      setIsFavorited(!isFavorited);
      setHeart(!heart);
      update(child(userRef, `${user.uid}/favorited`), {
        [chatRoom.id]: {
          name: chatRoom.name,
          description: chatRoom.description,
          createdBy: {
            name: chatRoom.createdBy.name,
            image: chatRoom.createdBy.image,
          },
        },
      });
    }
  };

  //새로고침을 해도 유저가 보이게 하기
  const addFavoriteListener = (chatRoomId, userId) => {
    // 해당 유저의 favorited 안에 체크한 항목이 여기서 data.val()에 속한다.
    onValue(child(userRef, `${userId}/favorited`), (data) => {
      if (data.val() !== null) {
        // 내가 좋아요를 누른 데이터값을 모두 불러옴 Object.key를 하면 데이터를 읽어옴
        const chatRoomIds = Object.keys(data.val());
        // 현재 클릭한 채팅방(리덕스 저장상태)가 좋아요를 누른 값들에 존재하다면 true
        const isAlreadyFavorited = chatRoomIds.includes(chatRoomId);
        // 현재 채팅방을 true로 표시해준다.
        setIsFavorited(isAlreadyFavorited);
      }
    });
  };

  useEffect(() => {
    // 현재 챗룸은 li를 클릭할때마다 상태가 변경됨
    if (chatRoom && user) {
      addFavoriteListener(chatRoom.id, user.uid);
    }
  }, []);

  const renderUserPost = (userPosts) => {
    return Object.entries(userPosts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, val], i) => {
        return (
          <div key={i} style={{ display: "flex" }}>
            <img
              src={val.image}
              alt=""
              style={{ borderRadius: 25 }}
              width={48}
              height={48}
              className="mr-3"
              alt={val.name}
            />
            <div>
              <h6>{key}</h6>
              <p>{val.count} 개</p>
            </div>
          </div>
        );
      });
  };
  return (
    <>
      <Con
        width="100%"
        height={"200px"}
        border={".2rem solid #ececec"}
        borderR={"4px"}
        padding="1rem"
        margin={"0 0 1rem 0 "}
      >
        <Container>
          <Row>
            <Col>
              <h2>
                {isPrivateChatRoom ? (
                  <FaLock style={{ marginBottom: "10px" }} />
                ) : (
                  <FaLockOpen style={{ marginBottom: "10px" }} />
                )}{" "}
                {chatRoom && chatRoom.name}
                {!isPrivateChatRoom && (
                  <span style={{ cursor: "pointer" }} onClick={handleFavorited}>
                    {isFavorited ? (
                      <MdFavorite style={{ marginBottom: "10px" }} />
                    ) : (
                      <MdFavoriteBorder style={{ marginBottom: "10px" }} />
                    )}
                  </span>
                )}
              </h2>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">
                  <BsSearch />
                </InputGroup.Text>
                <Form.Control
                  onChange={handleSearchChange}
                  placeholder="Search Messages"
                  aria-label="Search"
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
            </Col>
          </Row>
          {!isPrivateChatRoom && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <p>
                <Image
                  src={`${chatRoom && chatRoom.createdBy.image}`}
                  style={{ width: "30px" }}
                />
                {chatRoom && chatRoom.createdBy.name}
              </p>
            </div>
          )}
          <Row>
            <Col>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Description</Accordion.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>{chatRoom.description}</Card.Body>
                  </Accordion.Collapse>
                </Accordion.Item>
              </Accordion>
            </Col>
            <Col>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Post Count</Accordion.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {userPosts && renderUserPost(userPosts)}
                    </Card.Body>
                  </Accordion.Collapse>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Container>
      </Con>
    </>
  );
}
