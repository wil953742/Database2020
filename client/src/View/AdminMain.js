import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../CSS/mainstyle.module.css";
import { AdminTask } from "../Components/classes";

import { AdminTaskRowNav } from "../Components/AdminTaskRowNav";
import { AdminTaskRow } from "../Components/AdminTaskRow";

export const AdminMain = () => {
  const axios = require("axios").default;
  const [data, setData] = useState();
  const [taskList, setTaskList] = useState([]);
  const url = "/api/adminTask";

  useEffect(() => {
    async function fetchData() {
      await axios.get(url).then((res) => {
        setData(res.data);
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;
    var list = [];
    for (let i = 0; i < data.length; i++) {
      list.push(
        new AdminTask(data[i].TaskID, data[i].Description, data[i].Period, 0)
      );
    }
    setTaskList(list);
    console.log(taskList);
  }, [data]);

  return (
    <div className={styles.center_all}>
      <h2 className={styles.list_title}>태스크 목록</h2>
      <div className={styles.main_container}>
        <div className={styles.sub_container_1}>
          <AdminTaskRowNav />
          <div className={styles.scrollable_div}>
            {taskList.map((task) => (
              <AdminTaskRow task={task} />
            ))}
          </div>
        </div>
      </div>
      <Link to={{ pathname: "/NewTask" }}>
        <button className={styles.add_btn}>태스크 추가</button>
      </Link>
    </div>
  );
};
