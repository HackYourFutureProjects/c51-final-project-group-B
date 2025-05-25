import Register from "../../assets/Register.svg";
import Email from "../../assets/email.svg";
import CV from "../../assets/CV.svg";
import Arrow from "../../assets/arrow.png";
import styles from "./body.module.css";

const Steps = () => {
  return (
    <section className={styles.sectionContainer}>
      <h2 className={styles.sectionHeader}>Be Discovered IN 3 Simple Steps</h2>
      <div className={styles.stepsGrid}>
        <div className={styles.stepsCard}>
          <img src={Register} alt="Register" className={styles.stepsIcon} />
          <h4>Register With Us</h4>
          <p>Apply for any Opportunities From Anywhere.</p>
        </div>
        <div className={styles.stepsArrowContainer}>
          <img src={Arrow} alt="arrow" className={styles.stepsArrow} />
        </div>
        <div className={styles.stepsCard}>
          <img src={CV} alt="CV" className={styles.stepsIcon} />
          <h4>Add Your CV</h4>
          <p>Create your profile and be discovered.</p>
        </div>
        <div className={styles.stepsArrowContainer}>
          <img src={Arrow} alt="arrow" className={styles.stepsArrow} />
        </div>
        <div className={styles.stepsCard}>
          <img src={Email} alt="Email" className={styles.stepsIcon} />
          <h4>Create Notification</h4>
          <p>Set Up Alerts, Get the right Opportunity.</p>
        </div>
      </div>
    </section>
  );
};

export default Steps;
