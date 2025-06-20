import PropTypes from "prop-types";
import { MdLocationOn, MdEmail } from "react-icons/md";

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
    <p className={styles.sectionTitle}>Industry</p>
    <span>
      {companyProfile?.industry || "No industry information available."}
    </span>
  </>
);

CompanyInfo.propTypes = {
  companyProfile: PropTypes.shape({
    companyName: PropTypes.string,
    email: PropTypes.string,
    industry: PropTypes.string,
  }),
  location: PropTypes.string,
  styles: PropTypes.object.isRequired,
};

CompanyInfo.defaultProps = {
  companyProfile: {},
  location: "NA",
};

export default CompanyInfo;
