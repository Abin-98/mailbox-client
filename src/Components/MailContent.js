import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import parse from "html-react-parser";

const MailContent = ({ mailToShow }) => {
  console.log("mail object", mailToShow);
  const newDate = new Date(mailToShow?.date)
  const formattedDate = newDate?.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="container-fluid py-2 border-bottom border-3 border-dark bg-light">
      <div className="d-flex flex-column justify-content-center">
        <div className="h5 p-1 d-flex">
            <span className="me-2">{"Subject: "}</span><span>{parse(mailToShow?.subjectJSX)}</span>
        </div>
        <div className="pb-3">
          {mailToShow?.recipients ? (
            <>
              <span className="p-1">Recipients:</span>
                {mailToShow?.recipients.map((recipient) => (
                  <span className="me-2 p-3 border rounded-pill">
                    <AccountCircleIcon fontSize="large" />
                    <span>{recipient}</span>
                  </span>
                ))}
            </>
          ) : (
            <span>
              {"Sender: "}
              <span>
                <AccountCircleIcon fontSize="large" />
                {mailToShow?.sender}
              </span>
            </span>
          )}
        </div>
      </div>
      <div style={{minHeight:"20rem"}} className="p-3 mb-4 border">
        <div className="d-flex justify-content-end" style={{color:"grey", fontSize:"0.8rem"}}>{formattedDate}</div>
        {parse(mailToShow?.bodyJSX)}
    </div>
    </div>
  );
};

export default MailContent;
