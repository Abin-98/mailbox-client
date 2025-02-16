import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";

const MailEditor = () => {
  const [editorState1, setEditorState1] = useState(EditorState.createEmpty());
  const [editorState2, setEditorState2] = useState(EditorState.createEmpty());

  // Track the currently active editor
  const [activeEditor, setActiveEditor] = useState("editor1");

  return (
    <div className="custom-wrapper">
        <div className="mailto">
            <label className="me-2">To</label>
            <input type="text"></input>
        </div>
        {/* subject Editor */}
      <div onClick={() => setActiveEditor("editor1")}>
        <Editor
          editorState={editorState1}
          editorClassName="subject-editor"
          toolbarHidden
          onEditorStateChange={setEditorState1}
        />
      </div>

      {/* body Editor */}
      <div onClick={() => setActiveEditor("editor2")}>
        <Editor
          editorState={editorState2}
          editorClassName="body-editor"
          toolbarHidden
          onEditorStateChange={setEditorState2}
        />
      </div>

      <Editor
        editorState={activeEditor === "editor1" ? editorState1 : editorState2}
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
          options: ["inline", "list", "textAlign", "link", "emoji", "image"],
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
  );
};

export default MailEditor;
