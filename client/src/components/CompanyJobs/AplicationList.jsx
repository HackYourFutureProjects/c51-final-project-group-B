import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";

const AplicationList = () => {
  const [applications, setApplications] = useState([]);

  const { performFetch, cancelFetch } = useFetch(
    `/applications/:id`,
    (response) => {
      console.log("Jobs fetched:", response);
      setApplications(response?.data || []);
    },
  );

  useEffect(() => {
    performFetch();
    return () => {
      cancelFetch();
    };
  }, []);

  console.log(applications);

  return <div></div>;
};

export default AplicationList;
