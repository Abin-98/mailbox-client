import React from "react";
import { Form } from "react-bootstrap";
import parse from "html-react-parser";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useDispatch, useSelector } from "react-redux";
import { mailActions } from "../Store/reducers/mailSlice";
import axios from "axios";

const InboxMail = ({ mailData, id, setMailOpened }) => {
  const mailsList = useSelector((state) => state.mail.mailsList);
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.userEmail);
  const emailEncoded = userEmail.replace(/\./g, "_");
  const newDate = new Date(mailData?.date);
  const formattedDate = newDate?.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleOpenMail = async () => {
    setMailOpened(true);
    if (!mailsList[id].read) {
      try {
        const response = await axios.put(
          `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}/${id}.json`,
          { ...mailsList[id], read: true }
        );
        console.log("Here!!!", response.data);

        dispatch(
          mailActions.addToMailList({
            ...mailsList,
            [id]: { ...mailsList[id], read: true },
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleReadToggle = async () => {
    try {
      const response = await axios.put(
        `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}/${id}.json`,
        { ...mailsList[id], read: !mailsList[id].read }
      );
      console.log(response.data);

      dispatch(
        mailActions.addToMailList({
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
      const response = await axios.put(
        `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}/${id}.json`,
        { ...mailsList[id], starred: !mailsList[id].starred }
      );
      console.log(response.data);

      dispatch(
        mailActions.addToMailList({
          ...mailsList,
          [id]: { ...mailsList[id], starred: !mailsList[id].starred },
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid py-2 border-bottom border-3 border-light">
      <div className="row">
        <div className="col-1 d-flex justify-content-between align-items-center">
          <Form className="ps-1">
            <Form.Check
              type="checkbox"
              checked={false}
              role="button"
              // onChange={(e) => setAllChecked(prev=>!prev)}
            />
          </Form>
          <span
            role="button"
            style={{ width: "10px", height: "10px" }}
            className={`rounded-circle ${
              mailData.read ? "border" : "bg-primary"
            }`}
            onClick={handleReadToggle}
          ></span>
        </div>
        <div className="col-2 d-flex justify-content-start align-items-center">
          <span>{mailData.recipients[0]}</span>
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
            className="p-1 me-2 editorText subject"
            role="button"
            onClick={handleOpenMail}
          >
            {parse(mailData.subjectJSX)}
          </span>
          <span
            className="p-1 editorText mailBody"
            role="button"
            onClick={handleOpenMail}
          >
            {parse(mailData.bodyJSX)}
          </span>
        </div>
        <div className="col-2 d-flex justify-content-end align-items-center">
          <span className="date">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default InboxMail;
