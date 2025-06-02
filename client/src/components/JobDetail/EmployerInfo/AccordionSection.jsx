import PropTypes from "prop-types";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const AccordionSection = ({
  icon: Icon,
  title,
  children,
  styles,
  defaultExpanded = false,
}) => (
  <Accordion defaultExpanded={defaultExpanded}>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Typography className={styles.accordionHeader}>
        <Icon className={styles.statIcon} />
        <span className={styles.sectionTitle}>{title}</span>
      </Typography>
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
