import { useState } from "react";
import PropTypes from "prop-types";
import styles from "../settings.module.css";

export default function DeleteAccountButton({
  userEmail,
  onDelete,
  isProcessing,
}) {
  const [showModal, setShowModal] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [error, setError] = useState("");

  const handleOpen = () => {
    setShowModal(true);
    setInputEmail("");
    setError("");
  };

  const handleClose = () => {
    setShowModal(false);
    setInputEmail("");
    setError("");
  };

  const handleConfirm = () => {
    if (inputEmail.trim() !== userEmail) {
      setError("Email does not match.");
      return;
    }
    setError("");
    onDelete();
    setShowModal(false);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        // override styles for the button
        style={{
          background: "#e11d48",
          color: "#fff",
          border: "none",
          minWidth: 80,
          maxWidth: 200,
          padding: "0.3rem 0.5rem",
          fontWeight: 500,
          fontSize: "1rem",
        }}
        onClick={handleOpen}
        disabled={isProcessing}
      >
        Delete Account
      </button>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirm Account Deletion</h3>
            <p>
              Please enter your email (<b>{userEmail}</b>) to confirm account
              deletion.
              <br />
              <span style={{ color: "var(--error-color, #e11d48)" }}>
                This action cannot be undone!
              </span>
            </p>
            <input
              type="email"
              className={styles.inputField}
              placeholder="Enter your email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              disabled={isProcessing}
            />
            {error && <p className={styles.errorText}>{error}</p>}
            <div className={styles.modalActions}>
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  background: "#e11d48",
                  color: "#fff",
                  border: "none",
                  minWidth: 80,
                  padding: "0.2rem 0.3rem",
                  fontWeight: 500,
                  fontSize: "0.96rem",
                }}
                onClick={handleConfirm}
                disabled={isProcessing}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  minWidth: 80,
                  padding: "0.2rem 0.3rem",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
                onClick={handleClose}
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

DeleteAccountButton.propTypes = {
  userEmail: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool,
};
