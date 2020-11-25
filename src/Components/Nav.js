import React from "react";
import styles2 from "../CSS/homestyle.module.css";
import { Link } from "react-router-dom";

import account_logo from "../Images/계정로고.png";
import logo2 from "../Images/로고2.png";

export const Nav = ({ userType, name }) => {
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

      <img
        className={`${styles2.main_logo_nav} ${styles2.nav_item}`}
        src={logo2}
        alt="메인로고"
      />

      <div
        className={`${styles2.nav_item} ${styles2.nav_item_left} ${styles2.button_box}`}
      >
        <button className={`${styles2.button} ${styles2.mdfy_info}`}>
          정보수정
        </button>
        {userType === "관리자" && (
          <Link
            to={{
              pathname: "/user",
              userType: "관리자",
              userNamae: `${name}`,
            }}
          >
            <button className={styles2.button}>회원관리</button>
          </Link>
        )}
        {userType === "관리자" && (
          <Link to="/">
            <button className={styles2.button}>태스크관리</button>
          </Link>
        )}
      </div>
    </nav>
  );
};
