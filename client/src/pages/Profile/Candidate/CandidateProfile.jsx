import useFetch from "../../../hooks/useFetch";
import { useState, useEffect } from "react";

import styles from "./candidate-profile.module.css";
import HeaderSection from "../../../components/profile/ProfileView/HeaderSection/HeaderSection";
import HistorySection from "../../../components/profile/ProfileView/HistorySection/HistorySection";
import TagSection from "../../../components/profile/ProfileView/TagSection/TagSection";

// use this ids for testing [6830bf97c41a69b82d948813, 6830bc7faab575b0d0699f51]

const CandidateProfile = () => {
  const [user, setUser] = useState({});

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/profile/6830bc7faab575b0d0699f51",
    (response) => {
      setUser(response.user);
    },
  );

  useEffect(() => {
    performFetch();
    return cancelFetch;
  }, []);

  let content = null;
  if (isLoading) {
    content = <div className={styles.profileContainer}>Loading...</div>;
  } else if (error != null) {
    content = (
      <div className={styles.profileContainer}> Error: {error.toString()}</div>
    );
  } else {
    content = (
      <div className={styles.profileContainer}>
        {/* profile header section */}
        <section>
          <HeaderSection user={user} />
        </section>

        {/* study section  */}
        <section>
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
        <section>
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
        <section>
          {user?.seekerProfile?.skills && (
            <TagSection tags={user.seekerProfile.skills} type="skills" />
          )}
        </section>

        {/* languages section */}
        <section>
          {user?.seekerProfile?.languages && (
            <TagSection tags={user.seekerProfile.languages} type="langs" />
          )}
        </section>
      </div>
    );
  }

  return <>{content}</>;
};

export default CandidateProfile;
