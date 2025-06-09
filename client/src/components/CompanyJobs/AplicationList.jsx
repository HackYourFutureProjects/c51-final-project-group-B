import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import PropTypes from "prop-types";
import AplicationCard from "./AplicationCard";
import styles from "./aplication-list.module.css";

const AplicationList = ({ id }) => {
  const [applicants, setApplicants] = useState([]);

  const { performFetch } = useFetch(`/applications/${id}`, (response) => {
    setApplicants(response?.data || []);
  });

  useEffect(() => {
    if (id) performFetch();
  }, [id]);

  return (
    <div className={styles.aplicationList}>
      {applicants.length > 0 ? (
        applicants.map((applicant) => (
          <AplicationCard key={applicant._id} applicant={applicant} />
        ))
      ) : (
        <p>no one has applied</p>
      )}
    </div>
  );
};

AplicationList.propTypes = {
  id: PropTypes.string.isRequired,
};
export default AplicationList;
