import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "../CSS/loginstyle.module.css";

import { AdminNav } from "../Components/AdminNav";

const EditUserInfo = () => {
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [address, setAddress] = useState(null);
  const [phone, setPhone] = useState(null);
  const sex = "남성";
  const birthday = "2000-01-01";
  
  const edit = () => {
    console.log("store changed info");
  }

  var logInfo;
  var history = useHistory();
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  } else {
    history.push("/");
  }

  return (
    <div>
      <AdminNav
        userType={logInfo.userType}
        name={logInfo.name}
        userID={logInfo.userID}
      />
      <div className={`${styles.div_signin} ${styles.margin_top_bot_50}`}>
        <h1>정보수정</h1>
        <div className={styles.row}>
          <p>회원 유형</p>
          <form name="type">
            <div className={styles.radio_group}>
              <input type="radio" id="userType" name="selector" disabled/>
              <label for="userType">{logInfo.userType}</label>
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
              value={logInfo.userID}
              disabled
            />
          </div>
        </div>
        <div className={styles.row}>
          <p>변경 비밀번호</p>
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
            value={logInfo.name}
            disabled
          />
        </div>
        <div className={styles.row}>
          <p>성별</p>
          <form name="sex">
            <div className={styles.radio_group}>
              <input type="radio" id="userSex" name="selector2" disabled/>
              <label for="userSex">{sex}</label>
            </div>
          </form>
        </div>
        <div className={styles.row}>
          <p>생년월일</p>
          <input
            type="date"
            value={birthday}
            disabled
          />
        </div>
        <div className={styles.row}>
          <p>주소</p>
          <input
            type="text"
            placeholder="서울특별시 서대문구 ..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
        <button className={styles.button} onClick = {()=>edit()}>
          완료
        </button>
      </div>
    </div>
  );
};

export default EditUserInfo;
