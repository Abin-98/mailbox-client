import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/reducers/authSlice";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from "react-router-dom";
import { searchActions } from "../Store/reducers/searchSlice";
import SearchIcon from '@mui/icons-material/Search';
import logo from '../assets/logo.png'

function NavBar() {

  const dispatch = useDispatch()
  const name = useSelector(state=>state.auth.userName)
  const searchText = useSelector(state=>state.search.searchText)

  const handleLogout = () => {
    localStorage.clear();
    dispatch(authActions.setIdToken(""));
    dispatch(authActions.setUserName(""));
    dispatch(authActions.setUserEmail(""));
  };

  return (
    <Navbar expand="md" className="py-3" style={{background: "linear-gradient(to bottom, #dbc100, #ffff38, #dbc100)"}} >
      <Container fluid className="d-flex">
        <Navbar.Brand as={Link} to={'/'} style={{maxWidth:"300px"}} className="flex-grow-1 text-light text-center text-xl">
          <img src={logo} alt="logo" width={150} height={40}/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-md`}
          aria-labelledby={`offcanvasNavbarLabel-expand-md`}
          placement="end"
        >
          <Offcanvas.Body>
            <Form className="d-flex w-100 pe-3">
              <Form.Control
                type="search"
                placeholder="Find messages, subjects or people"
                className="rounded-0 rounded-start-2"
                aria-label="Search"
                value={searchText}
                onChange={(e)=>dispatch(searchActions.setSearchText(e.target.value))}
              />
              <Button variant="dark" className="px-4 rounded-0 rounded-end-2"><SearchIcon/></Button>
            </Form>
            <Nav className="justify-content-center align-items-center w-100 flex-grow-1 pe-3">
              <Nav.Link as={Link} to="/" className="d-flex flex-column flex-md-row justify-content-center align-items-center my-md-0 my-3 me-md-3"><HomeIcon className="me-1 text-dark"/><span>Home</span></Nav.Link>
              <AccountCircleIcon className=""/>
              <NavDropdown
                title="Profile"
                id={`offcanvasNavbarDropdown-expand-md`}
              >
                <NavDropdown.Item className="text-primary disabled">
                  {name ? name: "Anonymous User"}
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile">
                  Update Details
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
              </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavBar;
