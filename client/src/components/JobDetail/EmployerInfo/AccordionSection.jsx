import PropTypes from "prop-types";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const AccordionSection = ({
  icon: Icon,
  title,
  children,
  styles,
  defaultExpanded = true,
}) => (
  <Accordion defaultExpanded={defaultExpanded} className={styles.accordionRoot}>
    <AccordionSummary
      expandIcon={<ExpandMore />}
      className={styles.accordionSummary}
    >
      <div className={styles.accordionHeader}>
        <Icon className={styles.statIcon} />
        <span className={styles.sectionTitle}>{title}</span>
      </div>
    </AccordionSummary>
    <AccordionDetails className={styles.accordionContent}>
      {children}
    </AccordionDetails>
  </Accordion>
);

AccordionSection.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  styles: PropTypes.object.isRequired,
  defaultExpanded: PropTypes.bool,
};

export default AccordionSection;
