import { useState } from "react";
import clients from "../../data";
import styles from "./body.module.css";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalClients = clients.length;

  const goNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalClients);
  };

  const goPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalClients - 1 : prevIndex - 1,
    );
  };

  const [img, name, role, text] = clients[currentIndex];

  return (
    <section className={styles.sectionContainer + " " + styles.clientContainer}>
      <h2 className={styles.sectionHeader}>What Our Clients Say</h2>
      <p className={styles.sectionDescription}>
        Read testimonials and success stories from our satisfied job seekers and
        employers to see how we make a difference.
      </p>

      <div className={styles.clientCard} style={{ textAlign: "center" }}>
        <img
          src={img}
          alt={name}
          style={{ cursor: "pointer", maxWidth: "200px" }}
          onClick={goNext}
          title="Click image to see next testimonial"
        />
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
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={goPrev}
            className="btn btn-secondary"
            style={{ marginRight: "1rem" }}
          >
            Previous
          </button>
          <button onClick={goNext} className="btn btn-secondary">
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
