import React, { useContext } from "react";
import "./Payment.css";
import Context from "../Context/Context";

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
  );
}

export default Payment;
