import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "../CSS/loginstyle.module.css";
import { post } from "axios";

export const Signup = () => {
  const [userType, setUserType] = useState('');
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [sex, setSex] = useState('');
  const [birthday, setBirthday] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  var dupCheck = false;
  let history = useHistory();

  const addSignUp = () => {
    const url = '/api/signup';
    const formData = new FormData();
    formData.append('userType', userType)
    formData.append('userID', userID)
    formData.append('password', password)
    formData.append('name', name)
    formData.append('sex', sex)
    formData.append('birthday', birthday)
    formData.append('address', address)
    formData.append('phone', phone)

    return post(url, formData);
  }

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
    const radios1 = form1.elements.userType;
    const UT = Array.from(radios1).find((radio) => radio.checked);
    if (UT == null) {
      alert("유저 유형을 선택하세요.");
      return;
    }
    setUserType(UT.id);
    const form2 = document.forms.sex;
    const radios2 = form2.elements.sex;
    const S = Array.from(radios2).find((radio) => radio.checked);
    if (S == null) {
      alert("성별을 선택하세요.");
      return;
    }
    setSex(S.id);
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
    addSignUp()
    .then((response) => {
      console.log(response.data);
    })


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
              <input type="radio" id="submitter" name="userType"/>
              <label for="submitter">제출자</label>
              <input type="radio" id="estimator" name="userType"/>
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
              name = 'userID'
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
            name='password'
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
            name='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>이름</p>
          <input
            type="text"
            placeholder="홍길동"
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>성별</p>
          <form name="sex">
            <div className={styles.radio_group}>
              <input type="radio" id="male" name="sex"/>
              <label for="male">남성</label>
              <input type="radio" id="female" name="sex"/>
              <label for="female">여성</label>
            </div>
          </form>
        </div>
        <div className={styles.row}>
          <p>생년월일</p>
          <input
            type="date"
            name='birthday'
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>주소</p>
          <input
            type="text"
            placeholder="서울특별시 서대문구 ..."
            name='adress'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>전화번호</p>
          <input
            type="text"
            placeholder="010-1234-1234"
            name='phone'
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
