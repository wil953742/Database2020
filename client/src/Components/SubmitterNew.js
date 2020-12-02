import React, { useState } from "react";
import styles from "../CSS/component.module.css";
import { Link } from "react-router-dom";

export const SubmitterNew =  ({task })  => {
  const Apply = () => {
    
  };

  return (
    <div>
      <div className={styles.row_container}>
        <p>{task.taskName}</p>
        <p>{task.taskDesc}</p>
        <div>
          <button className={styles.row_button} onClick={() => Apply()}>
            참여신청
          </button>
        </div>
      </div>
    </div>
  );
};
