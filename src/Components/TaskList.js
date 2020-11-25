import React from "react";
import styles3 from "../CSS/TaskListStyle.module.css";
import {TaskListElement1} from "../Components/TaskListElement1";
import {TaskListElement2} from "../Components/TaskListElement2";

export const TaskList = () => {
  return (
    <div className={styles3.container}>
      <div className={styles3.task_list}>
        <TaskListElement1 />
        <TaskListElement2 /> 
      </div>
    </div>
  );
};
