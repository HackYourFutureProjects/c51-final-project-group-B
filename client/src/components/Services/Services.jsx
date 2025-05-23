import { OFFERS } from "../../Data";
import "./Services.css";
const Services = () => {
  return (
    <section className="section__container offer__container">
      <h2 className="section__header">What We Offer</h2>
      <p className="section__description">
        Explore the Benefits and Services We Provide to Enhance Your Job Search
        and Career Success
      </p>
      <div className="offer__grid">
        {OFFERS.map((offer, index) => (
          <div className="offer__card" key={index}>
            <img src={offer.image} alt={`offer-${index + 1}`} />
            <div className="offer__details">
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
