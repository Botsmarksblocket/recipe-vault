import { useState } from "react";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";

interface ConfirmModalProps {
  onConfirm: () => void;
}

export default function ConfirmModal({ onConfirm }: ConfirmModalProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleConfirm = () => {
    onConfirm();
    handleClose;
  };

  return (
    <>
      <Button
        variant="danger"
        className="w-100 fs-5 fw-bold"
        onClick={handleShow}
      >
        Delete recipe
      </Button>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Are you sure you want to delete the recipe?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex">
          <Button
            size="lg"
            className="w-100 me-1"
            variant="secondary"
            onClick={handleConfirm}
          >
            Yes
          </Button>
          <Button
            size="lg"
            className="w-100 ms-1"
            variant="success"
            onClick={handleClose}
          >
            No
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
