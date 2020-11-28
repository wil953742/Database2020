import React from "react";
import styles2 from "../CSS/homestyle.module.css";
import { Link } from "react-router-dom";

import account_logo from "../Images/계정로고.png";
import logo2 from "../Images/로고2.png";

export const AdminNav = ({ userType, name, userID }) => {
  return (
    <nav className={styles2.nav}>
      <div className={`${styles2.nav_item} ${styles2.nav_item_right}`}>
        <img
          className={styles2.account_logo_nav}
          src={account_logo}
          alt="계정로고"
        />
        <p className={styles2.nav_p}>
          <strong>
            {name} {userType}
          </strong>{" "}
          님
        </p>
      </div>
      <Link to="/">
        <img
          className={`${styles2.main_logo_nav} ${styles2.nav_item}`}
          src={logo2}
          alt="메인로고"
        />
      </Link>

      <div
        className={`${styles2.nav_item} ${styles2.nav_item_left} ${styles2.button_box}`}
      >
        <Link
          to={{
            pathname: `/EditUserInfo/:${userID}`,
            userType: ` ${userType}`,
            userName: `${name}`,
            userID: `${userID}`,
          }}
        >
          <button className={`${styles2.button} ${styles2.mdfy_info}`}>
            정보수정
          </button>
        </Link>
        <Link
          to={{
            pathname: "/user",
          }}
        >
          <button className={styles2.button}>회원관리</button>
        </Link>

        <Link to="/">
          <button className={styles2.button}>태스크관리</button>
        </Link>
        <Link to="/">
          <button
            className={styles2.button}
            onClick={() => {
              localStorage.clear();
            }}
          >
            로그아웃
          </button>
        </Link>
      </div>
    </nav>
  );
};
