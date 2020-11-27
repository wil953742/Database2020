import React, {useState, useEffect } from "react";
import styles from "../CSS/mainstyle.module.css";

import { SubmitterTopRow1 } from "../Components/SubmitterTopRow1";
import { SubmitterTopRow2 } from "../Components/SubmitterTopRow2";
import { SubmitterJoined } from "../Components/SubmitterJoined";
import { SubmitterNew } from "../Components/SubmitterNew";
import { SubmitterWaiting } from "../Components/SubmitterWaiting";
import { response } from "express";


export const SubmitterMain = () => {
  var Joined = [];
  var New = [];
  var Waiting = [];

  const LoadTasks = (Joined, New, Waiting) => {
    // function to initially load tasks to lists;
  };
/*
  const [taskID, setTaskID] = useState([])
  const [taskName, setTaskName] = useState([])
  const [taskDesc, setTaskDesc] = useState([])
  const [taskDate, setTaskDate] = useState([])
  const [taskNum, setTaskNum] = useState([])

  useEffect(()=>{
    fetch('/s_task')
    .then((response) => response.json())
    .then((users) => {
      setUsers(users)
      setLoading(false)
    })
  })*/

  return (
    <div className={styles.center_all}>
      <h2 className={styles.list_title}>태스크 현황</h2>
      <div className={styles.main_container}>
        <div className={styles.sub_container_2}>
          <SubmitterTopRow1 />
          <div className={styles.scrollable_div}>
            <SubmitterJoined
             /* taskID={s.taskID}
              taskName={s.taskID}
              taskDesc={s.taskDesc}
              taskDate={s.taskDate}
              taskNum={s.taskName}*/
            />
          </div>
        </div>
        <div className={styles.sub_container_2} style={{ marginTop: 0 }}>
          <SubmitterTopRow2/>
          <div className={styles.scrollable_div}>
            <SubmitterNew
              taskName="태스크2"
              taskDesc="코로나 확진자 중 외국인 데이터"
            />
          </div>
        </div>
        <div className={styles.sub_container_2} style={{ marginTop: 0 }}>
          <SubmitterTopRow2/>
          <div className={styles.scrollable_div}>
            <SubmitterWaiting
              taskName="태스크3"
              taskDesc="코로나 확진자 다른 데이터"
            />
          </div>
        </div>
      

      </div>
    </div>
  );
};

            
            