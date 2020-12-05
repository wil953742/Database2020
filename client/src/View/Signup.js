import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "../CSS/loginstyle.module.css";

export const Signup = () => {
  const [userType, setUserType] = useState();
  const [userID, setUserID] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [name, setName] = useState();
  const [sex, setSex] = useState();
  const [birthday, setBirthday] = useState();
  const [address, setAddress] = useState();
  const [phone, setPhone] = useState();
  const [dupCheck, setDupCheck] = useState(false);
  const axios = require("axios").default;
  let history = useHistory();

  const PasswordCheck = (inputtxt) => {
    var passw = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    if (inputtxt.match(passw)) {
      return true;
    } else {
      return false;
    }
  };

  const IdDupCheck = async () => {
    await axios.get(`/api/signup/${userID}`).then((res) => {
      if (res.data.length === 0) {
        alert("사용 가능한 아이디입니다.");
        setDupCheck(true);
      } else {
        alert("이미 사용중인 아이디입니다.");
        setDupCheck(false);
      }
    });
  };

  const phoneFormat = (input) => {
    let changed = input.replace(/-/gi, "");
    if (changed.slice(0, 3) === "010" && changed.length === 11) {
      setPhone(changed);
      return true;
    }
    return false;
  };

  const checkTypes = () => {
    const form1 = document.forms.type;
    const radios1 = form1.elements.userType;
    const UT = Array.from(radios1).find((radio) => radio.checked);
    setUserType(UT.id);
  };

  const checkSex = () => {
    const form2 = document.forms.sex;
    const radios2 = form2.elements.sex;
    const S = Array.from(radios2).find((radio) => radio.checked);
    setSex(S.id);
  };

  const submit = () => {
    console.log(sex);
    console.log(userType);
    if (
      !userType ||
      userType === undefined ||
      !userID ||
      !password ||
      !confirmPassword ||
      !name ||
      !sex ||
      sex === undefined ||
      !birthday ||
      !address ||
      !phone
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
    if (!phoneFormat(phone)) {
      alert("전화번호를 확인해주세요.");
      return;
    }
    handleSignUp();
  };

  const handleSignUp = async () => {
    alert("회원가입이 완료되었습니다. 로그인 해주세요.");
    history.push("/");
    await axios
      .post("/api/signup", {
        BirthDate: birthday,
        UserID: userID,
        Phone: phone,
        Password: password,
        Name: name,
        Gender: sex,
        Address: address,
        Role: userType,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.div_signin}>
        <h1>회원가입</h1>
        <div className={styles.row}>
          <p>회원 유형</p>
          <form name="type">
            <div className={styles.radio_group}>
              <input
                type="radio"
                id="Submitter"
                name="userType"
                onChange={() => checkTypes()}
              />
              <label for="Submitter">제출자</label>
              <input
                type="radio"
                id="Estimator"
                name="userType"
                onChange={() => checkTypes()}
              />
              <label for="Estimator">평가자</label>
            </div>
          </form>
        </div>
        <div className={styles.row}>
          <p>아이디</p>
          <div className={styles.id_input}>
            <input
              disabled={dupCheck}
              type="text"
              placeholder="4글자 이상 입력"
              style={{ width: "180px", marginLeft: "0" }}
              name="userID"
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
            name="password"
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
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>이름</p>
          <input
            type="text"
            placeholder="홍길동"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>성별</p>
          <form name="sex">
            <div className={styles.radio_group}>
              <input
                type="radio"
                id="male"
                name="sex"
                onChange={() => checkSex()}
              />
              <label for="male">남성</label>
              <input
                type="radio"
                id="female"
                name="sex"
                onChange={() => checkSex()}
              />
              <label for="female">여성</label>
            </div>
          </form>
        </div>
        <div className={styles.row}>
          <p>생년월일</p>
          <input
            type="date"
            name="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>주소</p>
          <input
            type="text"
            placeholder="서울특별시 서대문구 ..."
            name="adress"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <p>전화번호</p>
          <input
            type="text"
            placeholder="010-1234-1234"
            name="phone"
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
