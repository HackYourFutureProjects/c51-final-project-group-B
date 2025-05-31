import useFetch from "../../../hooks/useFetch";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import styles from "./company-profile.module.css";
import HeaderSection from "../../../components/profile/ProfileView/HeaderSection/HeaderSection";
import TagSection from "../../../components/profile/ProfileView/TagSection/TagSection";

const CompanyProfile = () => {
  const [user, setUser] = useState({});
  const { id } = useParams();

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/profile/${id}`,
    (response) => {
      const user = response?.user;
      setUser(user?.userType?.toLowerCase() === "company" ? user : null);
    },
  );

  useEffect(() => {
    performFetch();
    return cancelFetch;
  }, []);

  // If a user is NOT a company
  if (!user)
    return (
      <div className={styles.profileContainer}>
        <section>{`No user with this ${id}`}</section>
      </div>
    );

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

        {/* about section  */}
        <section>
          {user?.companyProfile?.about ? (
            <TagSection tags={[user.companyProfile.about]} type="about" />
          ) : (
            <p className={styles.emptyText}>Info about company is empty</p>
          )}
        </section>

        {/* branches section */}
        <section>
          {user?.companyProfile?.branches && length > 0 ? (
            <TagSection tags={user.companyProfile.branches} type="branches" />
          ) : (
            <p className={styles.emptyText}>Branches not provided</p>
          )}
        </section>

        {/* {value section} */}
        <section>
          {user?.companyProfile?.values &&
          user?.companyProfile?.values.length > 0 ? (
            <TagSection tags={user.companyProfile.values} type="values" />
          ) : (
            <p className={styles.emptyText}>Values of company not provided</p>
          )}
        </section>
      </div>
    );
  }

  return <>{content}</>;
};

export default CompanyProfile;
