import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home/Home";
// import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import RegisterForm from "./components/Forms/RegisterForm";
import LoginForm from "./components/Forms/LoginForm";

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserList />} />
        {/* <Route path="/user/create" element={<CreateUscer />} /> */}
        <Route path="/signUp" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </>
  );
};

export default App;
