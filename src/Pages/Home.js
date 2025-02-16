import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import MailEditor from '../Components/MailEditor';

const Home = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="d-flex justify-content-center mt-5">
      <Button onClick={() => setShow(true)}>Open Overlay</Button>
      <Modal show={show} onHide={() => setShow(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Mail Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body><MailEditor/></Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={() => setShow(false)}>
            Send
          </Button>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Home