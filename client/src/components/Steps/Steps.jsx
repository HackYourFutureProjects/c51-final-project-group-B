import Register from "../../assets/Register.svg";
import Email from "../../assets/email.svg";
import CV from "../../assets/CV.svg";
import Arrow from "../../assets/arrow.webp";
import "./Steps.css";
const Steps = () => {
  return (
    <section className="steps" id="about">
      <div className="section__container steps__container">
        <h2 className="section__header">Be Discovered IN 3 simple Steps</h2>
        <div className="steps__grid">
          <div className="steps__card">
            <img src={Register} alt="Register" className="steps__icon" />
            <h4>Register With Us</h4>
            <p>Apply for any Opportunities From Anywhere.</p>
          </div>

          <img
            src={Arrow}
            alt="arrow"
            className="steps__arrow"
            aria-hidden="true"
          />

          <div className="steps__card">
            <img src={CV} alt="CV" className="steps__icon" />
            <h4>Add Your CV</h4>
            <p>Create your profile and be discovered.</p>
          </div>

          <img
            src={Arrow}
            alt="arrow"
            className="steps__arrow"
            aria-hidden="true"
          />

          <div className="steps__card">
            <img src={Email} alt="Email" className="steps__icon" />
            <h4>Create Notification</h4>
            <p>Set Up Alerts, Get the right Opportunity.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
