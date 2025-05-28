import { useUser } from "../../../contexts/UserContext";
import OverviewHeader from "../Shared/OverviewHeader";
import { formatDate } from "../../../util/dates";
import styles from "./overview-section.module.css";
import PropTypes from "prop-types";

import {
  MdInfo,
  MdWork,
  MdSchool,
  MdLanguage,
  MdStar,
  MdSettings,
  MdLocationOn,
  MdEmail,
  MdCloudDownload,
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

  const { email, location, seekerProfile = {} } = user;
  const {
    bio,
    skills,
    languages,
    preferences,
    experiences,
    education,
    resumeUrl,
  } = seekerProfile;

  return (
    <div className={styles.overviewContainer}>
      <OverviewHeader />

      {/* Bio/About */}
      {(bio || location) && (
        <Section icon={MdInfo} title="About Me">
          <p>{bio || "No bio to show here."}</p>
        </Section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 ? (
        <Section icon={MdStar} title="Skills">
          <ul className={styles.chipList}>
            {skills.map((skill, i) => (
              <li key={i} className={styles.chip}>
                {skill}
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <Section icon={MdStar} title="Skills">
          <span className={styles.emptyText}>No skills to show here.</span>
        </Section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 ? (
        <Section icon={MdLanguage} title="Languages">
          <ul className={styles.chipList}>
            {languages.map((lang, i) => (
              <li key={i} className={styles.chip}>
                {lang}
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <Section icon={MdLanguage} title="Languages">
          <span className={styles.emptyText}>No languages to show here.</span>
        </Section>
      )}

      {/* Preferences */}
      {preferences && preferences.length > 0 ? (
        <Section icon={MdSettings} title="Preferences">
          <ul className={styles.chipList}>
            {preferences.map((pref, i) => (
              <li key={i} className={styles.chip}>
                {pref}
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <Section icon={MdSettings} title="Preferences">
          <span className={styles.emptyText}>No preferences to show here.</span>
        </Section>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 ? (
        <Section icon={MdWork} title="Experience">
          <ul className={styles.timeline}>
            {experiences.map((exp, i) => (
              <li key={i} className={styles.timelineItem}>
                <div className={styles.timelineTitle}>
                  <strong>{exp.title}</strong> @ {exp.company}
                </div>
                <div className={styles.timelineMeta}>
                  <MdLocationOn className={styles.inlineIcon} />
                  {exp.workLocation} &nbsp;|&nbsp;
                  {formatDate(exp.startDate)} -{" "}
                  {exp.endDate ? formatDate(exp.endDate) : "Present"}
                </div>
                <div className={styles.timelineDesc}>{exp.description}</div>
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <Section icon={MdWork} title="Experience">
          <span className={styles.emptyText}>No experience to show here.</span>
        </Section>
      )}

      {/* Education */}
      {education && education.length > 0 ? (
        <Section icon={MdSchool} title="Education">
          <ul className={styles.timeline}>
            {education.map((edu, i) => (
              <li key={i} className={styles.timelineItem}>
                <div className={styles.timelineTitle}>
                  <strong>{edu.degree}</strong> in {edu.fieldOfStudy}
                </div>
                <div className={styles.timelineMeta}>
                  {edu.school} &nbsp;|&nbsp;
                  <MdLocationOn className={styles.inlineIcon} />
                  {edu.educationLocation} &nbsp;|&nbsp;
                  {formatDate(edu.startDate)} -{" "}
                  {edu.endDate ? formatDate(edu.endDate) : "Present"}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <Section icon={MdSchool} title="Education">
          <span className={styles.emptyText}>No education to show here.</span>
        </Section>
      )}

      {/* Contact & Resume */}
      <Section icon={MdEmail} title="Contact">
        <div className={styles.contactInfo}>
          <span className={styles.contactInfoItem}>
            <MdEmail className={styles.inlineIcon} />
            {email}
          </span>
          {location && (
            <span className={styles.contactInfoItem}>
              <MdLocationOn className={styles.inlineIcon} />
              {location}
            </span>
          )}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactInfoItem}
            >
              <MdCloudDownload className={styles.inlineIcon} />
              Resume
            </a>
          )}
        </div>
      </Section>
    </div>
  );
};

export default Overview;

Section.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
