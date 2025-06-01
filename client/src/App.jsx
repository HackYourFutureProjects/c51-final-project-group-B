import { Routes, Route } from "react-router-dom";
import Body from "./components/Body/Body";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import CandidateProfile from "./pages/Profile/Candidate/CandidateProfile";
import Navbar from "./components/layouts/Navbar/Navbar";
import Footer from "./components/layouts/Footer/Footer";
import Register from "./pages/Forms/Register";
import Login from "./pages/Forms/Login";
import { PublicRoute } from "./routes/PublicRoute";
import ProfilePage from "./pages/UserProfile/ProfilePage";
import JobDetail from "./pages/JobDetail/JobDetail";
import ErrorArea from "./pages/Error/ErrorArea";
const App = () => {
  return (
    <>
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/user" element={<UserList />} />
          <Route path="/user/create" element={<CreateUser />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="*" element={<ErrorArea />} />
          <Route path="/profile/*" element={<ProfilePage />} />

          <Route
            path="/users/candidate-profile/:id"
            element={<CandidateProfile />}
          ></Route>

          {/* the login and register route are only accessible if the user is not authenticated  */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
