컴포넌트 구조(리액트)

- [데이터 구조 피그마 링크](https://www.figma.com/file/1ad2WsgoHTv9iBw5qhmlCa/Untitled?node-id=0%3A1)  
  컴포넌트 구조
  ![컴포넌트 구조](https://user-images.githubusercontent.com/104412610/195377305-f78340b6-6842-4d23-8501-fc48c89d9b45.png)
- 컴포넌트 로직 설명
  - Root(app.js)
    - 유저 정보가 존재하면? ChatPage로 이동
    - 유저 정보가 존재하지 않다면? LoginPage로 이동
    - onAuthStateChanged(auth서버, (인자에 유저 정보가 담김)=>{})를 이용하여 유저 정보 확인 => 유저정보 존재한다면, 현재 리덕스에 해당 유저정보 저장(dispatch)
  - LoginPage
    - react-hook-form 이용(회원가입 로직 참고)
    - 로그인 하면 폼데이터를 전달받아 Auth 서버로 전달 -> 완료되면 App.js로 다시 이동
    - signInWithEmailAndPassword(auth서버,입력폼 이메일,비밀번호) => try catch 이용 로그인 정보가 없으면 catch를 사용
    - Link를 이용해서 회원가입으로 이동 가능
  - Register
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
  - MainPanel 로직
    - 현재 유저 정보를 확인 redux
    - 현재 채팅방의 메세지를 관리해서 Message 컴포넌트 map
    - 현재 채팅방 메세지 감지
      - onChildAdded('데이터 베이스 위치',(데이터)=>{}) 해당 데이터 베이스의 메시지가 들어오는 것을 계속 감지 -> 메세지 Array에 추가 -> 실시간 가능 useEffect을 사용하고 dependency Array => [] 값으로 설정해줘도 감지
    - 타이핑 감지
      - onChildAdded와 onChildRemoved를 통해 messageForm에서 입력이 되면 typing 데이터 베이스가 추가되고 입력이 취소되면 데이터가 지워지는 데 이를 감지해서 다른 유저가 타이핑을 치는 것을 확인하고 패널에 출력
      - 현재 유저를 제외한 정보와 두 파이어베이스 메소드 위에 변수를 두면 변수를 초기화 되지 않는 특성을 가짐
    - userPost 생성
      - 위에서 현재 채팅방 메세지 감지되는 것을 확인하고, 유저명과 메세지 목록만 확인해서 배열 데이터로 생성
      - 이를 현재 리듀서에 저장
  - Messgae 로직
    - map으로 전달되는 chatmessages 정보를 정보에 맞게 배치, momnent와 message 내부의 timestamp를 이용하여 시간을 계산
  - MessageHeader
    - 리덕스에 저장된 현재 방정보와 user, userPost를 이용해서 간단한 정보들을 헤더와 드롭다운에 표시
    - favorite이라는 항목을 구현해서 해당 버튼이 클릭되면 `set(ref())`을 이용해 현재 유저가 좋아요를 누른 채팅방을 데이터 베이스의 저장, 하트 버튼을 다시 클릭하면 지워져야하기 때문에 `remove(child(데이터베이스,주소))`를 이용하여 데이터를 지움
    - 새로고침을 했을 때도 `onValue(주소,()=>{})`를 통해 유저가 누른 favorite 방을 확인하여 좋아요 상태일지 말지를 결정
  - MessageForm
    - 리덕스에 현재 저장된 정보를 이용해서 해당 방에 message 데이터 베이스에 접근
    - 메세지를 보내면 콘텐츠인지 img인지 확인해야하는 로직 필요 콘텐츠면 set()을 이용한 메세지 데이터 객체 추가
    - 이미지면

데이터 베이스 구조(파이어 베이스)  
![데이터 베이스 구조](https://user-images.githubusercontent.com/104412610/195376451-e40d4c72-9c85-4aca-a279-b5e3aeadce2e.png)
리덕스 구조  
![리덕스 구조](https://user-images.githubusercontent.com/104412610/195377507-9adbf27f-adb5-491e-9fc3-617ed9c660ee.png)
