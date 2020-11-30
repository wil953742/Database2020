import React from "react";
import { useHistory } from "react-router-dom";
import styles from "../CSS/loginstyle.module.css";

export const Signup = () => {
  var userType,
    userID,
    password,
    confirmPassword,
    name,
    sex,
    birthday,
    address,
    phone;
  var dupCheck = false;
  let history = useHistory();

  const PasswordCheck = (inputtxt) => {
    var passw = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if (inputtxt.match(passw)) {
      return true;
    } else {
      return false;
    }
  };

  const IdDupCheck = () => {
    // 아이디 중복 확인
    dupCheck = true;
  };

  const submit = () => {
    const form1 = document.forms.type;
    const radios1 = form1.elements.selector;
    const UT = Array.from(radios1).find((radio) => radio.checked);
    if (UT == null) {
      alert("유저 유형을 선택하세요.");
      return;
    }
    userType = UT.id;
    const form2 = document.forms.sex;
    const radios2 = form2.elements.selector2;
    const S = Array.from(radios2).find((radio) => radio.checked);
    if (S == null) {
      alert("성별을 선택하세요.");
      return;
    }
    sex = S.id;
    if (
      userType === null ||
      userID === null ||
      password === null ||
      confirmPassword === null ||
      name === null ||
      birthday === null ||
      sex === null ||
      address === null ||
      phone === null
    ) {
      alert("빈 칸을 입력해주세요.");
      return;
    }
    if (!PasswordCheck(password)) {
      alert("비밀번호를 확인해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호를 확인해주세요.");
      return;
    }
    if (!dupCheck) {
      alert("아이디 중복확인을 해주세요.");
      return;
    }
    handleSignUp();
  };

  const handleSignUp = () => {
    // Process Sign Up
    alert("회원가입이 완료되었습니다. 로그인 해주세요.");
    history.push("/");
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.div_signin}>
        <h1>회원가입</h1>
        <div className={styles.row}>
          <p>회원 유형</p>
          <form name="type">
            <div className={styles.radio_group}>
              <input type="radio" id="submitter" name="selector" />
              <label for="submitter">제출자</label>
              <input type="radio" id="estimator" name="selector" />
              <label for="estimator">평가자</label>
            </div>
          </form>
        </div>
        <div className={styles.row}>
          <p>아이디</p>
          <div className={styles.id_input}>
            <input
              type="text"
              placeholder="4글자 이상 입력"
              style={{ width: "180px", marginLeft: "0" }}
              value={userID}
              onChange={(e) => (userID = e.target.value)}
            />
            <button onClick={() => IdDupCheck()}>중복확인</button>
          </div>
        </div>
        <div className={styles.row}>
          <p>비밀번호</p>
          <input
            type="password"
            placeholder="*******"
            value={password}
            onChange={(e) => (password = e.target.value)}
          />
        </div>
        <p className={styles.subscript}>
          문자, 숫자, 특수문자를 포함해야하며, 8글자 이상 입력해야 합니다.
        </p>
        <div className={styles.row}>
          <p>비밀번호 확인</p>
          <input
            type="password"
            placeholder="*******"
            value={confirmPassword}
            onChange={(e) => (confirmPassword = e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>이름</p>
          <input
            type="text"
            placeholder="홍길동"
            value={name}
            onChange={(e) => (name = e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>성별</p>
          <form name="sex">
            <div className={styles.radio_group}>
              <input type="radio" id="male" name="selector2" />
              <label for="male">남성</label>
              <input type="radio" id="female" name="selector2" />
              <label for="female">여성</label>
            </div>
          </form>
        </div>
        <div className={styles.row}>
          <p>생년월일</p>
          <input
            type="date"
            value={birthday}
            onChange={(e) => (birthday = e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>주소</p>
          <input
            type="text"
            placeholder="서울특별시 서대문구 ..."
            value={address}
            onChange={(e) => (address = e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>전화번호</p>
          <input
            type="text"
            placeholder="010-1234-1234"
            value={phone}
            onChange={(e) => (phone = e.target.value)}
          />
        </div>
        <button className={styles.button} onClick={() => submit()}>
          완료
        </button>
      </div>
    </div>
  );
};
