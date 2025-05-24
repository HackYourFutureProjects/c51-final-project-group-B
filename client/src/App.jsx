import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import CandidateProfile from "./pages/Profile/Candidate/CandidateProfile";
import Navbar from "./components/layouts/Navbar/Navbar";
import Footer from "./components/layouts/Footer/Footer";

const App = () => {
  return (
    <>
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<UserList />} />
          <Route path="/user/create" element={<CreateUser />} />

          <Route
            path="/users/candidate-profile/:id"
            element={<CandidateProfile />}
          ></Route>
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
