import { useState, useRef } from "react";
import { Tabs, Tab, Box } from "@mui/material";
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
    <Box className={styles.wrapper}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        className={styles.tabs}
        centered
      >
        <Tab
          label="My Applications"
          className={`${styles.tab} ${tabIndex === 0 ? styles.active : ""}`}
        />
        <Tab
          label="Saved Jobs"
          className={`${styles.tab} ${tabIndex === 1 ? styles.active : ""}`}
        />
        <Tab
          label="Recommended Jobs"
          className={`${styles.tab} ${tabIndex === 2 ? styles.active : ""}`}
        />
      </Tabs>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSwiperSlideChange}
        className={styles.swiper}
      >
        <SwiperSlide className={styles.swiperSlide}>
          <ApplicationList />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
          <SavedJobsList />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
          <RecommendedJobsList />
        </SwiperSlide>
      </Swiper>
    </Box>
  );
}
