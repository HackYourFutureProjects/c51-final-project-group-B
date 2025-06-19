import { useState, useRef } from "react";
import { Tabs, Tab } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import ApplicationList from "./ApplicationList";
import SavedJobsList from "./SavedJobsList";
import RecommendedJobsList from "./RecommendedJobsList";
import "swiper/css";
import styles from "./ApplicationJobCard.module.css";

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
    <>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="inherit"
      >
        <Tab
          label="My Applications"
          className={tabIndex === 0 ? styles.tabLabelSelected : styles.tabLabel}
        />
        <Tab
          label="Saved Jobs"
          className={tabIndex === 1 ? styles.tabLabelSelected : styles.tabLabel}
        />
        <Tab
          label="Recommended Jobs"
          className={tabIndex === 2 ? styles.tabLabelSelected : styles.tabLabel}
        />
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
