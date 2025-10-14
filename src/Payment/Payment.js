import React, { useContext } from "react";
import "./Payment.css";
import Context from "../Context/Context";
<<<<<<< HEAD
import axios from "axios";

function Payment({
  amount,
  onPaymentSuccess,
  onPaymentCancel,
  isVisible = true,
}) {
  const { setPaymentModalVisible, isPaymentModalVisible } = useContext(Context);

  const handleCloseModal = () => {
    if (isPaymentModalVisible) {
      setPaymentModalVisible(false);
    }
    if (onPaymentCancel) {
      onPaymentCancel();
    }
  };

  const handleCOD = () => {
    onPaymentSuccess("Cash on Delivery");
    handleCloseModal();
  };

  const handleRazorpay = async () => {
    try {
      // 1. Call backend to create Razorpay order
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/payment/payment-gateway`,
        { amount }
      );
      const order = res.data;

      // 2. Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // store key in frontend env
        amount: order.amount,
        currency: order.currency,
        name: "BasketBay",
        description: "Purchase",
        order_id: order.id,
        handler: async function (response) {
          // verify payment with backend
          const verifyRes = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/api/payment/verify-payment`,
            response
          );

          if (verifyRes.data.status === "success") {
            onPaymentSuccess("Razorpay", response);
          } else {
            onPaymentCancel();
          }
          handleCloseModal();
        },
        modal: {
          ondismiss: function () {
            onPaymentCancel();
          },
        },
        prefill: {
          name: "Ajinkya",
          email: "ajinkya@example.com",
          contact: "9999999999",
        },
        theme: { color: "#f37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
      onPaymentCancel();
    }
  };

  // 🔹 If not visible, return nothing
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={handleCloseModal}>
          &times;
        </button>
        <h2>Payment Options</h2>
        <p>
          Total: ₹<b>{amount}</b>
        </p>
        <button onClick={handleCOD} className="payment-option-button">
          <img src="/cod.png" alt="cash on delivery" /> Cash on Delivery
        </button>
        <button onClick={handleRazorpay} className="payment-option-button">
          <img src="/razorpay.png" alt="razorpay" />
          Razorpay
        </button>
      </div>
    </div>
=======

function Payment() {
  const { setPaymentModalVisible } = useContext(Context);
  const handleCloseModal = () => {
    setPaymentModalVisible(false);
  };
  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={handleCloseModal}>
            &times;
          </button>
          <h2>Payment Details</h2>
          {/* Add your payment details here */}
          <p>Thank you for your purchase!</p>
        </div>
      </div>
    </>
>>>>>>> f3d6455f9be41e902a033d33d2c3d78f5d925657
  );
}

export default Payment;
