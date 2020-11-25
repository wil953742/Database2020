import React from "react";
import styles5 from "../CSS/TaskListElement2Style.module.css";

export const TaskListElement2 = () => {
  let taskName = "Task Name";  
  let taskDesc = "Task Description";

  return (
    <div className={styles5.container}>
      <div className={`${styles5.task_name} ${styles5.task_list}`}>{taskName}</div>
      <div className={`${styles5.task_desc} ${styles5.task_list}`}>{taskDesc}</div>
      <div className={`${styles5.apply_button} ${styles5.task_list}`}>
        <button className={styles5.button_detail}>참여신청</button></div>
    </div>
  );
};




