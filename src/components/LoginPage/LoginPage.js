import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { authService } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
function LoginPage() {
  const [submit, setSubmit] = useState(false);
  const [loginError, setLoginError] = useState("");
  const onLogin = async (data) => {
    setSubmit(true); // 제출 버튼 눌렸다면 버튼 사용불가
    try {
      // auth 서버에 접근해서 이메일과 비밀번호를 확인 해당 정보를 loginUser에 넣어줌
      let loginUser = await signInWithEmailAndPassword(
        authService,
        data.email,
        data.password
      );
      // 로그인 완료하면
      setSubmit(false);
    } catch (errors) {
      setSubmit(false); // 로그인 버튼 못눌리게
      setLoginError(errors.message); // 로그인 불가 에러
      setTimeout(() => {
        // 5초 후 에러메세지 제거
        setLoginError("");
      }, 5000);
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: onchange });

  return (
    <div className="auth-wrapper">
      <h3 style={{ fontSize: "30px" }}>Login</h3>
      <form onSubmit={handleSubmit(onLogin)}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          {...register("email", {
            required: true,
            pattern: /^\S+@\S+$/i,
          })}
        />
        {errors.email && errors.email.type === "required" && (
          <p>required email</p>
        )}
        {errors.email && errors.email.type === "pattern" && (
          <p>check email pattern</p>
        )}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          disabled={submit}
          {...register("password", {
            required: true,
            maxLength: 10,
          })}
        />
        {errors.password && errors.password.type === "required" && (
          <p>check password</p>
        )}
        {errors.password && errors.password.type === "maxLength" && (
          <p>check password</p>
        )}
        <input type="submit" />
        {loginError ? <p>{loginError}</p> : null}
      </form>
      <Link to="/register">
        <div>회원 가입이 되지 않았다면...</div>
      </Link>
    </div>
  );
}

export default LoginPage;
