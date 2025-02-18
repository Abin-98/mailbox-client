import React, { useEffect, useState } from "react";
import MailEditor from "../Components/MailEditor";
import ad1 from "../assets/ad1.jpg";
import ad2 from "../assets/ad2.jpg";
import ad3 from "../assets/ad3.png";
import { useDispatch, useSelector } from "react-redux";
import InboxMail from "../Components/InboxMail";
import { Button, Form, Modal } from "react-bootstrap";
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MailContent from "../Components/MailContent";
import axios from "axios";
import { toast } from "react-toastify";
import { mailActions } from "../Store/reducers/mailSlice";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const Home = () => {
  const [show, setShow] = useState(false);
  const [closeAd, setCloseAd] = useState({ 1: 0, 2: 0, 3: 0 });
  const sentMailsList = useSelector((state) => state.mail.sentMailsList);
  const inboxMailsList = useSelector(state=>state.mail.inboxMailsList)
  const [page, setPage] = useState("home")
  const [mailOpened, setMailOpened] = useState(false)
  const [mailToShow, setMailToShow] = useState(undefined)
  const dispatch = useDispatch()
  const userEmail = useSelector((state) => state.auth.userEmail);
  const emailEncoded = userEmail.replace(/\./g, "_");
  const [IDsToDelete, setIDsToDelete] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const searchText = useSelector(state=>state.search.searchText)
  const [showModal, setShowModal] = useState(false);

  const retrieveIDtoShow=({sent, id, action, openMail})=>{
    if(action==="show") {
      const mailsList = sent ? sentMailsList : inboxMailsList
      console.log("sent from inboxMail.js", sent);
      console.log(id);
      setMailToShow(mailsList[id])
      setMailOpened(openMail)
    }
    else if(action ==="delete") {
      console.log(id);
      
      setIDsToDelete(prev=>[...prev, {sent, id}])
    }
  }

  const handleDeleteAll = ()=>{

    console.log(IDsToDelete);
    if(!IDsToDelete.length){
      toast.error("Please select atleast one mail to delete", {closeOnClick: true})
      setShowModal(false)
      return
    }
    IDsToDelete.forEach(async(item)=>{
    try {
    const url = item.sent
    ? `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}/sent/${item.id}.json`
    : `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}/inbox/${item.id}.json`;
    const mailsList = item.sent ? sentMailsList : inboxMailsList
    const newMailsList = { ...mailsList };
    delete newMailsList[item.id];

    const response = await axios.delete(url);
    console.log(response);
    item.sent ?
      dispatch(mailActions.addToSentMailList({ ...newMailsList }))
    :
      dispatch(mailActions.addToInboxMailList({ ...newMailsList }));

    setShowModal(false)
    } 
    catch (err) {
      console.log(err);
    }
    })
  }

  const inboxNumber = inboxMailsList ? Object.keys(inboxMailsList)?.length : 0
  const sentNumber = sentMailsList ? Object.keys(sentMailsList)?.length : 0
  const unreadNumber = inboxMailsList ? Object.values(inboxMailsList)?.reduce((acc, curr)=>(!curr.read ? acc+1: acc),0) : 0
  const starredInboxNumber = inboxMailsList ? Object.values(inboxMailsList)?.reduce((acc, curr)=>(curr.starred ? acc+1: acc),0) : 0
  const starredSentNumber = sentMailsList ? Object.values(sentMailsList)?.reduce((acc, curr)=>(curr.starred ? acc+1: acc),0) : 0

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}/sent.json`,
          {
            signal: controller.signal,
          }
        );
        console.log("sent mails data", response.data);

        if (isMounted) {
        dispatch(mailActions.addToSentMailList(response.data));
        }
        const response2 = await axios.get(
          `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}/inbox.json`,
          {
            signal: controller.signal,
          }
        );
        console.log("inbox mails data",response2.data);

        if (isMounted) {
        dispatch(mailActions.addToInboxMailList(response2.data));
        }

      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled: ", error.message);
        } else {
          console.log("Error fetching data: ", error);
        }
      } finally {
        if (isMounted) {
          setTimeout(fetchData, 5000); // Call fetchData again after 5 seconds
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; 
      controller.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <MailEditor show={show} setShow={setShow}/>

          <div className={`side_bar ${page==="home" && "border border-dark"}`} onClick={()=>{setMailOpened(false); setPage("home")}}><span>Inbox</span><span>{inboxNumber}</span></div>
          <div className={`side_bar ${page==="unread" && "border border-dark"}`} onClick={()=>{setMailOpened(false); setPage("unread")}}><span>Unread</span><span>{unreadNumber}</span></div>
          <div className={`side_bar ${page==="star" && "border border-dark"}`} onClick={()=>{setMailOpened(false); setPage("star")}}><span>Starred</span><span>{starredInboxNumber+starredSentNumber}</span></div>
          <div className={`side_bar ${page==="sent" && "border border-dark"}`} onClick={()=>{setMailOpened(false); setPage("sent")}}><span>Sent</span><span>{sentNumber}</span></div>
        </div>

        {/* middle part */}
        {mailOpened ? 
        <div className="col-7 p-0 rounded-4 rounded-top">
          <div className="d-flex justify-content-start border-bottom border-3 p-3" role="button" onClick={()=>setMailOpened(false)}>
            <KeyboardBackspaceIcon />
            <span className="ms-2">
              Back
            </span>
          </div>
            <MailContent mailToShow={mailToShow}/>
          </div> 
          :
        <div className="col-7 p-0 rounded-4 rounded-top">
          <div className="d-flex justify-content-between border-bottom border-3 p-3">
            <Form>
              <Form.Check
                type="checkbox"
                checked={selectAll}
                onChange={(e) => setSelectAll(prev=>!prev)}
                role="button"
              />
            </Form>
            <Tooltip title="Delete selected mails" arrow>
              <DeleteIcon role="button" onClick={()=>setShowModal(true)}/>
            </Tooltip>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title className="d-flex align-items-center">
                <ReportProblemIcon className="me-2 text-primary" />
                <span className="text-primary">Delete Mails ?</span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{"Are you sure you want to delete all the selected mail(s) ?"}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-dark"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
              <Button variant="danger" onClick={handleDeleteAll}>
                Delete All
              </Button>
            </Modal.Footer>
          </Modal>
          </div>
          {page==="home" && inboxMailsList && Object.keys(inboxMailsList)?.reverse().filter((id)=>{
            const str = inboxMailsList[id].sender + inboxMailsList[id].subjectJSX + inboxMailsList[id].bodyJSX
            const regex = new RegExp(searchText, "gi"); 
            return regex.test(str)
          }).map((id) => (
            <InboxMail mailData={inboxMailsList[id]} key={id} id={id} sent={false} sendIDtoHome={retrieveIDtoShow}/>
          ))}

          {page==="unread" && inboxMailsList && Object.keys(inboxMailsList)?.reverse().filter((id)=>{
            const str = inboxMailsList[id].sender + inboxMailsList[id].subjectJSX + inboxMailsList[id].bodyJSX
            const regex = new RegExp(searchText, "gi"); 
            return regex.test(str)
          }).filter((id)=>inboxMailsList[id].read)?.map((id) => (
            <InboxMail mailData={inboxMailsList[id]} key={id} id={id} sent={false} sendIDtoHome={retrieveIDtoShow}/>
          ))}

          {page==="star" && inboxMailsList && Object.keys(inboxMailsList)?.reverse().filter((id)=>{
            const str = inboxMailsList[id].sender + inboxMailsList[id].subjectJSX + inboxMailsList[id].bodyJSX
            const regex = new RegExp(searchText, "gi"); 
            return regex.test(str)
          }).filter((id)=>inboxMailsList[id].starred)?.map((id) => (
            <InboxMail mailData={inboxMailsList[id]} key={`inbox_${id}`} id={id} sent={false} sendIDtoHome={retrieveIDtoShow}/>
          ))}

          {page==="star" && sentMailsList && Object.keys(sentMailsList)?.reverse().filter((id)=>{
            const str = sentMailsList[id].recipients[0] + sentMailsList[id].subjectJSX + sentMailsList[id].bodyJSX
            const regex = new RegExp(searchText, "gi"); 
            return regex.test(str)
          }).filter((id)=>sentMailsList[id].starred)?.map((id) => (
            <InboxMail mailData={sentMailsList[id]} key={`sent_${id}`} id={id} sent={true} sendIDtoHome={retrieveIDtoShow}/>
          ))}

          {page==="sent" && sentMailsList && Object.keys(sentMailsList)?.reverse().filter((id)=>{
            const str = sentMailsList[id].recipients[0] + sentMailsList[id].subjectJSX + sentMailsList[id].bodyJSX
            const regex = new RegExp(searchText, "gi"); 
            return regex.test(str)
          }).map((id) => (
            <InboxMail mailData={sentMailsList[id]} key={id} id={id} sent={true} sendIDtoHome={retrieveIDtoShow}/>
          ))}

        </div>
        }

        {/* Left side */}
        <div className="col-3 d-flex flex-column align-items-center pt-3" style={{backgroundColor:"#d6d6d6"}}>
          <div className={`mb-3 position-relative ${closeAd[1] && "d-none"} w-full`} style={{height:"250px"}} >
            <button
              onClick={() => setCloseAd((prev) => ({ ...prev, 1: 1 }))}
              className="btn btn-sm btn-danger position-absolute top-0 start-0"
            >
              x
            </button>
            <img
              src={ad1}
              alt="ad1"
              className="responsive-img"
            />
          </div>
          <div className={`mb-3 position-relative ${closeAd[2] && "d-none"} w-full`} style={{height:"250px"}}>
            <button
              onClick={() => setCloseAd((prev) => ({ ...prev, 2: 1 }))}
              className="btn btn-sm btn-danger position-absolute top-0 start-0"
            >
              x
            </button>
            <img
              src={ad2}
              alt="ad2"
              className="responsive-img"
            />
          </div>
          <div className={`position-relative ${closeAd[3] && "d-none"} w-full`} style={{height:"250px"}}>
            <button
              onClick={() => setCloseAd((prev) => ({ ...prev, 3: 1 }))}
              className="btn btn-sm btn-danger position-absolute top-0 start-0"
            >
              x
            </button>
            <img
              src={ad3}
              alt="ad3"
              className="responsive-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
