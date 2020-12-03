import React, { useState, useEffect } from "react";
import styles from "../CSS/loginstyle.module.css";
import { useHistory } from "react-router-dom";
import logo from "../Images/로고.png";
import { User } from "./classes";
// import axios from "../axios";

export const Login = () => {
  var id, pw;
  const axios = require("axios");
  var type = {
    Submitter: "제출자",
    Administrator: "관리자",
    Estimator: "평가자",
  };
  var history = useHistory();
  const [data, setData] = useState();

  const handleLogin = async () => {
    const url = "/api/loginAuth";
    const res = await axios.get(url + `/${id}&${pw}`).catch((err) => {
      if (err.response) {
        console.log(err.responsse);
      } else if (err.request) {
        console.log("never recieved a response");
      }
    });
    if (res && res.data) setData(res);
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data.data.length == 0) {
      alert("아이디와 비밀번호를 확인해주세요.");
      return;
    }
    let loginInfo = new User(
      data.data[0].AccountID,
      data.data[0].UserID,
      type[data.data[0].Role],
      data.data[0].Name,
      data.data[0].Gender.data,
      data.data[0].Address,
      data.data[0].BirthDate,
      data.data[0].Phone
    );
    console.log(loginInfo);
    localStorage.setItem(`user`, JSON.stringify(loginInfo));
    history.push("/");
  }, [data]);

  return (
    <div className={styles.main_container}>
      <div className={styles.div_signin}>
        <img className={styles.main_logo} src={logo} alt="메인 로고" />
        <p className={`${styles.notice} ${styles.login_p}`}>로그인 하세요</p>
        <input
          type="email"
          id="inputEmail"
          className={styles.div_input}
          placeholder="User ID"
          value={id}
          onChange={(e) => (id = e.target.value)}
        />
        <input
          type="password"
          id="inputPassword"
          className={styles.div_input}
          placeholder="Password"
          value={pw}
          onChange={(e) => (pw = e.target.value)}
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
