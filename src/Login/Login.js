import React, { useContext, useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMask, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";
import Context from "../Context/Context";
import axios from "axios";
import ToastMessage from "../ToastMessage/ToastMessage";

function Login() {
  const {
    isPasswordVisible,
    setIsPasswordVisible,
    username,
    setUsername,
    formValues,
    setFormValues,
    setView,
    isOtpVerified,
    setIsOtpVerified,
    setSelectedMenu,
    toast,
    setToast,
  } = useContext(Context);

  const userNameRef = useRef(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailToSendOtp, setEmailToSendOtp] = useState(""); // email found in DB

  useEffect(() => {
    userNameRef.current.value = ""; // Clear the username field
    userNameRef.current.focus(); //focus first load
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "otp") setOtp(value);
  };

  //----------------Send OTP------------------
  const sendOtp = async () => {
    console.log(`REACT_APP_SERVER_URL: ${process.env.REACT_APP_SERVER_URL}`);
    if (!username)
      return setToast({
        show: true,
        message: "Please enter email id",
        type: "warning",
      });

    try {
      // Find email if user entered mobile number
      let email = username.includes("@") ? username : "";
      if (!email) {
        const res = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/auth/find-email-by-mobile`,
          {
            mobile: username,
          }
        );
        email = res.data.email;
        if (!email)
          return setToast({
            show: true,
            message: "No user found with this mobile number",
            type: "warning",
          });
      }

      setEmailToSendOtp(email);

      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/auth/send-otp`,
        { email }
      );
      setToast({
        show: true,
        message: `OTP sent to ${email}`,
        type: "success",
      });
      setOtpSent(true);
    } catch (err) {
      setToast({
        show: true,
        message: `${err.response?.data?.message} || Error sending OTP`,
        type: "error",
      });
    }
  };

  //----------------Verify OTP------------------
  const verifyOtp = async () => {
    if (otp.length !== 6)
      return setToast({
        show: true,
        message: "Enter 6-digit OTP",
        type: "error",
      });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/auth/verify-otp`,
        {
          email: emailToSendOtp,
          otp,
        }
      );

      if (res.data.success) {
        const loginRes = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/auth/otp-login`,
          {
            email: emailToSendOtp,
          }
        );

        const backendUser = loginRes.data.user;

        // Store token & user from same response
        localStorage.setItem("token", loginRes.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: backendUser._id,
            firstname: backendUser.firstname,
            lastname: backendUser.lastname,
            email: backendUser.email,
            age: backendUser.age,
            gender: backendUser.gender,
            address: backendUser.address,
            pincode: backendUser.pincode,
            mobileno: backendUser.mobileno,
            isOtpVerified: backendUser.isOtpVerified,
            isAdmin: backendUser.isAdmin,
          })
        );

        // Update context
        setFormValues({ ...backendUser, isLoggedIn: true });

        setIsOtpVerified(true);
        setView("Products");
        setSelectedMenu("Products");
        setToast({
          show: true,
          message: `Welcome, ${loginRes.data.firstname}!`,
          type: "success",
        });
      } else {
        setIsOtpVerified(false);
        setOtp("");
        setToast({
          show: true,
          message: "Invalid OTP",
          type: "warning",
        });
      }
    } catch (err) {
      setIsOtpVerified(false);
      setOtp("");
      setToast({
        show: true,
        message: "OTP verification failed",
        type: "error",
      });
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="row py-1">
          <div className="text-center">
            <h1>Login</h1>
          </div>
        </div>

        <div className="row py-1">
          <div className="text-center col-xs-8 col-sm-8 col-md-4 col-lg-4 col-xl-4 offset-xs-2 offset-sm-2 offset-md-4 offset-lg-4 offset-xl-4">
            <div className="input-group">
              <input
                name="username"
                type="text"
                className="form-control"
                placeholder="Email id"
                aria-label="Username"
                aria-describedby="basic-addon1"
                ref={userNameRef}
                autoComplete="off"
                value={username}
                onChange={handleInputChange}
                disabled={formValues.isLoggedIn}
              />
              <span className="input-group-text" id="basic-addon1">
                <button
                  className="username-icon"
                  onClick={sendOtp}
                  disabled={otpSent || !username || formValues.isLoggedIn}
                  title="Send OTP"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="text-center col-xs-8 col-sm-8 col-md-4 col-lg-4 col-xl-4 offset-xs-2 offset-sm-2 offset-md-4 offset-lg-4 offset-xl-4">
            <div className="input-group">
              <input
                name="otp"
                type={isPasswordVisible ? "text" : "password"}
                className="form-control"
                placeholder="Email OTP"
                aria-label="otp"
                aria-describedby="basic-addon2"
                autoComplete="off"
                value={otp}
                onChange={handleInputChange}
              />
              <span className="input-group-text" id="basic-addon2">
                <FontAwesomeIcon
                  icon={faMask}
                  className="password-icon"
                  onMouseEnter={() => {
                    setIsPasswordVisible(true);
                  }}
                  onMouseLeave={() => {
                    setIsPasswordVisible(false);
                  }}
                  style={isPasswordVisible ? { color: "#000" } : { color: "" }}
                />
              </span>
            </div>
          </div>
        </div>

        <div className="row py-5">
          <div className="text-center col-xs-8 col-sm-8 col-md-4 col-lg-4 col-xl-4 offset-xs-2 offset-sm-2 offset-md-4 offset-lg-4 offset-xl-4">
            <div className="input-group">
              <button
                name="loginButton"
                id="loginButton"
                type="button"
                className="form-control btn btn-primary"
                aria-label="loginButton"
                aria-describedby="basic-addon1"
                onClick={verifyOtp}
                disabled={!username || otp.length !== 6 || isOtpVerified}
              >
                {isOtpVerified ? "OTP Verified" : "Verify OTP"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
}

export default Login;
