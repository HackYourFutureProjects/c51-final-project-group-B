import PropTypes from "prop-types";
import { MdBusiness, MdDescription, MdListAlt, MdBuild } from "react-icons/md";

import AccordionSection from "./AccordionSection";
import CompanyInfo from "./CompanyInfo";
import ListSection from "./ListSection";
import DeadlineSection from "./DeadlineSection";

const JobAccordion = ({ job, styles }) => {
  const {
    postedBy: { companyProfile },
    location,
    description,
    requirements = [],
    tags = [],
    expireOn,
  } = job;

  console.log("JobAccordion job:", job);

  return (
    <div className={styles.accordionSection}>
      <DeadlineSection expireOn={expireOn} styles={styles} />
      <AccordionSection
        icon={MdBusiness}
        title="Company"
        styles={styles}
        defaultExpanded
      >
        <CompanyInfo
          companyProfile={companyProfile}
          location={location}
          styles={styles}
        />
      </AccordionSection>

      <AccordionSection
        icon={MdDescription}
        title="Job Description"
        styles={styles}
      >
        <p>{description || "No job description available."}</p>
      </AccordionSection>

      {requirements.length > 0 && (
        <ListSection
          icon={MdListAlt}
          title="Requirements"
          items={requirements}
          styles={styles}
        />
      )}

      {tags.length > 0 && (
        <ListSection
          icon={MdBuild}
          title="Skills Required"
          items={tags}
          styles={styles}
        />
      )}
    </div>
  );
};

JobAccordion.propTypes = {
  job: PropTypes.shape({
    postedBy: PropTypes.shape({
      companyProfile: PropTypes.shape({
        companyName: PropTypes.string,
        industry: PropTypes.string,
      }),
    }),
    location: PropTypes.string,
    description: PropTypes.string,
    requirements: PropTypes.arrayOf(PropTypes.string),
    tags: PropTypes.arrayOf(PropTypes.string),
    expireOn: PropTypes.string,
  }).isRequired,
  styles: PropTypes.object.isRequired,
};

export default JobAccordion;
