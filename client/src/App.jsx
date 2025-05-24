import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home/Home";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import RegisterForm from "./components/forms/RegisterForm";
import LogInForm from "./components/forms/LoginForm";

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserList />} />
        <Route path="/user/create" element={<CreateUser />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LogInForm />} />
        {/* Add more routes as needed */}
      </Routes>
    </>
  );
};

export default App;
