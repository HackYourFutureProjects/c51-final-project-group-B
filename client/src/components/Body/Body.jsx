import Steps from "./Steps";
import Services from "./Services";
import Testimonials from "./Testimonials";
import styles from "./body.module.css";

const Body = () => {
  return (
    <>
      <header
        className={`${styles.sectionContainer} ${styles.headerContainer}`}
      >
        <h1>Search, Apply & get Your Dream Job or Training</h1>
        <p>
          New to the Netherlands and ready to start your career? Whether you’re
          looking for work or training opportunities but don’t know where to
          begin, we’re here to guide you every step of the way. Let’s unlock
          your potential together!
        </p>
      </header>
      <Steps />
      <Services />
      <Testimonials />
    </>
  );
};

export default Body;
