import PropTypes from "prop-types";
import { MdAttachMoney, MdLocationOn, MdWork, MdPeople } from "react-icons/md";

/**
 * JobStats component displays key statistics about a job posting.
 *
 * Props:
 * - job: An object containing job details such as salary, location, job type, and number of applicants.
 * - styles: An object containing CSS module class names used for styling the component.
 *
 * Features:
 * - Displays a salary range if both minimum and maximum salaries are provided.
 * - Falls back to displaying only minimum or maximum salary if only one is provided.
 * - Displays "Not specified" if salary information is missing.
 * - Shows location and job type with fallback to "N/A" if data is missing.
 * - Displays the number of applicants required, defaulting to 0 if undefined.
 *
 * Uses Material Design icons from 'react-icons/md' to visually represent each stat.
 */
const JobStats = ({ job, styles }) => {
  // Format salary range if both min and max exist
  const salaryDisplay =
    job.salaryMin && job.salaryMax
      ? `€${job.salaryMin} - €${job.salaryMax}`
      : job.salaryMin
        ? `€${job.salaryMin}`
        : job.salaryMax
          ? `€${job.salaryMax}`
          : "Not specified";

  return (
    <div className={styles.stats}>
      {/* Salary Section */}
      <div className={styles.statBox}>
        <MdAttachMoney className={styles.statIcon} />
        <span>Salary</span>
        <p>{salaryDisplay}</p>
      </div>

      {/* Location Section */}
      <div className={styles.statBox}>
        <MdLocationOn className={styles.statIcon} />
        <span>Location</span>
        <p>{job.location || "N/A"}</p>
      </div>

      {/* Job Type Section */}
      <div className={styles.statBox}>
        <MdWork className={styles.statIcon} />
        <span>Job Type</span>
        <p>{job.type || "N/A"}</p>
      </div>

      {/* Applicants Required Section */}
      <div className={styles.statBox}>
        <MdPeople className={styles.statIcon} />
        <span>Applicants Required</span>
        <p>{job.applicationCount ?? 0}</p>
      </div>
    </div>
  );
};

JobStats.propTypes = {
  job: PropTypes.shape({
    salaryMin: PropTypes.number,
    salaryMax: PropTypes.number,
    location: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    applicationCount: PropTypes.number,
  }).isRequired,
  styles: PropTypes.object.isRequired,
};

export default JobStats;
