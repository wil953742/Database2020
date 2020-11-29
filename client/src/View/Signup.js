import React, { useState } from "react";
import { post } from 'axios';
import { useHistory } from "react-router-dom";
import styles from "../CSS/loginstyle.module.css";

export const Signup = () => {
  const [userType, setUserType] = useState(null);
  const [userID, setUserID] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [name, setName] = useState(null);
  const [sex, setSex] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState(null);
  const [dupCheck, setDupCheck] = useState(false);

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
    setDupCheck(true);
  };

  const submit = () => {
    const form1 = document.forms.type;
    const radios1 = form1.elements.selector;
    const UT = Array.from(radios1).find((radio) => radio.checked);
    if (UT == null) {
      alert("유저 유형을 선택하세요.");
      return;
    }
    setUserType(UT.id);
    const form2 = document.forms.sex;
    const radios2 = form2.elements.selector2;
    const S = Array.from(radios2).find((radio) => radio.checked);
    if (S == null) {
      alert("성별을 선택하세요.");
      return;
    }
    setSex(S.id);
    if (
      userType == null ||
      userID == null ||
      password == null ||
      confirmPassword == null ||
      name == null ||
      birthday == null ||
      sex == null ||
      address == null ||
      phone == null
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

    const url = '/api/signup';
    const formData = new FormData();
    formData.append('userType', userType);
    formData.append('userID', userID);
    formData.append('password', password);
    formData.append('name', name);
    formData.append('birthday', birthday);
    formData.append('sex', sex);
    formData.append('address', address);
    formData.append('phone', phone);
    post(url, formData);
    
   //windows.location.reload();

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
              onChange={(e) => setUserID(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>이름</p>
          <input
            type="text"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>주소</p>
          <input
            type="text"
            placeholder="서울특별시 서대문구 ..."
            value={address}
            onChange={(e) => setAddress(e.target.value )}
          />
        </div>
        <div className={styles.row}>
          <p>전화번호</p>
          <input
            type="text"
            placeholder="010-1234-1234"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button className={styles.button} onClick={() => submit()}>
          완료
        </button>
      </div>
    </div>
  );
};
