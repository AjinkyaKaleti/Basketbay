import React, { useRef, useEffect, useState, useContext } from "react";
import Context from "../Context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateRight,
  faEnvelopeCircleCheck,
  faLocationDot,
  faMapLocationDot,
  faMobileScreenButton,
  faPerson,
  faPersonDress,
  faUser,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import "./SignUp.css";
import axios from "axios";
import ToastMessage from "../ToastMessage/ToastMessage";

function SignUp() {
  const firstname = useRef(null);
  const { formValues, setFormValues, setView, toast, setToast, serverUrl } =
    useContext(Context);
  useEffect(() => {
    firstname.current.focus(); // Focus first load
  }, []);

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid =
      formValues.firstname.length > 0 &&
      /^[a-zA-Z]+$/.test(formValues.firstname) &&
      formValues.lastname.length > 0 &&
      /^[a-zA-Z]+$/.test(formValues.lastname) &&
      formValues.age >= 1 &&
      formValues.age <= 99 &&
      formValues.email.length > 0 &&
      /\S+@\S+\.\S+/.test(formValues.email) &&
      formValues.address.length > 0 &&
      formValues.pincode.length === 6 &&
      /^[0-9]{6}$/.test(formValues.pincode) &&
      formValues.mobileno.length === 10 &&
      /^[0-9]{10}$/.test(formValues.mobileno) &&
      formValues.otp.length === 6 &&
      /^[0-9]{6}$/.test(formValues.otp) &&
      formValues.gender.length > 0;
    setIsFormValid(isValid);
  }, [formValues]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "radio" ? e.target.id : value,
    });
  };

  const fullname = [
    {
      inputId: "firstname",
      placeholder: "First name",
      type: "text",
      iconClass: "first-name",
      icon: faUser,
      onClick: () => {},
    },
    {
      inputId: "lastname",
      placeholder: "Last name",
      type: "text",
      iconClass: "last-name",
      icon: faUser,
      onClick: () => {},
    },
    {
      inputId: "age",
      placeholder: "Age",
      type: "text",
      iconClass: "age-icon",
      icon: faArrowRotateRight,
      onClick: () => {},
    },
  ];

  const SignUpInputs = [
    {
      inputId: "email",
      placeholder: "Email-id",
      type: "email",
      iconClass: "Email",
      icon: faEnvelopeCircleCheck,
      onClick: () => {},
    },
    {
      inputId: "address",
      placeholder: "House no. 1, Sector 1, MG Road",
      type: "text",
      iconClass: "address",
      icon: faLocationDot,
      onClick: () => {},
    },
    {
      inputId: "pincode",
      placeholder: "400001",
      type: "text",
      iconClass: "pincode",
      icon: faMapLocationDot,
      onClick: () => {},
    },
    {
      inputId: "mobileno",
      placeholder: "8898778866",
      type: "text",
      iconClass: "mobileno",
      icon: faMobileScreenButton,
      onClick: () => {},
    },
  ];

  const genderInputs = [
    {
      inputId: "female",
      type: "radio",
      iconClass: "female",
      icon: faPersonDress,
      onClick: () => {},
    },
    {
      inputId: "male",
      type: "radio",
      iconClass: "male",
      icon: faPerson,
      onClick: () => {},
    },
    {
      inputId: "other",
      type: "radio",
      iconClass: "other",
      icon: faVenusMars,
      onClick: () => {},
    },
  ];

  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const getOtp = async () => {
    if (!formValues.email) {
      setToast({
        show: true,
        message: "Please enter your email first",
        type: "warning",
      });
      return;
    }
    try {
      setToast({
        show: true,
        message: `${formValues.email}`,
        type: "success",
      });
      await axios.post(`${serverUrl}/api/auth/send-otp`, {
        email: formValues.email,
      });

      setToast({
        show: true,
        message: `OTP sent to ${formValues.email}`,
        type: "success",
      });
      setOtpSent(true); // disable button
    } catch (err) {
      setToast({
        show: true,
        message: `${err.response?.data?.message} || Error sending OTP`,
        type: "error",
      });
    }
  };

  const verifyOtp = async () => {
    try {
      const { data } = await axios.post(`${serverUrl}/api/auth/verify-otp`, {
        email: formValues.email,
        otp: formValues.otp,
      });
      if (data.success) {
        setIsOtpVerified(true);
        setOtpSent(false); // enable resend OTP after success
        setToast({
          show: true,
          message: "OTP verified successfully",
          type: "success",
        });
      } else {
        setToast({
          show: true,
          message: "Invalid OTP",
          type: "warning",
        });
      }
    } catch (err) {
      setToast({
        show: true,
        message: "OTP verification failed",
        type: "error",
      });
    }
  };

  const handleSubmit = async () => {
    if (!isOtpVerified) return;
    setToast({
      show: true,
      message: "Please verify OTP first",
      type: "warning",
    });

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/signup`,
        formValues
      );

      // Welcome <user>
      setToast({
        show: true,
        message: `${data.message}`,
        type: "success",
      });

      // Save JWT token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update Context state
      setFormValues({
        ...formValues,
        isLoggedIn: true,
        firstname: data.user.firstname,
      });

      // Navigate to Products page
      setView("Products");
    } catch (err) {
      setToast({
        show: true,
        message: `${err.response?.data?.message} || Signup failed`,
        type: "error",
      });
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="row py-1">
          <div className="text-center">
            <h1 className="">SignUp</h1>
          </div>
        </div>

        <div className="row py-1">
          <div className="align-item-center col-sm-8 col-md-6 col-lg-4 col-xl-4 offset-sm-2 offset-md-3 offset-lg-4 offset-xl-4">
            <div className="d-flex">
              {fullname.map((item) => (
                <div className="input-group px-1" key={item.inputId}>
                  <input
                    name={item.inputId}
                    id={item.inputId}
                    placeholder={item.placeholder}
                    type={item.type}
                    className="form-control"
                    aria-label={item.inputId}
                    value={formValues[item.inputId]}
                    onChange={handleInputChange}
                    ref={item.inputId === "firstname" ? firstname : null}
                    autoComplete="off"
                  />
                  <span className="input-group-text">
                    <FontAwesomeIcon
                      id="font-icons"
                      icon={item.icon}
                      className={item.iconClass}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {SignUpInputs.map((item) => (
          <div className="row py-1" key={item.inputId}>
            <div className="text-center col-sm-2 col-md-6 col-lg-4 col-xl-4 offset-sm-6 offset-md-3 offset-lg-4 offset-xl-4">
              <div className="input-group">
                <input
                  name={item.inputId}
                  id={item.inputId}
                  placeholder={item.placeholder}
                  type={item.type}
                  className="form-control"
                  aria-label={item.inputId}
                  value={formValues[item.inputId]}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <span className="input-group-text" id="basic-addon">
                  <FontAwesomeIcon
                    id="font-icons"
                    icon={item.icon}
                    className={item.iconClass}
                    onClick={() => {}}
                  />
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="row py-1">
          <div className="text-center col-sm-2 col-md-6 col-lg-4 col-xl-4 offset-sm-6 offset-md-3 offset-lg-4 offset-xl-4">
            {genderInputs.map((item) => (
              <div className="form-check form-check-inline" key={item.inputId}>
                <input
                  name="gender"
                  id={item.inputId}
                  type="radio"
                  className="form-check-input"
                  aria-label={item.inputId}
                  value={item.inputId}
                  checked={formValues.gender === item.inputId}
                  onChange={handleInputChange}
                  autoComplete="off"
                  style={{ cursor: "pointer" }}
                />
                <label className="form-check-label px-2" htmlFor={item.inputId}>
                  {item.inputId}
                </label>
                <FontAwesomeIcon
                  id="font-icons"
                  icon={item.icon}
                  className={item.iconClass}
                  onClick={() => {}}
                  style={{ color: "#000" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="row py-1">
          <div className="text-center col-sm-8 col-md-6 col-lg-4 col-xl-4 offset-sm-2 offset-md-3 offset-lg-4 offset-xl-4">
            <div className="d-flex">
              <div className="input-group px-1">
                {/* OTP input */}
                <input
                  name="otp"
                  id="otp"
                  placeholder="OTP"
                  type="text"
                  className="form-control"
                  aria-label="otp"
                  value={formValues.otp}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
                <span className="input-group-text">
                  <FontAwesomeIcon
                    id="font-icons"
                    icon={faEnvelopeCircleCheck}
                    className="otp"
                  />
                </span>

                {/* Send OTP button */}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={getOtp}
                  disabled={otpSent} // Disable while countdown is running
                  style={{ marginLeft: "8px" }}
                >
                  Email OTP
                </button>
              </div>

              {/* Verify OTP button */}
              <div className="input-group px-1">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={verifyOtp}
                  disabled={!formValues.otp || isOtpVerified}
                >
                  {isOtpVerified ? "OTP Verified" : "Verify OTP"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row py-1">
          <div className="text-center col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 offset-md-3 offset-lg-4 offset-xl-4">
            <div className="input-group">
              <button
                className="form-control btn btn-primary"
                disabled={!isFormValid || !isOtpVerified}
                onClick={handleSubmit}
              >
                {isFormValid && isOtpVerified
                  ? "Submit"
                  : "Complete form & verify OTP"}
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

export default SignUp;
