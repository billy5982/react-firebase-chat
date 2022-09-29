import React from "react";
import UserPanel from "./UserPanel";
import ChatRoom from "./ChatRoom";
import DirectMessage from "./DirectMessage";
import Favorited from "./Favorited";
import styled from "styled-components";

const Container = styled.div`
  background-color: #7b83eb;
  padding: 2rem;
  min-height: 100vh;
  color: white;
  min-width: 275px;
`;

function SidePanel() {
  return (
    <Container>
      <UserPanel />
      <Favorited />
      <ChatRoom />
      <DirectMessage />
    </Container>
  );
}

export default SidePanel;
