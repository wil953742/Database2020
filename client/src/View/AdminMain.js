import React from "react";
import { Link } from "react-router-dom";
import styles from "../CSS/mainstyle.module.css";
import { AdminTask } from "../Components/classes";

import { AdminTaskRowNav } from "../Components/AdminTaskRowNav";
import { AdminTaskRow } from "../Components/AdminTaskRow";

export const AdminMain = () => {
  const testTask = new AdminTask(1, "임시 이름", "임시 설명...", 1, 1, 10, 6);

  var taskList = [];
  taskList.push(testTask);
  taskList.push(testTask);
  taskList.push(testTask);

  return (
    <div className={styles.center_all}>
      <h2 className={styles.list_title}>태스크 목록</h2>
      <div className={styles.main_container}>
        <div className={styles.sub_container_1}>
          <AdminTaskRowNav />
          <div className={styles.scrollable_div}>
            {taskList.map((task) => (
              <AdminTaskRow task={task} />
            ))}{" "}
          </div>
        </div>
      </div>
      <Link to={{ pathname: "/NewTask" }}>
        <button className={styles.add_btn}>태스크 추가</button>
      </Link>
    </div>
  );
};
