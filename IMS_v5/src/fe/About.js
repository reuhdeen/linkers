import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <h1>About Us</h1>
      <button onClick={toggle}>Open Modal</button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          Modal body text goes here.
        </ModalBody>
      </Modal>
    </div>
  );
};

export default About;
