import { useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import SavedJobs from "./SavedJobs";
import ApplicationList from "./ApplicationList";

const TabPanel = ({ children, value, index }) => {
  return value === index ? <Box p={2}>{children}</Box> : null;
};

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default function ProfileTabs() {
  const [tabIndex, setTabIndex] = useState(0); // Start on My Applications

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSwiperSlideChange = (swiper) => {
    setTabIndex(swiper.activeIndex);
  };

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="My Applications" />
        <Tab label="Saved Jobs" />
      </Tabs>

      <Swiper
        initialSlide={tabIndex}
        onSlideChange={handleSwiperSlideChange}
        onSwiper={(swiper) => swiper.slideTo(tabIndex, 0)} // sync tab change with swipe
        spaceBetween={30}
      >
        <SwiperSlide>
          <TabPanel value={tabIndex} index={0}>
            <ApplicationList />
          </TabPanel>
        </SwiperSlide>
        <SwiperSlide>
          <TabPanel value={tabIndex} index={1}>
            <SavedJobs />
          </TabPanel>
        </SwiperSlide>
      </Swiper>
    </Box>
  );
}
