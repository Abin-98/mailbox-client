import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { mailActions } from "../Store/reducers/mailSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const MailEditor = ({ show, setShow }) => {
  const [editorState1, setEditorState1] = useState(EditorState.createEmpty());
  const [editorState2, setEditorState2] = useState(EditorState.createEmpty());
  const dispatch = useDispatch();
  const sentMailsList = useSelector((state) => state.mail.sentMailsList);
  const inboxMailsList = useSelector((state) => state.mail.inboxMailsList);
  const userEmail = useSelector((state) => state.auth.userEmail);
  const emailEncoded = userEmail.replace(/\./g, "_");

  const getSubjectHTML = () => {
    const rawContentState = convertToRaw(editorState1.getCurrentContent());
    return draftToHtml(rawContentState);
  };
  const getBodyHTML = () => {
    const rawContentState = convertToRaw(editorState2.getCurrentContent());
    return draftToHtml(rawContentState);
  };

  const handleClear = () => {
    setInputs([{ id: 1, value: "" }]);
    setEditorState1(EditorState.createEmpty());
    setEditorState2(EditorState.createEmpty());
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (data) => {
    try {
      setIsLoading(true);

      // validations before sending
      if (inputs[0].value === "") {
        toast.error("You forgot to add email ID.", {
          closeOnClick: true,
        });
        setIsLoading(false);
        return;
      }
      const subjectHTML = getSubjectHTML();
      if (subjectHTML === "<p></p>\n") {
        toast.error("You forgot to add subject for the mail.", {
          closeOnClick: true,
        });
        setIsLoading(false);
        return;
      }

      if (subjectHTML.length >= 70) {
        toast.error("Please limit subject to 70 characters.", {
          closeOnClick: true,
        });
        setIsLoading(false);
        return;
      }

      let invalid = false;
      invalid = inputs.some((input) => {
        return !/^[^@]+@[^@]+\.[^@]+$/.test(input.value);
      });
      if (invalid) {
        toast.error("Please enter valid email ID.", {
          closeOnClick: true,
        });
        setIsLoading(false);
        return;
      }

      const currentTime = String(new Date())

      const sentMailData = {
        date: currentTime,
        recipients: inputs.map((input) => input.value),
        subjectJSX: getSubjectHTML(),
        bodyJSX: getBodyHTML(),
        read: false,
        starred: false,
      };

      // sending to sent mails of sender

      const res = await axios.post(
        `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}/sent.json`,
        sentMailData
      );
      console.log("response from realtime db post", res);
      console.log("email", userEmail);

      const id = res.data?.name;

      dispatch(
        mailActions.addToSentMailList({
          ...sentMailsList,
          [id]: { ...sentMailData },
        })
      );

      //sending to Inbox mails of reciever(s)
      inputs.forEach(async (input) => {
        const encoded = input.value.replace(/\./g, "_");

        const inboxMailData = {
          date: currentTime,
          sender: userEmail,
          subjectJSX: getSubjectHTML(),
          bodyJSX: getBodyHTML(),
          read: false,
          starred: false,
        };

        const res = await axios.post(
          `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${encoded}/inbox.json`,
          inboxMailData
        );
        console.log("response from realtime db post", res);
        console.log("email", userEmail);

        const id = res.data?.name;

        if (input.value === userEmail) {
          dispatch(mailActions.addToInboxMailList({
              ...inboxMailsList,
              [id]: { ...inboxMailData },
            })
          );
        }
      });

      // Reset input fields
      setInputs([{ id: 1, value: "" }]);
      setEditorState1(EditorState.createEmpty());
      setEditorState2(EditorState.createEmpty());

      console.log(sentMailsList);
      setShow(false);
      setIsLoading(false);
      toast.success("Mail Sent", { closeOnClick: true });
    } catch (err) {
      toast.error("Something went wrong!", { closeOnClick: true });
      console.log(err);
      setIsLoading(false);
    }
  };

  // Track the currently active editor
  const [activeEditor, setActiveEditor] = useState("editor1");

  const [inputs, setInputs] = useState([{ id: 1, value: "" }]);

  const addInputField = () => {
    setInputs([...inputs, { id: inputs.length + 1, value: "" }]);
  };

  const removeInputField = (id) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const handleChange = (id, event) => {
    const newInputs = inputs.map((input) =>
      input.id === id ? { ...input, value: event.target.value } : input
    );
    setInputs(newInputs);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Mail Editor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="custom-wrapper">
          <div className="mailto">
            <label className="me-2">To</label>
            <input
              id="1"
              className="rounded-start border ps-2"
              type="email"
              value={inputs[0]?.value}
              onChange={(e) => handleChange(inputs[0].id, e)}
              placeholder={`Email ${inputs[0].id}`}
            />
            {inputs
              .map((input, i) => (
                <div key={input.id} className="d-flex">
                  <input
                    className="rounded-start border ps-2"
                    type="email"
                    value={input.value}
                    onChange={(e) => handleChange(input.id, e)}
                    placeholder={`Email ${input.id}`}
                  />
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeInputField(input.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
              .filter((input, i) => i !== 0)}
            <button className="btn btn-sm btn-primary" onClick={addInputField}>
              Add Email
            </button>
          </div>
          {/* subject Editor */}
          <div onClick={() => setActiveEditor("editor1")}>
            <Editor
              editorState={editorState1}
              editorClassName="subject-editor"
              placeholder="Subject:"
              toolbarHidden
              onEditorStateChange={setEditorState1}
            />
          </div>

          {/* body Editor */}
          <div onClick={() => setActiveEditor("editor2")}>
            <Editor
              editorState={editorState2}
              editorClassName="body-editor"
              placeholder="Start typing here..."
              toolbarHidden
              onEditorStateChange={setEditorState2}
            />
          </div>

          <Editor
            editorState={
              activeEditor === "editor1" ? editorState1 : editorState2
            }
            onEditorStateChange={(state) => {
              if (activeEditor === "editor1") {
                setEditorState1(state);
              } else {
                setEditorState2(state);
              }
            }}
            editorClassName="hidden-editor"
            wrapperClassName="hidden-editor"
            toolbar={{
              options: [
                "inline",
                "list",
                "textAlign",
                "link",
                "emoji",
                "image",
              ],
              inline: { options: ["bold", "italic", "underline"] },
              list: { options: ["unordered", "ordered"] },
              image: {
                uploadCallback: (file) =>
                  new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () =>
                      resolve({ data: { link: reader.result } });
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                  }),
                previewImage: false,
              },
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSend}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MailEditor;
