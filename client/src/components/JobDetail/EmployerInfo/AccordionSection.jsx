import PropTypes from "prop-types";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

/**
 * AccordionSection is a reusable component that renders
 * a Material-UI Accordion with a customizable icon, title,
 * and content.
 *
 * Props:
 * - icon: A React component (usually an icon) to display in the header.
 * - title: The title text shown next to the icon in the AccordionSummary.
 * - children: The content rendered inside the AccordionDetails.
 * - styles: An object containing CSS module styles used for styling.
 * - defaultExpanded: Boolean to determine if the Accordion is expanded initially.
 *
 * Usage:
 * This component abstracts away the common Accordion pattern,
 * enabling consistent styling and structure across different
 * accordion sections in the app.
 */
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
