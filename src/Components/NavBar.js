import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";

function NavBar() {
  return (
    <Navbar expand="md" className="py-3" style={{ backgroundColor: "#75b9f9" }}>
      <Container fluid>
        <Navbar.Brand href="#action0" className="text-light w-25 text-center text-xl">
          MailNest
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
            <Form className="d-flex w-50 pe-3">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 "
                aria-label="Search"
              />
              <Button variant="outline-dark">Search</Button>
            </Form>
            <Nav className="justify-content-center flex-grow-1 pe-3">
              <Nav.Link href="#action1">Home</Nav.Link>
              <NavDropdown
                title="Profile"
                id={`offcanvasNavbarDropdown-expand-md`}
              >
                <NavDropdown.Item href="#action3">
                  View Profile
                </NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Update Details
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">Logout</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#action2">Link</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavBar;
