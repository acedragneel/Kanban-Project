import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Page/Login";
import Main from "./Main";
import SignUp from "./Page/SignUp";
import Users from "./Page/Users";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />}/>
        <Route exact path="/signup" element={<SignUp />}/>
          {/* <Route index element={<Home />} /> */}
        <Route exact path="/board" element={<Main />} />
        <Route exact path="/users" element={<Users />} />
          {/* <Route path="contact" element={<Contact />} /> */}
      </Routes>
    </BrowserRouter>
  );
}