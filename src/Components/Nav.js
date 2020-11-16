import React from "react";
import styles2 from "../CSS/homestyle.module.css";

import account_logo from "../Images/계정로고.png";
import logo2 from "../Images/로고2.png";

export const Nav = () => {
  return (
    <nav className={styles2.nav}>
      <div className={`${styles2.nav_item} ${styles2.nav_item_right}`}>
        <img
          className={styles2.account_logo_nav}
          src={account_logo}
          alt="계정로고"
        />
        <p className={styles2.nav_p}>
          <strong>관리자</strong> 계정
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
        <button className={styles2.button}>버튼2</button>
        <button className={styles2.button}>버튼1</button>
      </div>
    </nav>
  );
};
