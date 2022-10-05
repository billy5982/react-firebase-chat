import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
//md5 유니크한 값을 가지기 위해 사용하는 모듈 , require('md5') md5('타이핑 치면') => 랜덤값 표시
import md5 from "md5";
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// firebase에서 설정한 database,authService로 회원가입 및 서버 인증 시작
import { authService, database } from "../../firebase";

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

  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  //회원가입이 진행중일 땐 회원가입 버튼을 막아야함.
  const [submitStop, setSubmitStop] = useState(false);
  // 왜 state를 사용하지 않는 가???
  // useRef는 특정 DOM을 선택할 때 사용. watch를 사용하면 해당 이름을 가진 태그에 value를 가져올 수 있음
  // register를 이용하여 태그에게 이름을 부여할 수 있고 watch를 통해 해당 태그에 value를 확인할 수 있음(onChange 느낌)
  // ref를 이용해 해당 변수에 password 태그의 입력값을 넣어줌
  const password = useRef(null);
  password.current = watch("password");

  const onSubmit = async (data) => {
    //handleSubmit으로 인해 해당 함수 data에 form 안에 있는 태그들의 value가 객체 형태로 전달된다
    // data =
    // {email: 'asd@na.com',  //data에 키값들은 register로 지정한 해당 태그의 이름이다.
    // name: 'asdasda',
    // password: 'asdasdf',
    // passwordConfirm: 'asdasdf'
    // }
    try {
      setSubmitStop(true);

      // 인증 서버에 접근해서 회원 가입 진행 해당 정보를 데이터 베이스에도 전달해야함.
      let createdUser = await createUserWithEmailAndPassword(
        //유저를 이메일과 패스워드로 생성
        authService,
        data.email,
        data.password
      ); // 회원가입 정보를 기입하는 auth서버에 접근해서 해당 정보를 저장, 저장된 정보를 createdUser가 가지고 있음

      // createdUser은 객체형태이며, user라는 키 값에 accessToken, displayName,protoUrl을 가지고 있음
      await updateProfile(authService.currentUser, {
        // 유저 정보를 업데이트 해주는 메소드 1인자 : auth.currentUser 회원가입한 현재 유저?, 2인자 수정할 정보 객체로 기재
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(
          createdUser.user.email
        )}?d=identicon`,
      });
      // console.log(createdUser); 생성된 유저 데이터를 displayname. photoURL을 수정할 수 있음

      // 데이터 베이스에 인증된 데이터 전달하기
      // ref는 reference => dataBase, table, row 순
      /*  database 구조
        // 데이터 베이스 database { 
          // table - users : {
           // row - uid(회원 고유 아이디) : { 
              //column -  displayname : 
                          email : 
            } ...회원 가입 아이디 저장
          }
        }
      
        */
      //ref 는 데이터 베이스 주소라고 생각하면 될듯?
      // set(ref(데이터베이스, 테이블 + row) , {Column 정보})
      await set(ref(database, "users/" + createdUser.user.uid), {
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });

      setSubmitStop(false);
    } catch (error) {
      setSubmitStop(false);
      setErrorFromSubmit(error.message);
      setTimeout(() => {
        setErrorFromSubmit(""); // 5초 지난 후 에러가 사라짐.
      }, 5000);
    }
  };

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
            validate: (value) => value === password.current, //비교하는 검사 value에는 해당 태그의 value가 들어간다.
          })}
        />
        {errors.passwordConfirm &&
          errors.passwordConfirm.type === "validate" && (
            <p>password not collect</p>
          )}
        {errorFromSubmit ? <p>{errorFromSubmit}</p> : null}
        <input type="submit" value={"SUBMIT"} disabled={submitStop} />
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
