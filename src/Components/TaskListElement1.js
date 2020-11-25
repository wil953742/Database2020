import React from "react";
import styles4 from "../CSS/TaskListElement1Style.module.css";

export const TaskListElement1 = () => {
  let taskName = "Task Name";  
  let taskDesc = "Task Description";
  let taskSubDate = "20/11/25";
  let taskFileNum = "3";

  return (
    <div className={styles4.container}>
      <div className={`${styles4.task_name} ${styles4.task_list}`}>{taskName}</div>
      <div className={`${styles4.task_desc} ${styles4.task_list}`}>{taskDesc}</div>
      <div className={`${styles4.task_sub_date} ${styles4.task_list}`}>{taskSubDate}</div>
      <div className={`${styles4.task_file_num} ${styles4.task_list}`}>{taskFileNum}</div>
    </div>
  );
};




