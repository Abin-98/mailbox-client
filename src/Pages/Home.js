import React, { useEffect, useState } from "react";
import MailEditor from "../Components/MailEditor";
import ad1 from "../assets/ad1.jpg";
import ad2 from "../assets/ad2.jpg";
import ad3 from "../assets/ad3.png";
import { useDispatch, useSelector } from "react-redux";
import InboxMail from "../Components/InboxMail";
import { Button, Modal } from "react-bootstrap";
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MailContent from "../Components/MailContent";
import axios from "axios";
import { toast } from "react-toastify";
import { mailActions } from "../Store/reducers/mailSlice";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CreateIcon from '@mui/icons-material/Create';

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
  const searchText = useSelector(state=>state.search.searchText)
  const [showModal, setShowModal] = useState(false);

  const retrieveIDtoShow=({sent, id, action, openMail, isChecked})=>{
    if(action==="show") {
      const mailsList = sent ? sentMailsList : inboxMailsList
      console.log("sent from inboxMail.js", sent);
      console.log(id);
      setMailToShow(mailsList[id])
      setMailOpened(openMail)
    }
    else if(action ==="delete") {
      setIDsToDelete(prev => isChecked ? [...prev, {sent, id}] : prev.filter((item) => item.id!==id))
      console.log(IDsToDelete);
    }
  }

  const handleDeleteAll = () => {
    console.log(IDsToDelete);
    if(!IDsToDelete.length){
      toast.error("Please select atleast one mail to delete", {closeOnClick: true})
      setShowModal(false)
      return
    }
    let isSent;
    let newMailsList;

    try {
      IDsToDelete.forEach(async(item,i)=>{
      if(i === 0){
        isSent = item.sent
        newMailsList = isSent ? {...sentMailsList} : {...inboxMailsList}
      }

      const url = isSent
      ? `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}/sent/${item.id}.json`
      : `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}/inbox/${item.id}.json`;

      delete newMailsList[item.id];

      const response = await axios.delete(url);
    
      console.log(response);
    })
    isSent ? dispatch(mailActions.addToSentMailList({ ...newMailsList })) 
    : dispatch(mailActions.addToInboxMailList({ ...newMailsList }));
    } 
    catch (err) {
      toast.error("Something went wrong", {closeOnClick: true})
      console.log(err);
    }
    finally{
    setShowModal(false)
    setIDsToDelete([])
    }
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
    <section className="container-fluid" style={{backgroundColor:"#888888"}}>
      <div className="row min-vh-100">

        {/*Right side*/}
        <div className="col-md-2 col-12 d-flex flex-column align-items-center p-3" style={{background: "linear-gradient(to right, #000000, #888888)"}}>
          <button
            className="btn btn-primary w-100 p-2 my-4 zoom"
            onClick={() => setShow(true)}
          ><CreateIcon className="me-1 mb-2"/>
            Compose
          </button>
          <MailEditor show={show} setShow={setShow}/>

          <div className={`side_bar ${page==="home" && "border border-light"}`} onClick={()=>{setMailOpened(false); setPage("home")}}><span>Inbox</span><span>{inboxNumber}</span></div>
          <div className={`side_bar ${page==="unread" && "border border-light"}`} onClick={()=>{setMailOpened(false); setPage("unread")}}><span>Unread</span><span>{unreadNumber}</span></div>
          <div className={`side_bar ${page==="star" && "border border-light"}`} onClick={()=>{setMailOpened(false); setPage("star")}}><span>Starred</span><span>{starredInboxNumber+starredSentNumber}</span></div>
          <div className={`side_bar ${page==="sent" && "border border-light"}`} onClick={()=>{setMailOpened(false); setPage("sent")}}><span>Sent</span><span>{sentNumber}</span></div>
        </div>

        {/* middle part */}
        {mailOpened ? 
        <div className="col-md-7 col-12 p-0 bg-light rounded-4 rounded-bottom-0 mt-2">
          <div className="mt-1 d-flex justify-content-start border-bottom border-dark p-3" role="button" onClick={()=>setMailOpened(false)}>
            <KeyboardBackspaceIcon />
            <span className="ms-2">
              Back
            </span>
          </div>
            <MailContent mailToShow={mailToShow}/>
          </div> 
          :
        <div className="col-md-7 vh-100 col-12 p-0 rounded-4 rounded-bottom-0 bg-light border-dark mt-2">
          <div className="d-flex justify-content-end shadow-lg p-3">

            <Tooltip title="Delete selected mails" arrow>
              <DeleteIcon role="button" className="magnify_hover" onClick={()=>setShowModal(true)}/>
            </Tooltip>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title className="d-flex align-items-center">
                <ReportProblemIcon className="me-2 text-primary" />
                <span className="text-primary">Delete Mails ?</span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{`Are you sure you want to delete all the ${IDsToDelete.length} selected mail(s) ?`}</Modal.Body>
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
            <InboxMail mailData={inboxMailsList[id]} key={`inbox_${id}`} id={id} sent={false} sendIDtoHome={retrieveIDtoShow} />
          ))}

          {page==="star" && sentMailsList && Object.keys(sentMailsList)?.reverse().filter((id)=>{
            const str = sentMailsList[id].recipients[0] + sentMailsList[id].subjectJSX + sentMailsList[id].bodyJSX
            const regex = new RegExp(searchText, "gi"); 
            return regex.test(str)
          }).filter((id)=>sentMailsList[id].starred)?.map((id) => (
            <InboxMail mailData={sentMailsList[id]} key={`sent_${id}`} id={id} sent={true} sendIDtoHome={retrieveIDtoShow} />
          ))}

          {page==="sent" && sentMailsList && Object.keys(sentMailsList)?.reverse().filter((id)=>{
            const str = sentMailsList[id].recipients[0] + sentMailsList[id].subjectJSX + sentMailsList[id].bodyJSX
            const regex = new RegExp(searchText, "gi"); 
            return regex.test(str)
          }).map((id) => (
            <InboxMail mailData={sentMailsList[id]} key={id} id={id} sent={true} sendIDtoHome={retrieveIDtoShow} />
          ))}

        </div>
        }

        {/* Left side */}
        <div className="col-md-3 col-12 d-flex flex-column align-items-center pt-3" style={{background: "linear-gradient(to left, #000000, #888888)"}}>
          <div className={`my-3 position-relative ${closeAd[1] && "d-none"} w-full`} style={{height:"250px"}} >
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
