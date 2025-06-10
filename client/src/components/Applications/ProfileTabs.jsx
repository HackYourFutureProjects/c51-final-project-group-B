import { useState, useRef } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ApplicationList from "./ApplicationList";
import SavedJobsList from "./SavedJobsList";

export default function ProfileTabs() {
  const [tabIndex, setTabIndex] = useState(0);
  const swiperRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    if (swiperRef.current) {
      swiperRef.current.slideTo(newValue);
    }
  };

  const handleSwiperSlideChange = (swiper) => {
    setTabIndex(swiper.activeIndex);
  };

  return (
    <Box sx={{ height: "100%", minHeight: "400px" }}>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="My Applications" />
        <Tab label="Saved Jobs" />
      </Tabs>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSwiperSlideChange}
        spaceBetween={30}
        style={{ height: "100%", minHeight: "400px" }}
      >
        <SwiperSlide style={{ height: "100%", minHeight: "400px" }}>
          <Box p={2}>
            <ApplicationList />
          </Box>
        </SwiperSlide>
        <SwiperSlide style={{ height: "100%", minHeight: "400px" }}>
          <Box p={2}>
            <SavedJobsList />
          </Box>
        </SwiperSlide>
      </Swiper>
    </Box>
  );
}
