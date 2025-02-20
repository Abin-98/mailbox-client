import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useDispatch, useSelector } from "react-redux";
import { mailActions } from "../Store/reducers/mailSlice";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Truncate from "react-truncate";
import { Tooltip } from "@mui/material";

const InboxMail = ({ mailData, id, sent, sendIDtoHome }) => {
  const dispatch = useDispatch();
  const sentMailsList = useSelector((state) => state.mail.sentMailsList);
  const inboxMailsList = useSelector((state) => state.mail.inboxMailsList);
  const userEmail = useSelector((state) => state.auth.userEmail);
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [checked, setChecked] = useState(false);
  const emailEncoded = userEmail.replace(/\./g, "_");
  const newDate = new Date(mailData?.date);
  const mailsList = sent ? sentMailsList : inboxMailsList;
  const formattedDate = newDate?.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  let url = "";
  url = sent
    ? `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}/sent/${id}.json`
    : `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}/inbox/${id}.json`;

  const handleCheckChange = (e) => {
    setChecked(e.target.checked);
    sendIDtoHome({
      sent: sent,
      id: id,
      action: "delete",
      openMail: false,
      isChecked: e.target.checked,
    });
  };

  const handleDelete = async () => {
    const newMailsList = { ...mailsList };
    delete newMailsList[id];

    try {
      const response = await axios.delete(url);
      console.log(response);
      sent
        ? dispatch(mailActions.addToSentMailList({ ...newMailsList }))
        : dispatch(mailActions.addToInboxMailList({ ...newMailsList }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenMail = async () => {
    if (!mailsList[id].read) {
      try {
        const response = await axios.put(url, {
          ...mailsList[id],
          read: true,
        });
        console.log("from handleOpenMail()", response.data);

        sent
          ? dispatch(
              mailActions.addToSentMailList({
                ...mailsList,
                [id]: { ...mailsList[id], read: true },
              })
            )
          : dispatch(
              mailActions.addToInboxMailList({
                ...mailsList,
                [id]: { ...mailsList[id], read: true },
              })
            );
      } catch (err) {
        console.log(err);
      }
    }
    sendIDtoHome({
      sent: sent,
      id: id,
      action: "show",
      openMail: true,
      isChecked: checked,
    });
  };

  const handleReadToggle = async () => {
    try {
      const response = await axios.put(url, {
        ...mailsList[id],
        read: !mailsList[id].read,
      });
      console.log("handleReadToggle", response.data);

      sent
        ? dispatch(
            mailActions.addToSentMailList({
              ...mailsList,
              [id]: { ...mailsList[id], read: !mailsList[id].read },
            })
          )
        : dispatch(
            mailActions.addToInboxMailList({
              ...mailsList,
              [id]: { ...mailsList[id], read: !mailsList[id].read },
            })
          );
    } catch (err) {
      console.log(err);
    }
  };

  const handleStarToggle = async () => {
    try {
      const response = await axios.put(url, {
        ...mailsList[id],
        starred: !mailsList[id].starred,
      });
      console.log("handleStarToggle", response.data);

      sent
        ? dispatch(
            mailActions.addToSentMailList({
              ...mailsList,
              [id]: { ...mailsList[id], starred: !mailsList[id].starred },
            })
          )
        : dispatch(
            mailActions.addToInboxMailList({
              ...mailsList,
              [id]: { ...mailsList[id], starred: !mailsList[id].starred },
            })
          );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`container-fluid py-2 border-bottom border-1 border-secondary ${
        checked ? "inbox-checked" : "inbox_item"
      } `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      key={id}
    >
      <div className="row">
        <div className="col-1 d-flex justify-content-between align-items-center">
          <Form className="ps-1">
            <Form.Check
              type="checkbox"
              checked={checked}
              onChange={handleCheckChange}
              role="button"
              // onChange={(e) => setAllChecked(prev=>!prev)}
            />
          </Form>
          {sent ? (
            <span className="p-1 mx-1"></span>
          ) : (
            <span
              role="button"
              style={{ width: "10px", height: "10px" }}
              className={`rounded-circle px-1 mx-1 ${
                mailData.read ? "border border-dark" : "bg-primary"
              }`}
              onClick={handleReadToggle}
            ></span>
          )}
        </div>
        <div className="col-2 d-flex justify-content-start align-items-center">
          {sent ? (
            mailData.recipients.map((recipient) => (
              <span className="w-full text-truncate">
                {recipient}
                {mailData.recipients.length > 1 && ", "}
              </span>
            ))
          ) : (
            <span className="w-full text-truncate">{mailData?.sender}</span>
          )}
        </div>
        <div className="col-7 d-flex justify-content-start align-items-center">
          {mailData.starred ? (
            <StarIcon
              role="button"
              className="me-2"
              onClick={handleStarToggle}
            />
          ) : (
            <StarOutlineIcon
              role="button"
              className="me-2"
              onClick={handleStarToggle}
            />
          )}
          <span
            className="p-1 me-2 w-100 editorText"
            role="button"
            onClick={handleOpenMail}
          >
            <Truncate lines={1} ellipsis={<span>...</span>}>
              <div
                dangerouslySetInnerHTML={{
                  __html: mailData.subjectJSX + " >> " + mailData.bodyJSX,
                }}
              />
            </Truncate>
          </span>
          {/*<Truncate lines={1} ellipsis={<span className="w-100 flex-grow-1">...</span>}>
          <span
            className="p-1 editorText mailBody"
            role="button"
            onClick={handleOpenMail}
            dangerouslySetInnerHTML={{ __html: mailData.bodyJSX }}
          >
          </span>
          </Truncate>*/}
        </div>
        <div className="col-2 d-flex justify-content-end align-items-center">
          {isHovered ? (
            <Tooltip title="Delete this mail" arrow>
              <DeleteIcon
                role="button"
                className="me-1 magnify_hover"
                onClick={() => setShowModal(true)}
              />
            </Tooltip>
          ) : (
            <span className="date">{formattedDate}</span>
          )}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title className="d-flex align-items-center">
                <ReportProblemIcon className="me-2 text-primary" />
                <span className="text-primary">Delete Mail ?</span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this mail ?</Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-dark"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default InboxMail;
