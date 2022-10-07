import React from "react";
import { IoIosChatboxes } from "react-icons/io";
import { Container } from "../../styled/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import { useDispatch, useSelector } from "react-redux";
import { authService, database } from "../../../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { clearUser, setPhotoURL } from "../../../redux/actions/user_actions";
import { useRef } from "react";
import { storage } from "../../../firebase";
import {
  getStorage,
  ref as strRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { ref, set, update } from "firebase/database";
import { useNavigate } from "react-router-dom";

function UserPanel() {
  const user = useSelector((state) => state.user.currentUser);
  const inputRef = useRef(null);
  // console.log(user);
  const navi = useNavigate();
  const dispatch = useDispatch();
  // 로그아웃 부분도 파이어 베이스에서 처리를 해줘야 함.
  // 여기서 로그아웃 처리를 하면 App.js에서 해당 항목을 처리함. 그리고 App.js에서
  // 로그인했을 때 로그인 상태정보를 저장하듯이 로그아웃했을 때도 상태처리를 해줘야함.
  const handleLogout = () => {
    signOut(authService);
    dispatch(clearUser());
    navi("/login");
  };
  const changeProfile = () => {
    inputRef.current.click();
  };
  const handleUploadImage = async (e) => {
    //이미지는 스토리지를 이용해야함, 파일의 데이터를 e.target.files[0]을 하면 얻을 수 있음
    const file = e.target.files[0];
    // 메타 데이터 형식임.
    const metadata = { contentType: file.type }; //image/png? image/jpeg
    try {
      // 스토리에 파일 저장하기
      // strRef(스토리지, 스토리지에 해당 파일 저장 위치(유저 이미지 폴더안에 유저 아이디로 이미지가 저장됨),현재 파일 정보, 메타 데이터)
      let uploadTask = await uploadBytesResumable(
        strRef(storage, `user_image/${user.uid}`),
        file,
        metadata
      );

      // 스토리지에 저장했던 이미지의 스토리지 url을 가져올 수 있음
      let downloadUrl = await getDownloadURL(uploadTask.ref);
      // console.log(downloadUrl);

      // auth service에 회원 정보의 image url로 바꿔줘야함.
      await updateProfile(authService.currentUser, {
        photoURL: downloadUrl,
      });
      // 전역 현재 상태도 업데이트 해야함
      dispatch(setPhotoURL(downloadUrl));

      // 데이터 베이스의 저장된 정보도 업데이트(update method) 해야함 user데이터 플롯안에
      // user.uid키로 image와 name이 저장되있는 형태 데이터 베이스
      update(ref(database, "users/" + user.uid), {
        image: downloadUrl,
      });
    } catch {
      console.error((error) => error);
    }
  };

  return (
    <div>
      {/* logo */}
      <h3 style={{ color: "white" }}>
        <IoIosChatboxes /> Chat App
      </h3>
      {/* 유저 드롭다운 */}
      <div style={{ display: "flex", margin: "0 0 1rem 0" }}>
        <Image
          src={user && user.photoURL}
          style={{ width: "30px", height: "30px", marginTop: "3px" }}
          roundedCircle
        ></Image>
        <input
          // 파일을 선택하면 onChange 이벤트가 발생함
          onChange={handleUploadImage}
          accept="image/jpeg, image/png"
          type="file"
          style={{ display: "none" }}
          ref={inputRef}
        />
        <Dropdown>
          <Dropdown.Toggle
            style={{ background: "transparent", border: "0" }}
            id="dropdown-basic"
          >
            {user && user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={changeProfile}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃 </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default UserPanel;
