import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Body from "./components/Body/Body";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import CandidateProfile from "./pages/Profile/Candidate/CandidateProfile";
import Navbar from "./components/layouts/Navbar/Navbar";
import Footer from "./components/layouts/Footer/Footer";
import Register from "./pages/Forms/Register";
import Login from "./pages/Forms/Login";
import { PublicRoute } from "./routes/PublicRoute";
import JobSeekerRoute from "./routes/JobSeekerRoute";
import ProfilePage from "./pages/UserProfile/ProfilePage";
import CompanyProfile from "./pages/Profile/Company/CompanyProfile";
import JobDetail from "./pages/JobDetail/JobDetail";
import ErrorArea from "./pages/Error/ErrorArea";
import SigninForm from "./components/forms/SigninForm";
import ForgotPasswordForm from "./components/forms/ForgotPasswordForm";
import ResetPasswordForm from "./components/forms/ResetPasswordForm";
import SignupForm from "./components/forms/SignupForm";
import VerifyUser from "./components/forms/VerifyUser";
import FindJobsPage from "./pages/FindJobsPage/FindJobsPage";

// import PostJob from "./pages/PostJob/PostJob";
import Feed from "./pages/Feed/Feed";
import DataPolicy from "./components/License & Agreement/DataPolicy";
import TermsAndCondition from "./components/License & Agreement/TermsAndCondition";
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
          {/* the job seeker route is only accessible if the user is authenticated and has the role of jobseeker */}
          <Route
            path="/jobs/find"
            element={
              <JobSeekerRoute>
                <FindJobsPage />
              </JobSeekerRoute>
            }
          />
          <Route path="/profile/*" element={<ProfilePage />} />

          <Route
            path="/users/candidate-profile/:id"
            element={<CandidateProfile />}
          ></Route>

          <Route
            path="/users/company-profile/:id"
            element={<CompanyProfile />}
          ></Route>

          {/* the login and register route are only accessible if the user is not authenticated  */}
          {/* Signin or login form */}
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SigninForm />
              </PublicRoute>
            }
          />

          {/* Signup or register form */}
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupForm />
              </PublicRoute>
            }
          />

          <Route
            path="/terms"
            element={
              <PublicRoute>
                <TermsAndCondition />
              </PublicRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <PublicRoute>
                <DataPolicy />
              </PublicRoute>
            }
          />

          {/* Forgot password form */}
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordForm />
              </PublicRoute>
            }
          />

          {/* Reset password form */}
          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <ResetPasswordForm />
              </PublicRoute>
            }
          />
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
          <Route
            path="/verify-email/:token"
            element={
              <PublicRoute>
                <VerifyUser />
              </PublicRoute>
            }
          />

          <Route path="/feed" element={<Feed />} />
          <Route path="*" element={<ErrorArea />} />
        </Routes>
        <Toaster
          position="top-right"
          duration={3000}
          toastOptions={{
            style: {
              marginTop: "3rem",
            },
          }}
        />
      </main>

      <Footer />
    </>
  );
};

export default App;
