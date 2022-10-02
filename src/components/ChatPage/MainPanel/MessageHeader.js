import React from "react";
import { Container as Con } from "../../styled/Container";
import Container from "react-bootstrap/Container";

import { FaLock } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";

import Image from "react-bootstrap/Image";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function MessageHeader() {
  return (
    <Con
      width="100%"
      height={"170px"}
      border={".2rem solid #ececec"}
      borderR={"4px"}
      padding="1rem"
      margin={"0 0 1rem 0 "}
    >
      <Container>
        <Row>
          <Col>
            <h2>
              <FaLock /> ChatRoomName
            </h2>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <BsSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search Messages"
                aria-label="Search"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>
        </Row>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <p>
            <Image src="" />
            userName
          </p>
        </div>
        <Row>
          <Col>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Description</Accordion.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>123</Card.Body>
                </Accordion.Collapse>
              </Accordion.Item>
            </Accordion>
          </Col>
          <Col>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Description</Accordion.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>123</Card.Body>
                </Accordion.Collapse>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </Con>
  );
}

export default MessageHeader;