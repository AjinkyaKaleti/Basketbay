import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import Context from "../Context/Context";

function CustomerProfile({ show, handleClose }) {
  const { formValues } = useContext(Context);

  if (!formValues.isLoggedIn) return null;

<<<<<<< HEAD
=======
  console.log(formValues);
>>>>>>> f3d6455f9be41e902a033d33d2c3d78f5d925657
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>First Name:</strong> {formValues.firstname}{" "}
          {formValues.lastname}
        </p>
        <p>
          <strong>Email:</strong> {formValues.email}
        </p>
        {formValues.mobile && (
          <p>
            <strong>Mobile:</strong> {formValues.mobile}
          </p>
        )}
        <p>
          <strong>Age:</strong> {formValues.age}
        </p>
        <p>
          <strong>Gender:</strong> {formValues.gender}
        </p>
        <p>
          <strong>Address:</strong> {formValues.address}, {formValues.pincode}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" size="sm" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomerProfile;
