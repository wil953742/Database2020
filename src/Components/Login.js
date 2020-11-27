import React from "react";
import styles from "../CSS/loginstyle.module.css";
import { useHistory } from "react-router-dom";
import logo from "../Images/로고.png";

export const Login = ({ setUserType, setName, setUserID, setLog }) => {
  var history = useHistory();
  var user = {
    userID: 999,
    userType: "평가자",
    name: "홍길동",
  };
  const handleLogin = () => {
    localStorage.setItem(`user`, JSON.stringify(user));
    history.push("/");
  };
  return (
    <div className={styles.main_container}>
      <div className={styles.div_signin}>
        <img className={styles.main_logo} src={logo} alt="메인 로고" />
        <p className={`${styles.notice} ${styles.login_p}`}>로그인 하세요</p>
        <input
          type="email"
          id="inputEmail"
          className={styles.div_input}
          placeholder="Email address"
        />
        <input
          type="password"
          id="inputPassword"
          className={styles.div_input}
          placeholder="Password"
        />
        <br />
        <button
          className={styles.button}
          type="submit"
          onClick={() => handleLogin()}
        >
          로그인
        </button>
        <br />
        <a
          href=""
          id={styles.div_signup}
          className={styles.login_a}
          href="./signup"
        >
          회원가입
        </a>
        <p className={`${styles.copyright} ${styles.login_p}`}>
          &copy; 연세대학교 데이터베이스 14팀
        </p>
      </div>
    </div>
  );
};
