import { useContext, useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Home from "./Home/Home";
import Context from "./Context/Context";
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp";
import Orders from "./Orders/Orders";
import RecentOrder from "./RecentOrder/RecentOrder";
// import Error from "./Error/Error";
import "./App.css";
import Products from "./Products/Products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlugCircleMinus,
  faBars,
  faUser,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import AdminTabs from "./AdminPanelTabs/AdminPanelTabs";
import CustomerProfile from "./CustomerProfile/CustomerProfile";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

function App() {
  const {
    currentView,
    formValues,
    setFormValues,
    isLogoclick,
    setIsLogoClick,
    handleLogout,
    logout,
  } = useContext(Context);

  const logoRef = useRef(null);
  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShowProfile = () => setShowProfileModal(true);
  const handleCloseProfile = () => setShowProfileModal(false);

  // Animate logo on mount
  useEffect(() => {
    const logoElement = logoRef.current;
    if (logoElement) {
      logoElement.classList.add("scale-animation");
      const timer = setTimeout(() => {
        logoElement.classList.remove("scale-animation");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.classList.contains("menu-icon")
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check JWT token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds

        if (decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setFormValues({});
          alert("Session expired. Please login again.");
        } else {
          // Token valid, restore user
          const user = JSON.parse(localStorage.getItem("user"));
          setFormValues({ ...user, isLoggedIn: true });
        }
      } catch (err) {
        // Invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setFormValues({});
      }
    }
  }, [setFormValues]);

  const renderContent = () => {
    if (logout) return <Login />;

    switch (currentView) {
      case "Login":
        return <Login />;
      case "SignUp":
        return <SignUp />;
      case "Orders":
        return <Orders />;
      case "Products":
        return <Products />;
      case "RecentOrder":
        return <RecentOrder />;
      default:
        return <Login />;
    }
  };

  const handleLogoutClick = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      handleLogout();
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/auth/admin`,
        { password: password.trim() }
      );
      if (response.data.success) {
        alert(response.data.msg);
        setIsLogoClick(true);
        setPassword("");
        handleClose();
      } else {
        alert("Invalid password!");
      }
    } catch (error) {
      alert("Server error!");
    }
  };

  return (
    <>
      <div className="app-home">
        <div className="navbar">
          <div className="profile-left">
            <div className="profile-greeting">
              <FontAwesomeIcon
                icon={faBars}
                className="menu-icon"
                onClick={() => setShowMenu(!showMenu)}
              />
            </div>
          </div>

          {showMenu && (
            <div className="vertical-menu" ref={menuRef}>
              <div className="menu-item" onClick={handleShowProfile}>
                <div className="icon">
                  <FontAwesomeIcon icon={faUser} className="profile-icon" />
                </div>
                <div className="label">
                  {formValues.isLoggedIn ? formValues.firstname : "User"}
                </div>
              </div>
              <div className="menu-item" onDoubleClick={handleShow}>
                <div className="icon">
                  <FontAwesomeIcon icon={faShield} className="profile-icon" />
                </div>
                <div className="label">Admin</div>
              </div>
            </div>
          )}

          <div className="logo-center">
            <img
              alt="BasketBay"
              src="/logo.png"
              className="logo"
              ref={logoRef}
              title="BasketBay"
            />
          </div>

          {formValues.isLoggedIn && (
            <div className="logout-right">
              <FontAwesomeIcon
                icon={faPlugCircleMinus}
                className="logout-icon"
                onClick={handleLogoutClick}
                title="Logout"
              />
            </div>
          )}
        </div>
      </div>

      <div className="app-container">
        <div>
          <Home />
          {isLogoclick ? <AdminTabs /> : renderContent()}
        </div>
      </div>

      {formValues.isLoggedIn ? (
        <CustomerProfile
          show={showProfileModal}
          handleClose={handleCloseProfile}
        />
      ) : (
        <div
          className="toast align-items-center show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              Please login to access your profile
            </div>
            <button
              type="button"
              className="btn-close me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}

      <Modal show={show} onHide={handleClose} size="sm" centered>
        <Modal.Header closeButton>
          <Modal.Title>Admin Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="adminPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleLogin}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
