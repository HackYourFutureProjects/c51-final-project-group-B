import { useEffect } from "react";
import Swiper from "swiper";
import "swiper/swiper-bundle.css";
import clients from "../../data";
import styles from "./body.module.css";

const Testimonials = () => {
  useEffect(() => {
    new Swiper(".swiper", { loop: true });
  }, []);

  return (
    <section className={styles.sectionContainer + " " + styles.clientContainer}>
      <h2 className={styles.sectionHeader}>What Our Clients Say</h2>
      <p className={styles.sectionDescription}>
        Read testimonials and success stories from our satisfied job seekers and
        employers to see how we make a difference.
      </p>
      <div className="swiper">
        <div className="swiper-wrapper">
          {clients.map(([img, name, role, text], i) => (
            <div className="swiper-slide" key={i}>
              <div className={styles.clientCard}>
                <img src={img} alt={name} />
                <p>{text}</p>
                <div className={styles.clientRatings}>
                  {[...Array(5)].map((_, j) => (
                    <span key={j}>
                      <i className="ri-star-fill"></i>
                    </span>
                  ))}
                </div>
                <h4>{name}</h4>
                <h5>{role}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
