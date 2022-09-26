// Import the functions you need from the SDKs you need
// 파이어베이스는 서버에서 제작하는 인증,데이터베이스 스토리지, 알림 등을 자동적으로 제공
// 아래처럼 불러와서 사용할 수 있음
import firebase from "firebase/compat/app";

import "firebase/compat/storage"; // 스토리지 불러오기
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDN93MCmmZR_-U5DGP_9IOXrsmcjqytQlg",
  authDomain: "react-firebase-chat-app-fa572.firebaseapp.com",
  projectId: "react-firebase-chat-app-fa572",
  storageBucket: "react-firebase-chat-app-fa572.appspot.com",
  messagingSenderId: "314102503147",
  appId: "1:314102503147:web:f66d3e25e17f65a0ee50ae",
  measurementId: "G-V20KZSYML5",
};

// Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);
const app = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); 통계를 보여주는 부분

//auth auth와 database를 받아온 다음에 export 해줘야 함.
export const authService = getAuth();
export const database = getDatabase();
