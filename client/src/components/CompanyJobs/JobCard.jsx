import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { GoLocation } from "react-icons/go";
import moment from "moment";
import css from "./job-card.module.css";

const JobCard = ({ job }) => {
  const {
    title,
    location,
    type,
    createdAt,
    companyProfile,
    profilePhoto,
    isActive,
    expireOn,
    applicationCount,
  } = job;

  const companyLogo = profilePhoto || "";
  const companyName = companyProfile || "";

  return (
    <Link to={`/applications/:id`} className={css.jobCardLink}>
      <div className={css.jobCard}>
        <div className={css.jobCardHeader}>
          {companyLogo && (
            <img
              src={companyLogo}
              alt={companyName}
              className={css.companyLogo}
            />
          )}
          <div className={css.jobInfo}>
            <p className={css.jobTitle}>{title}</p>
            <span className={css.location}>
              <GoLocation className={css.locationIcon} />
              {location}
            </span>
          </div>
        </div>

        <div>
          <span className={css.applicationCount}>
            Applications: {applicationCount || 0}
          </span>
        </div>
        <div>
          <span className={css.expireOn}>
            Expires on: {moment(expireOn).format("MMM Do YYYY")}
          </span>
        </div>

        <div>
          <span className={css.isActive}>
            Status: {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className={css.jobFooter}>
          <span className={css.jobType}>{type}</span>
          <span className={css.postedTime}>{moment(createdAt).fromNow()}</span>
        </div>
      </div>
    </Link>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    companyProfile: PropTypes.string,
    profilePhoto: PropTypes.string,
    isActive: PropTypes.bool,
    expireOn: PropTypes.string,
    applicationCount: PropTypes.number,
  }).isRequired,
  styles: PropTypes.object.isRequired,
};

export default JobCard;
