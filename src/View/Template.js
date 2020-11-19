import React from "react";
import { Nav } from "../Components/Nav";
import styles from "../CSS/template.module.css";

export const Template = () => {
  return (
    <div className={styles.main_container}>
      <Nav />
      {/* 여기에 페이지 별로 추가하면 됩니다. */}
      <h1>Hello World</h1>
    </div>
  );
};

/* 여기다가 수정하지 마시고 Template.js랑 Template.css 복사해서 이름 바꿔서 사용하세요. */
