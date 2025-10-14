import { useEffect, useRef } from "react";
import "./ToastMessage.css";

function ToastMessage({ message, type = "success", show, onClose }) {
  const toastRef = useRef(null);

  useEffect(() => {
    if (show && toastRef.current) {
      const bsToast = new window.bootstrap.Toast(toastRef.current, {
        autohide: true,
        delay: 3000,
      });
      bsToast.show();
      toastRef.current.addEventListener("hidden.bs.toast", onClose);
    }
  }, [show, onClose]);

  return (
    <div className="toast-container position-fixed top-0 end-0" style={{}}>
      <div
        ref={toastRef}
        className={`toast align-items-center text-bg-${
          type === "success"
            ? "success"
            : type === "error"
            ? "danger"
            : "warning"
        } border-0`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-black me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
}

export default ToastMessage;
