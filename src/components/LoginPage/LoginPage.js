import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { authService } from "../../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
function LoginPage() {
  const onLogin = async (data) => {
    try {
      console.log(data);
      // auth 서버에 접근해서 이메일과 비밀번호를 확인 해당 정보를 loginUser에 넣어줌
      const auth = getAuth();
      let loginUser = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      console.log(loginUser);
    } catch (errors) {}
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
      </form>
      <Link to="/register">
        <div>회원 가입이 되지 않았다면...</div>
      </Link>
    </div>
  );
}

export default LoginPage;
