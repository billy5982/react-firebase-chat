import React, { Component } from "react";

import { Container } from "../../styled/Container";
import Message from "./Message";
import MessageForm from "./MessageForm";
import MessageHeader from "./MessageHeader";

export class MainPanel extends Component {
  render() {
    return (
      <Container padding="2rem 2rem 0 2rem">
        <MessageHeader />
        <Container
          width={"100%"}
          height={"450px"}
          border={".2rem solid #ececec"}
          borderR={"4px"}
          padding={"1rem"}
          margin={"0 0 1rem 0"}
          overflowY={"auto"}
        ></Container>
        <MessageForm />
      </Container>
    );
  }
}

export default MainPanel;
