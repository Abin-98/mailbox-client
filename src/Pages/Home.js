import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import MailEditor from "../Components/MailEditor";

const Home = () => {
  const [show, setShow] = useState(false);

  return (
    <section className="container-fluid">
      {/* Right side */}
      <div className="row vh-100">
        <div className="col-2 d-flex flex-column align-items-center bg-light p-3">
          <button
            className="btn btn-primary w-100 p-3 mb-3"
            onClick={() => setShow(true)}
          >
            Compose
          </button>
          <Modal show={show} onHide={() => setShow(false)} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>Mail Editor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <MailEditor />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => setShow(false)}>
                Send
              </Button>
              <Button variant="secondary" onClick={() => setShow(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="side_bar">Sent</div>
          <div className="side_bar">Starred</div>
          <div className="side_bar">Deleted Items</div>
        </div>

        {/* Left side */}
        <div className="col-10">
          <div>

          </div>
          {}
        </div>
      </div>
    </section>
  );
};

export default Home;
