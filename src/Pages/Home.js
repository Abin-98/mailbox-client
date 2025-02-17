import React, { useState } from "react";
import MailEditor from "../Components/MailEditor";
import ad1 from "../assets/ad1.jpg";
import ad2 from "../assets/ad2.jpg";
import ad3 from "../assets/ad3.png";
import { useSelector } from "react-redux";
import InboxMail from "../Components/InboxMail";
import { Form } from "react-bootstrap";
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const Home = () => {
  const [show, setShow] = useState(false);
  const [closeAd, setCloseAd] = useState({ 1: 0, 2: 0, 3: 0 });
  const mailsList = useSelector((state) => state.mail.mailsList);
  const [allChecked, setAllChecked] = useState(false)
  const [page, setPage] = useState("home")
  const [mailOpened, setMailOpened] = useState(false)
  console.log(mailsList);


  const handleDelete = ()=>{
    console.log("delete");
  }

  const sentNumber = Object.keys(mailsList).length
  const deletedNumber = Object.values(mailsList).reduce((acc, curr)=>(curr.deleted ? acc+1: acc),0)
  const unreadNumber = Object.values(mailsList).reduce((acc, curr)=>(!curr.read ? acc+1: acc),0)
  const starredNumber = Object.values(mailsList).reduce((acc, curr)=>(curr.starred ? acc+1: acc),0)

  return (
    <section className="container-fluid">
      {/* Right side */}
      <div className="row vh-100">
        <div className="col-2 d-flex flex-column align-items-center p-3" style={{backgroundColor:"#d6d6d6"}}>
          <button
            className="btn btn-primary w-100 p-3 mb-3"
            onClick={() => setShow(true)}
          >
            Compose
          </button>
          <MailEditor show={show} setShow={setShow} />

          <div className="side_bar" onClick={()=>setPage("home")}><span>Sent</span><span>{sentNumber}</span></div>
          <div className="side_bar" onClick={()=>setPage("unread")}><span>Unread</span><span>{unreadNumber}</span></div>
          <div className="side_bar" onClick={()=>setPage("star")}><span>Starred</span><span>{starredNumber}</span></div>
          <div className="side_bar" onClick={()=>setPage("del")}><span>Deleted Items</span><span>{deletedNumber}</span></div>
        </div>

        {/* middle part */}
        {mailOpened? <div className="col-7 p-0 rounded-4 rounded-top">
          <div className="d-flex justify-content-start border-bottom border-3 p-3" role="button" onClick={()=>setMailOpened(false)}>
            <KeyboardBackspaceIcon />
            <span className="ms-2">
              Back
            </span>
          </div>
          <div></div>
          </div> :
        <div className="col-7 p-0 rounded-4 rounded-top">
          <div className="d-flex justify-content-between border-bottom border-3 p-3">
            <Form>
              <Form.Check
                type="checkbox"
                checked={allChecked}
                onChange={(e) => setAllChecked(prev=>!prev)}
                role="button"
              />
            </Form>
            <Tooltip title="Delete selected mails" arrow>
              <DeleteIcon role="button" onClick={handleDelete}/>
            </Tooltip>
          </div>
          {page==="home" && Object.keys(mailsList)?.map((id) => (
            <InboxMail mailData={mailsList[id]} key={id} id={id} setMailOpened={setMailOpened}/>
          ))}
          {page==="unread" && Object.keys(mailsList)?.filter((id)=>mailsList[id].read).map((id) => (
            <InboxMail mailData={mailsList[id]} key={id} id={id} setMailOpened={setMailOpened}/>
          ))}
          {page==="star" && Object.keys(mailsList)?.filter((id)=>mailsList[id].starred).map((id) => (
            <InboxMail mailData={mailsList[id]} key={id} id={id} setMailOpened={setMailOpened}/>
          ))}
          {page==="del" && Object.keys(mailsList)?.filter((id)=>mailsList[id].deleted).map((id) => (
            <InboxMail mailData={mailsList[id]} key={id} id={id} setMailOpened={setMailOpened}/>
          ))}
        </div>
        }

        {/* Left side */}
        <div className="col-3 d-flex flex-column align-items-center pt-3" style={{backgroundColor:"#d6d6d6"}}>
          <div className={`position-relative ${closeAd[1] && "d-none"}`}>
            <button
              onClick={() => setCloseAd((prev) => ({ ...prev, 1: 1 }))}
              className="btn btn-sm btn-danger position-absolute top-0 start-0"
            >
              x
            </button>
            <img
              src={ad1}
              alt="ad1"
              width={300}
              height={250}
              className="mb-3"
            />
          </div>
          <div className={`position-relative ${closeAd[2] && "d-none"}`}>
            <button
              onClick={() => setCloseAd((prev) => ({ ...prev, 2: 1 }))}
              className="btn btn-sm btn-danger position-absolute top-0 start-0"
            >
              x
            </button>
            <img
              src={ad2}
              alt="ad2"
              width={300}
              height={250}
              className="mb-3"
            />
          </div>
          <div className={`position-relative ${closeAd[3] && "d-none"}`}>
            <button
              onClick={() => setCloseAd((prev) => ({ ...prev, 3: 1 }))}
              className="btn btn-sm btn-danger position-absolute top-0 start-0"
            >
              x
            </button>
            <img
              src={ad3}
              alt="ad3"
              width={300}
              height={250}
              className="mb-3"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
