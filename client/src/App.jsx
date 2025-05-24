import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home/Home";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import CandidateProfile from "./pages/Profile/Candidate/CandidateProfile";

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserList />} />
        <Route path="/user/create" element={<CreateUser />} />

        <Route
          path="/users/candidate-profile/:id"
          element={<CandidateProfile />}
        ></Route>
      </Routes>
    </>
  );
};

export default App;
