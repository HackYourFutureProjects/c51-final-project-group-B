import React, { useState, useRef } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import ApplicationList from "./ApplicationList";
import SavedJobsList from "./SavedJobsList";
import RecommendedJobsList from "./RecommendedJobsList";
import "swiper/css";

export default function ProfileTabs() {
  const [tabIndex, setTabIndex] = useState(0);
  const swiperRef = useRef(null);

  // When tab clicked, update swiper
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    if (swiperRef.current) {
      swiperRef.current.slideTo(newValue);
    }
  };

  // When swiper slide changes, update tab
  const handleSwiperSlideChange = (swiper) => {
    setTabIndex(swiper.activeIndex);
  };

  return (
    <>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="My Applications" />
        <Tab label="Saved Jobs" />
        <Tab label="Recommended Jobs" />
      </Tabs>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSwiperSlideChange}
        spaceBetween={30}
        style={{ height: "100%", minHeight: 400 }}
      >
        <SwiperSlide style={{ height: "100%", minHeight: 400 }}>
          <ApplicationList />
        </SwiperSlide>

        <SwiperSlide style={{ height: "100%", minHeight: 400 }}>
          <SavedJobsList />
        </SwiperSlide>

        <SwiperSlide style={{ height: "100%", minHeight: 400 }}>
          <RecommendedJobsList />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
