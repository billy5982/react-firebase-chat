import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import ChatPage from "./components/ChatPage/ChatPage";
import { useEffect } from "react";

import { authService } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";

import { setUser, clearUser } from "./redux/actions/user_actions";

function App() {
  // 경로 이동 메서드 BrowserRouter와 같은 경로이면 안됨 , BrowserRouter를 최상위에다가 배치할 것.
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  // 인증서버에서 로그인한 사용자에 대한 정보를 확인할 수 있음.
  // 근데 회원가입 했을 때도 해당 user가 반응한다? , []로 줬는데 로그인할 때도 반응한다?
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      // user에 정보가 있으면 로그인 된 상태

      if (user) {
        //로그인 페이지에서 채팅 페이지로 이동해야함
        navigate("/"); // chatpage로 이동
        //유저 정보를 리덕스 스토어에 넣을 것임.
        dispatch(setUser(user));
      } else {
        navigate("/login");
        dispatch(clearUser());
      }
    });
  }, []);

  if (isLoading) {
    return <div>....loading</div>;
  } else {
    return (
      <Routes>
        <Route path="/" element={<ChatPage />}></Route>
        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />}></Route>
        {/* 회원가입 */}
        <Route path="/register" element={<RegisterPage />}></Route>
      </Routes>
    );
  }
}

export default App;
