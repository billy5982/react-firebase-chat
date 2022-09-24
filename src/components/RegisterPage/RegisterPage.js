import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
// watch 함수 => watch('name')
//<유효성 검사할 태그 {...register('해당 태그 이름을 정해준다', {유효성 검사할 항목})}
//{유효성 검사할 항목}
//  required의 의미 : 텍스트를 쳐야 유효성 검사를 할 수 있기 때문에 true로 작성, 텍스트가 존재하지 않으면 유효성 검사에 실패해야하기 때문
//  maxLength의 의미 : 해당 태그가 사용할 수 있는 제일 긴 문자열의 길이를 의미
//{errors.태그 네임 && <p>This field is required</p>} => 유효성 체크에 걸리면 해당 태그를 랜더링한다.
function RegisterPage() {
  //useForm을 이용해서 필요한 메소드들을 가져온다. 기본 형식임.
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" }); // { mode : 'onChange' }change가 일어날때 마다 유효성 검사를 시작함

  // 왜 state를 사용하지 않는 가???
  // useRef는 특정 DOM을 선택할 때 사용. watch를 사용하면 해당 이름을 가진 태그에 value를 가져올 수 있음
  // register를 이용하여 태그에게 이름을 부여할 수 있고 watch를 통해 해당 태그에 value를 확인할 수 있음(onChange 느낌)
  // ref를 이용해 해당 변수에 password 태그의 입력값을 넣어줌
  const password = useRef(null);
  password.current = watch("password");

  const onSubmit = (data) => {};

  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: "center" }}>
        <h3>Register </h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="">Email</label>
        <input
          type="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })} //pattern : 정규식
        />
        {/* 해당 이름을 가진 태그가 유효성 검사에 실패한다면 아래 p태그가 추가된다. */}
        {errors.email && <p>This filed is required</p>}
        <label htmlFor="">Name</label>
        <input
          type="text"
          {...register("name", { required: true, maxLength: 10 })}
        />
        {errors.name && errors.name.type === "required" && (
          <p>This name field is required</p>
        )}
        {errors.name && errors.name.type === "maxLength" && (
          <p>Your input exceed maximum length</p>
        )}
        <label htmlFor="">Password</label>
        <input
          type="password"
          name="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required" && (
          <p>This password field is required</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p>Password must have at least 6 characters</p>
        )}

        <label htmlFor="">Password Confirm</label>
        <input
          type="password"
          // 해당 태그를 passwordConfirm 이름으로 등록하고, 해당 유효성 검사를 진행할 수 있다.
          {...register("passwordConfirm", {
            required: true,
            validate: (value) => value === password.current,
          })}
        />
        {errors.passwordConfirm &&
          errors.passwordConfirm.type === "validate" && (
            <p>password not collect</p>
          )}
        <input type="submit" value={"SUBMIT"} />
      </form>
      <div>
        <Link to="/login" style={{ color: "gray", textDecoration: "none" }}>
          이미 아이디가 있다면...
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;
