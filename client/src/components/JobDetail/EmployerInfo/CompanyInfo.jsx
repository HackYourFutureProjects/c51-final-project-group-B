import PropTypes from "prop-types";
import { MdLocationOn, MdEmail } from "react-icons/md";

/**
 * CompanyInfo displays key details about the company including
 * its name, location, contact email, and a brief about section.
 *
 * Props:
 * - companyProfile: An object containing company details such as
 *   name, email, and description.
 * - location: The job location string.
 * - styles: CSS module styles object for styling.
 *
 * This component gracefully handles missing data by providing
 * fallback text like "Unknown Company" or "No company description available."
 */
const CompanyInfo = ({ companyProfile, location, styles }) => (
  <>
    <p className={styles.companyName}>
      {companyProfile?.companyName || "Unknown Company"}
    </p>
    <div className={styles.detailLine}>
      <MdLocationOn className={styles.statIcon} />
      <span>{location || "NA"}</span>
    </div>
    {companyProfile?.email && (
      <div className={styles.detailLine}>
        <MdEmail className={styles.statIcon} />
        <span>{companyProfile.email}</span>
      </div>
    )}
    <p className={styles.sectionTitle}>About Company</p>
    <span>{companyProfile?.about || "No company description available."}</span>
  </>
);

CompanyInfo.propTypes = {
  companyProfile: PropTypes.shape({
    companyName: PropTypes.string,
    email: PropTypes.string,
    about: PropTypes.string,
  }),
  location: PropTypes.string,
  styles: PropTypes.object.isRequired,
};

CompanyInfo.defaultProps = {
  companyProfile: {},
  location: "NA",
};

export default CompanyInfo;
