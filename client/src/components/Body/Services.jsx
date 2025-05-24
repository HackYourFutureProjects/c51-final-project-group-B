import { OFFERS } from "../../data";
import styles from "./body.module.css";

const Services = () => {
  return (
    <section className={styles.sectionContainer}>
      <h2 className={styles.sectionHeader}>What We Offer</h2>
      <p className={styles.sectionDescription}>
        Explore the Benefits and Services We Provide to Enhance Your Job Search
        and Career Success
      </p>
      <div className={styles.offerGrid}>
        {OFFERS.map((offer, index) => (
          <div className={styles.offerCard} key={index}>
            <img src={offer.image} alt={`offer-${index + 1}`} />
            <div className={styles.offerDetails}>
              <span>{`0${index + 1}`}</span>
              <div>
                <h4>{offer.title}</h4>
                <p>{offer.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
