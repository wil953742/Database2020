import React from "react";
import styles4 from "../CSS/TaskListElement1Style.module.css";

export const TaskListElement1 = () => {
  let taskName = "Task Name";
  let taskDesc = "Task Description";
  let taskSubDate = "Last Submitted Task's Date";
  let taskFileNum = "The Number of Task Files";

  return (
    <div className={styles4.container}>
      <div className={styles4.task_name}>{taskName}</div>
      <div className={styles4.task_desc}>{taskDesc}</div>
      <div className={styles4.task_sub_date}>{taskSubDate}</div>
      <div className={styles4.task_file_num}>{taskFileNum}</div>
    </div>
  );
};
