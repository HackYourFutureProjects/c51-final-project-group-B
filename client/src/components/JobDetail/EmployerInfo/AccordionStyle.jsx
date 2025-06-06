import { styled } from "@mui/material/styles";
import { Accordion } from "@mui/material";
const CustomAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: "var(--bg-color)",
  borderRadius: "var(--border-radius)",
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
}));
export default CustomAccordion;
