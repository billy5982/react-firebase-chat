컴포넌트 구조(리액트)

- [데이터 구조 피그마 링크](https://www.figma.com/file/1ad2WsgoHTv9iBw5qhmlCa/Untitled?node-id=0%3A1)  
  컴포넌트 구조
  ![컴포넌트 구조](https://user-images.githubusercontent.com/104412610/195377305-f78340b6-6842-4d23-8501-fc48c89d9b45.png)

## 리덕스 관련 메소드

```jsx
// index.js
// 해당 변수는 createStore과 같은 역할을 하게 됨.
import { Provider } from "react-redux";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
import Reducer from "./redux/reducer";
const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware, // 리듀서가 promise 객체 처리가능
  ReduxThunk // 리듀서가 function 처리 가능
)(createStore);
<Provider
      store={createStoreWithMiddleware(
        Reducer,
        // 익스텐션 사용을 위한 것
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
      >
<Provider/>
```

```jsx

// 리듀서 구조(2개, 현재채팅방, 현재 유저) 아래는 현재 유저에 대한 예시
const intialUserState = {
  //유저 정보를 변수에 저장할 것임
  currentUser: null,
  //로딩 중이라는 것을 표시?
  isLoading: true,
};

export default function (state = intialUserState, action) {
  switch (action.type) {
    case SET_USER:
      return ?
    default:
      return state
  }
```

## 파이어베이스 메소드 관련 정리

```jsx
// 데이터 베이스 , auth, 스토리지를 가져오는 방법
const auth = getAuth();
const dataBase = getDatabase();
const storage = getStorage();

//auth 관련 메소드
//회원가입 혹은 현재 유저에 대한 프로필 업데이트 함수
updateProfile(getAuth().currentUser, {추가할 정보})
//createUserWithEmailAndPassword 이메일과 패스워드로 회원가입 하는 메소드
let createdUser = await createUserWithEmailAndPassword(
authService,// getAuth()
data.email, // 인풋으로 전달받은 email
data.password // 인풋으로 전달받은 password
);
//signInWithEmailAndPassword 로그인 관련 메소드 try catch로 작성 성공하면 app.js로 다시 분기됨(루트 위치에서 로그인 유저 판변하고 분기해주면 됨)
let login = await loginWithEmailAndPassword(getAuth(),data.email,data.password);
//로그아웃   signOut(getAuth());
signOut(getAuth());

// 데이터 베이스 관련 메소드
// ref(getDatabase(),'message') -> 데이터베이스의 message에 접근, 데이터베이스와 storage의 ref는 각각 다르므로 import의 출처를 다르게 해줘야함
// ref 가 중첩된다면 하나를 ref as StrRef 로 변경 가능
ref(가져올 파이어베이스 정보(auth || dataBase || storage 등등), 주소)

// ref로 원하는 특정 서버의 베이스 구조를 가져왔다면 child를 통해 가져온 베이스 구조 안으로 접근할 수 있다
//ex onValue(child(userRef, `${userId}/favorited`), (data) => {}) userRef(user data베이스)에 자식인 userId 자식인/favorited까지 접근할 수 있다. ref위치에 추가적으로 사용
child(ref(),``)

//ref위치에 있는 존재하는 데이터를 감지하는 함수
onValue(ref,(data)=>{})

//ref위치에 추가되는 데이터를 감지하는 함수이다.
onChildAdded(ref, (data) => {
  data.val(); // data.val() 을 하면 데이터 베이스에 넣은 js 객체를 받을 수 있다
});

//ref위치에 제거되는 데이터를 감지하는 함수이다.
onChildremoved(ref, (data) => {
  data.val(); // data.val() 을 하면 데이터 베이스에 넣은 js 객체를 받을 수 있다
});

// ref위치에 데이터를 추가하는 함수, 위치, 추가할 데이터(객체) 순으로 넣는다.
set(ref(), {});

// ref위치에 데이터를 제거하는 함수
remove(ref())

// 스토리지 관련 메서드 + 위에 메소드들도 사용할 수 있음
// uploadBytesReSumable(파일을 추가할 스토리지 위치, 파일, 메타 데이터 순)
// file은 input 이벤트라면 event.target.files[0] 메타데이터는 {contentType : file.type} 으로 사용
uploadBytesReSumable(ref,file,metadata)
//uploadBytesReSumable를 변수에 할당했다면 .on("감지상태",()=>{업로드하는 데이터에 대한 실행문},(에러콜백)=>{},()=>{실행이후 동작할 함수})을 통해 저장되는 과정을 추출 가능
//data.bytesTransferred : 현재 진행중인 진척도
//data.totalBytes : 올리는 파일의 총량
uploadTask.on("state_changed",(data)=>{data.bytesTransferred},(error)=>{},()=>{})
//uploadBytesReSumable를 변수에 할당했다면 getDownloadURL(변수.ref)로 스토리지에 저장한 파일에 위치를 받아올 수 있음
let downloadUrl = await getDownloadURL(uploadTask.ref);

```

## 컴포넌트 로직 설명

- 현재 유저와 들어간 채팅방은 수시로 변하고 수시로 사용하는 컴포넌트 이기 때문에 리덕스에 state로 저장해둔다

#### Root(app.js)

- 유저 정보가 존재하면? ChatPage로 이동
- 유저 정보가 존재하지 않다면? LoginPage로 이동
- onAuthStateChanged(auth서버, (인자에 유저 정보가 담김)=>{})를 이용하여 유저 정보 확인 => 유저정보 존재한다면, 현재 리덕스에 해당 유저정보 저장(dispatch)

#### LoginPage

- react-hook-form 이용(회원가입 로직 참고)
- 로그인 하면 폼데이터를 전달받아 Auth 서버로 전달 -> 완료되면 App.js로 다시 이동
- signInWithEmailAndPassword(auth서버,입력폼 이메일,비밀번호) => try catch 이용 로그인 정보가 없으면 catch를 사용
- Link를 이용해서 회원가입으로 이동 가능

#### Register

- Link를 이용해서 로그인으로 이동 가능
- react-hook-form 이용
  - react hook form => register, handleSubit,watch,formState :{error}을 useForm에서 받아옴
  - useForm 인자로 {mode : 'onChange'}를 이용하면 수시로 유효성 검사해줌
  - 태그에 `...register("해당 태그 역할 이름",require({'유효성 검사 항목 작성 ex)require,minLength'}))`
  - 태그 바깥에서 `{errors.password && errors.password.type === "required" && (
      <p>This password field is required</p>
    )}`을 통해 유효성 검사 가능
- 폼에 모든 정보를 종합하여 createUserWithEmailAndPassword를 이용해서
  회원 정보를 제작 -> 해당 함수를 선언 시 변수에 할당해주면 현재 제작된 유저 정보가 변수에 할당
- updateProfile(auth서버.currentUser,{수정할 정보})을 이용하면 현재 유저 정보를 수정할 수 있음 -> 수정할 정보를 객체와 키 형태로 작성
- 나중에 다이렉트 메세지 구현을 위해 데이터베이스 user에다 auth.currentUser를 이용하여 데이터 베이스에 유저의 이름과 imageURL 만 뽑아내서 저장 가능(createdUser 은 회원가입 함수를 실행하고 할당한 변수)
  - photoURL 로직 => md5 라이브러리를 이용
  ```js
  await set(ref(database, "users/" + createdUser.user.uid), {
    name: createdUser.user.displayName,
    image: createdUser.user.photoURL,
  });
  ```

## MainPanel 로직

#### Main Panel

- 현재 유저 정보를 확인 redux
- 현재 채팅방의 메세지를 관리해서 Message 컴포넌트 map
- 현재 채팅방 메세지 감지
  - `onChildAdded('데이터 베이스 위치',(데이터)=>{})` 해당 데이터 베이스의 메시지가 들어오는 것을 계속 감지 -> 메세지 Array에 추가 -> 실시간 가능 useEffect을 사용하고 dependency Array => [] 값으로 설정해줘도 감지
- 타이핑 감지
  - `onChildAdded와` `onChildRemoved를` 통해 messageForm에서 입력이 되면 typing 데이터 베이스가 추가되고 입력이 취소되면 데이터가 지워지는 데 이를 감지해서 다른 유저가 타이핑을 치는 것을 확인하고 패널에 출력
  - 현재 유저를 제외한 정보와 두 파이어베이스 메소드 위에 변수를 두면 변수를 초기화 되지 않는 특성을 가짐
- userPost 생성
  - 위에서 현재 채팅방 메세지 감지되는 것을 확인하고, 유저명과 메세지 목록만 확인해서 배열 데이터로 생성
  - 이를 현재 리듀서에 저장

#### Messagae 로직

- map으로 전달되는 chatmessages 정보를 정보에 맞게 배치, momnent와 message 내부의 timestamp를 이용하여 시간을 계산
- 저장된 메세지에 이미지가 있는 지 확인하고 이미지면 이미지를 콘텐트면 콘텐트를 map

#### MessageHeader

- 리덕스에 저장된 현재 방정보와 user, userPost를 이용해서 간단한 정보들을 헤더와 드롭다운에 표시
- favorite이라는 항목을 구현해서 해당 버튼이 클릭되면 `set(ref())`을 이용해 현재 유저가 좋아요를 누른 채팅방을 데이터 베이스의 저장, 하트 버튼을 다시 클릭하면 지워져야하기 때문에 `remove(child(데이터베이스,주소))`를 이용하여 데이터를 지움
- 새로고침을 했을 때도 `onValue(주소,()=>{})`를 통해 유저가 누른 favorite 방을 확인하여 좋아요 상태일지 말지를 결정

#### MessageForm

- 리덕스에 현재 저장된 정보를 이용해서 해당 방에 message 데이터 베이스에 접근
- 메세지를 보내면 콘텐츠인지 img인지 확인해야하는 로직 필요 콘텐츠면 set()을 이용한 메세지 데이터 객체 추가, 이미지는 url로 저장
- 이미지를 스토리지에 올리는 메소드 uploadBytesReSumable(ref(스토리지,filepath),file,metadata) 순
- 위 uploadBytesReSumable를 변수에 할당하면 on메소드 사용 가능. uploadTask.on("감지이벤트 state_changed",진행율 확인 콜백 함수(snapshot)=>{`snapshot.bytesTransferred로 업로드 진행상황 체크 가능`, / `snapshot.totalBytes으로 토탈 용량 확인 가능`},실패했을 경우 콜백함수,완료가 되었을 때 실행될 함수 `getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)`)

## SidePanel

#### ChatRoom

- react-bootstrap을 이용한 모달창 삽입
- +버튼을 누르면 해당 모달창이 보이도록 상태 관리  
  모달창에서 입력한 정보(제작한 대화방)은 database로 전달, 파이어 베이스 push(데이터 베이스 서버).key를 이용하면 고유의 아이디를 만들 수 있음
  방에 대한 정보를 담은 객체를 만들어서,
  `update(child(메세지룸주소,key),{정보 객체})`이용하고 방을 제작
- chatRoomRef 데이터 베이스에 접근해서 현재 존재하는 방들의 데이터를 배열로 받아옴.`onChildAdded`

#### DirectMessages

- 데이터베이스에 저장된 로그인한 유저들의 정보를 전부 가져옴  
  그 중에서 현재 리덕스에 저장되있는 현재 유저와 다른 유저들을 가져오는 것
- 고유의 챗방을 만들건데 클릭한 유저의 아이디와 내 이름을 비교해서 큰 것을 기준으로 작은 것을 합쳐 두 사람간의 고정적인 아이디를 제작-> 현재 채팅방으로 리덕스에 저장, 해당 채팅방을 클릭후 메세지를 보내면 메인 패널 챗 폼에서는 현재 리덕스에 저장된 챗룸의 아이디를 기준으로 파이어베이스 서버에다 챗 데이터를 보냄 -> 그러면 메세지 폼에 새로운 채팅방과 채팅방안에 보낸 메세지가 생겨나는 것

#### Favorite

- 메세지 헤더에서 favorite을 클릭하면 유저데이터 베이스에 클릭한 목록이 저장됨 -> 해당 데이터 베이스 주소를 감지하여 (onChildAdded) 해당 목록을 나열해중

#### UserPenel

- 우선적으로 `input File`을 hide하고 `ref`를 할당, 드롭다운을 클릭하면 해당 ref에 접근하여 클릭 모든 이벤트틑 해당 input file에서 처리
- `await uploadBytesReSumable(스토리지위치(저장위치),file,metadata)`을 이용하여 스토리지에 저장하고 해당 값을 변수에 할당, `await getDownloadURL(스토리지 값 할당변수)`를 하면 스토리지의 저장된 Url를 가져올 수 있음  
  `updateProfile(authService.currentUser,{수정 내용})`을 이용하여 유저 photoURL에 업로드한 스토리지 주소를 입력하여 이미지를 변경  
  dispatch를 이용하여 현재 유저 정보 이미지 수정하면 됨, 회원 가입 유저만 변경하는 것이 아닌 `데이터베이스 유저 정보`도 `변경`해야함  
  `updata(ref(데이터베이스,"users/+user.uid"),{수정요청할 내용})`
- 로그아웃 : `signOut` 파이어베이스 메소드 이용

데이터 베이스 구조(파이어 베이스)  
![데이터 베이스 구조](https://user-images.githubusercontent.com/104412610/195376451-e40d4c72-9c85-4aca-a279-b5e3aeadce2e.png)
![image](https://user-images.githubusercontent.com/104412610/195581134-630a4ba8-e4f3-4b2f-8a55-c660ba4c8d09.png)
![image](https://user-images.githubusercontent.com/104412610/195581181-a347b8e6-3049-4835-a45b-7a647613c481.png)

리덕스 구조  
![리덕스 구조](https://user-images.githubusercontent.com/104412610/195377507-9adbf27f-adb5-491e-9fc3-617ed9c660ee.png)
