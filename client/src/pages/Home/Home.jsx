import Nav from "../../components/NavBar/Nav";
import Body from "../../components/Body/Body";
import Steps from "../../components/Steps/Steps";
import Explore from "../../components/Explore/Explore";
import Services from "../../components/Services/Services";
import Testimonials from "../../components/Testimonials/Testimonials";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Nav />
      <Body />
      <Steps />
      <Explore />
      <Services />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
