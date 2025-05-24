import { useEffect } from "react";
import Swiper from "swiper";
import "swiper/swiper-bundle.css";
import "./Testimonials.css";
import clients from "../../Data";
const Testimonials = () => {
  useEffect(() => {
    new Swiper(".swiper", { loop: true });
  }, []);
  return (
    <section className="section__container client__container">
      <h2 className="section__header">What Our Clients Say</h2>
      <p className="section__description">
        Read Testimonials and Success Stories from Our Satisfied Job Seekers and
        Employers to See How We Make a Difference
      </p>
      <div className="swiper">
        <div className="swiper-wrapper">
          {clients.map(([img, name, role, text], i) => (
            <div className="swiper-slide" key={i}>
              <div className="client__card">
                <img src={img} alt={name} />
                <p>{text}</p>
                <div className="client__ratings">
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
