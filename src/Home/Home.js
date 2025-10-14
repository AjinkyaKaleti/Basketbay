import { useContext, useRef, useEffect } from "react";
import Context from "../Context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faClipboardList,
  faUserPlus,
  faCartShopping,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

function Home() {
  const {
    setView,
    selectedMenu,
    setSelectedMenu,
    setIsLogoClick,
    isOtpVerified,
  } = useContext(Context);
  const collapseRef = useRef(null);

  useEffect(() => {
    if (isOtpVerified) {
      setSelectedMenu("Products"); // Expand "Products" card if logged in
    } else {
      setSelectedMenu("Login"); // Expand "Login" card if not logged in
    }
  }, [isOtpVerified, setSelectedMenu]);

  const handleMenuClick = (onClick, menuItem) => {
    setSelectedMenu(menuItem);
    if (collapseRef.current) {
      const bsCollapse = new window.bootstrap.Collapse(collapseRef.current, {
        toggle: false,
      });
      bsCollapse.hide();
    }
    onClick();
  };

  const menuItems = [
    {
      text: "Login",
      icon: faRightToBracket,
      backgroundImage: "/MenuImages/loginImage.jpg",
      onClick: () => {
        setIsLogoClick(false);
        setView("Login");
      },
      disabled: isOtpVerified, // hide login if logged in
    },
    {
      text: "SignUp",
      icon: faUserPlus,
      backgroundImage: "/MenuImages/signUpImage.jpg",
      onClick: () => {
        setIsLogoClick(false);
        setView("SignUp");
      },
      disabled: isOtpVerified, // hide signup if logged in
    },
    {
      text: "Products",
      icon: faClipboardList,
      backgroundImage: "/MenuImages/productsImage.jpg",
      onClick: () => {
        setIsLogoClick(false);
        setView("Products");
      },
      disabled: !isOtpVerified, // disable if not logged in
    },
    {
      text: "Orders",
      icon: faCartShopping,
      backgroundImage: "/MenuImages/ordersImage.jpg",
      onClick: () => {
        setIsLogoClick(false);
        setView("Orders");
      },
      disabled: !isOtpVerified, // disable if not logged in
    },
    {
      text: "Recent",
      icon: faClockRotateLeft,
      backgroundImage: "/MenuImages/recentOrderMenu.jpg",
      onClick: () => {
        setIsLogoClick(false);
        setView("RecentOrder");
      },
      disabled: !isOtpVerified, // disable if not logged in
    },
  ];

  return (
    <>
      <div className="container">
        {menuItems.map((item) => (
          <div
            key={item.text}
            className={`card ${selectedMenu === item.text ? "selected" : ""} ${
              item.disabled ? "disabled-card" : ""
            }`}
            style={{ backgroundImage: `url(${item.backgroundImage})` }}
            onClick={() =>
              !item.disabled && handleMenuClick(item.onClick, item.text)
            }
          >
            {/* img */}
            <div className="card-content">
              <div className="Icon-div">
                <FontAwesomeIcon
                  icon={item.icon}
                  className="MenuIcons"
                  onClick={() => {
                    handleMenuClick(item.onClick);
                  }}
                />
              </div>

              <div className="title-div">
                <h3
                  className="title"
                  onClick={() => {
                    handleMenuClick(item.onClick);
                  }}
                >
                  {item.text}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
