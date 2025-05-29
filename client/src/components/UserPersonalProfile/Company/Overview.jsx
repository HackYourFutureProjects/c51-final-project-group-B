import OverviewHeader from "../Shared/OverviewHeader";
import { useUser } from "../../../contexts/UserContext";
// using same styles as Seeker overview
import styles from "../Seeker/overview-section.module.css";
import PropTypes from "prop-types";
import {
  MdInfo,
  MdBusiness,
  MdLocationOn,
  MdStar,
  MdPeople,
  MdPublic,
  MdWork,
  MdHome,
  MdOutlineAccountTree,
  MdEmail,
} from "react-icons/md";

const Section = ({ icon: Icon, title, children }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <Icon className={styles.sectionIcon} />
      <h2>{title}</h2>
    </div>
    <div>{children}</div>
  </div>
);

const Overview = () => {
  const { user } = useUser();
  if (!user) return null;

  const { email, location, companyProfile = {} } = user;
  const {
    website,
    industry,
    about,
    companySize,
    tagline,
    headquarters,
    branches,
    values,
  } = companyProfile;

  return (
    <div className={styles.overviewContainer}>
      {/* Header */}
      <OverviewHeader />

      {/* About,Tagline */}
      <Section icon={MdInfo} title="About Us">
        {about ? (
          <p>{about}</p>
        ) : (
          <span className={styles.emptyText}>No company bio to show here.</span>
        )}
        {tagline && (
          <div className={styles.inlineInfo}>
            <MdStar className={styles.inlineIcon} />
            <span>{tagline}</span>
          </div>
        )}
      </Section>

      {/* Industry, Company Size */}
      <Section icon={MdBusiness} title="Company Details">
        {industry || companySize ? (
          <ul className={styles.chipList}>
            {industry && (
              <li className={styles.chip}>
                <MdWork className={styles.inlineIcon} />
                {industry}
              </li>
            )}
            {companySize && (
              <li className={styles.chip}>
                <MdPeople className={styles.inlineIcon} />
                {companySize} employees
              </li>
            )}
          </ul>
        ) : (
          <span className={styles.emptyText}>
            No company details to show here.
          </span>
        )}
      </Section>

      {/* Headquarters, Branches */}
      <Section icon={MdHome} title="Locations">
        {headquarters || (branches && branches.length > 0) ? (
          <ul className={styles.chipList}>
            {headquarters && (
              <li className={styles.chip}>
                <MdLocationOn className={styles.inlineIcon} />
                HQ: {headquarters}
              </li>
            )}
            {branches &&
              branches.length > 0 &&
              branches.map((branch, i) => (
                <li key={i} className={styles.chip}>
                  <MdOutlineAccountTree className={styles.inlineIcon} />
                  {branch}
                </li>
              ))}
          </ul>
        ) : (
          <span className={styles.emptyText}>No locations to show here.</span>
        )}
      </Section>

      {/* Values */}
      {values && values.length > 0 ? (
        <Section icon={MdStar} title="Company Values">
          <ul className={styles.chipList}>
            {values.map((value, i) => (
              <li key={i} className={styles.chip}>
                {value}
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <Section icon={MdStar} title="Company Values">
          <span className={styles.emptyText}>No values to show here.</span>
        </Section>
      )}

      {/* Website & Contact */}
      <Section icon={MdPublic} title="Contact & Website">
        {website || email || location ? (
          <div className={styles.contactInfo}>
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactInfoItem}
              >
                <MdPublic className={styles.inlineIcon} />
                {website}
              </a>
            )}
            {email && (
              <span className={styles.contactInfoItem}>
                <MdEmail className={styles.inlineIcon} />
                {email}
              </span>
            )}
            {location && (
              <span className={styles.contactInfoItem}>
                <MdLocationOn className={styles.inlineIcon} />
                {location}
              </span>
            )}
          </div>
        ) : (
          <span className={styles.emptyText}>
            No contact info to show here.
          </span>
        )}
      </Section>
    </div>
  );
};

Section.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Overview;
