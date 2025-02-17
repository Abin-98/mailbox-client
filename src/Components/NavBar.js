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

function NavBar() {

  const dispatch = useDispatch()
  const name = useSelector(state=>state.auth.userName)

  const handleLogout = () => {
    localStorage.clear();
    dispatch(authActions.setIdToken(null));
  };

  return (
    <Navbar expand="md" className="py-3" style={{ backgroundColor: "#b2b2b2" }}>
      <Container fluid className="d-flex">
        <Navbar.Brand href="#action0" style={{maxWidth:"300px"}} className=" flex-grow-1 text-light text-center text-xl">
        📬 MailNest
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-md`}
          aria-labelledby={`offcanvasNavbarLabel-expand-md`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
              Offcanvas
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form className="d-flex w-50 flex-grow-1 pe-3">
              <Form.Control
                type="search"
                placeholder="Find messages, subjects or people"
                className="me-2 "
                aria-label="Search"
              />
              <Button variant="outline-dark">Search</Button>
            </Form>
            <Nav className="justify-content-center align-items-center w-25 pe-3">
              <Nav.Link as={Link} to="/" className="d-flex align-items-center me-3"><HomeIcon className="me-1"/>Home</Nav.Link>
              <AccountCircleIcon className=""/>
              <NavDropdown
                title="Profile"
                id={`offcanvasNavbarDropdown-expand-md`}
              >
                <NavDropdown.Item as={Link} to="/profile" className="text-primary disabled">
                  {name ? name: "Anonymous User"}
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/update">
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
