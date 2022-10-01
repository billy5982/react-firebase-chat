import React from "react";
import UserPanel from "./UserPanel";
import ChatRoom from "./ChatRoom";
import DirectMessage from "./DirectMessage";
import Favorited from "./Favorited";
import styled from "styled-components";
import { Container } from "../../styled/Container";

// const Container = styled.div`
// background-color: #7b83eb;
//   padding: 2rem;
//   min-height: 100vh;
//   color: white;
//   min-width: 275px;
// `;

function SidePanel() {
  return (
    <Container
      backgroundC="#7b83eb"
      padding="2rem"
      minHeight="100vh"
      minWidth="275px"
      color="white"
    >
      <UserPanel />
      <Favorited />
      <ChatRoom />
      <DirectMessage />
    </Container>
  );
}

export default SidePanel;
