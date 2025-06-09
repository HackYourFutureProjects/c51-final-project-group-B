import useFetch from "../../../hooks/useFetch";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styles from "./candidate-profile.module.css";
import HeaderSection from "../../../components/profile/ProfileView/HeaderSection/HeaderSection";
import HistorySection from "../../../components/profile/ProfileView/HistorySection/HistorySection";
import TagSection from "../../../components/profile/ProfileView/TagSection/TagSection";
import Loader from "../../../components/templates/Loader";
// use this ids for testing 6830bc7faab575b0d0699f51

const CandidateProfile = () => {
  const [user, setUser] = useState({});
  const { id } = useParams();

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/profile/${id}`,
    (response) => {
      const user = response?.user;
      setUser(user.userType === "seeker" ? user : null);
    },
  );

  useEffect(() => {
    performFetch();
    return cancelFetch;
  }, []);

  // If a user is NOT a candidate
  if (!user)
    return (
      <div className={styles.profileContainer}>
        <section>{`No user with this ${id}`}</section>
      </div>
    );

  let content = null;
  if (isLoading) {
    content = (
      <div className={styles.profileContainer}>
        <Loader />
      </div>
    );
  } else if (error != null) {
    content = (
      <div className={styles.profileContainer}> Error: {error.toString()}</div>
    );
  } else {
    content = (
      <div className={styles.profileContainer}>
        {/* profile header section */}
        <section className={styles.profileSection}>
          <HeaderSection user={user} />
        </section>

        {/* study section  */}
        <section className={styles.profileSection}>
          <HistorySection
            type="education"
            title="Education"
            icon="edu"
            items={
              user?.seekerProfile?.education?.map((edu) => ({
                title: edu.degree,
                organization: edu.school,
                startDate: edu.startDate,
                endDate: edu.endDate,
                location: edu.location,
              })) || []
            }
          />
        </section>

        {/* work experience section */}
        <section className={styles.profileSection}>
          <HistorySection
            type="experience"
            title="Experience"
            icon="work"
            items={
              user?.seekerProfile?.experiences?.map((exp) => ({
                title: exp.title,
                organization: exp.company,
                startDate: exp.startDate,
                endDate: exp.endDate,
                description: exp.description,
                location: exp.location,
              })) || []
            }
          />
        </section>

        {/* skills section  */}
        <section className={styles.profileSection}>
          {user?.seekerProfile?.skills && (
            <TagSection tags={user.seekerProfile.skills} type="skills" />
          )}
        </section>

        {/* languages section */}
        <section className={styles.profileSection}>
          {user?.seekerProfile?.languages && (
            <TagSection tags={user.seekerProfile.languages} type="languages" />
          )}
        </section>
      </div>
    );
  }

  return <>{content}</>;
};

export default CandidateProfile;
