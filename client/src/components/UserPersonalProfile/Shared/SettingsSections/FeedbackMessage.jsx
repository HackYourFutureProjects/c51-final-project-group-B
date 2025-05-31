import PropTypes from "prop-types";
const FeedbackMessage = ({ feedback, uploadError }) => {
  if (!feedback && !uploadError) return null;

  return (
    <div className="toastMessageWrapper">
      {feedback && (
        <div
          className={`toastMessage ${
            feedback.includes("success") ? "toastSuccess" : "toastWarning"
          }`}
        >
          {feedback}
        </div>
      )}
      {uploadError && (
        <div className="toastMessage toastError">{uploadError}</div>
      )}
    </div>
  );
};

FeedbackMessage.propTypes = {
  feedback: PropTypes.string,
  uploadError: PropTypes.string,
};

export default FeedbackMessage;
