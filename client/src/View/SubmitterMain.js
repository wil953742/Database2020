import React, { useState, useEffect } from "react";
import styles from "../CSS/mainstyle.module.css";
import { otherTask, SubmittedTask } from "../Components/classes";


import { SubmitterTopRow1 } from "../Components/SubmitterTopRow1";
import { SubmitterTopRow2 } from "../Components/SubmitterTopRow2";
import { SubmitterJoined } from "../Components/SubmitterJoined";
import { SubmitterNew } from "../Components/SubmitterNew";
import { SubmitterWaiting } from "../Components/SubmitterWaiting";



export const SubmitterMain = ({ loginfo }) => {
  var Joined = [];
  var New = [];
  var Waiting = [];

  const LoadTasks = (Joined, New, Waiting) => {
    // function to initially load tasks to lists;
  };

  //
  
  const axios = require("axios").default;
  const [data, setData] = useState();
  const [taskList, setTaskList] = useState([]);
  
  const [data2, setData2] = useState();
  const [taskList2, setTaskList2] = useState([]);

  const [data3, setData3] = useState();
  const [taskList3, setTaskList3] = useState([]);

 
  const url = "/api/submittedTasklist/";
  useEffect(() => {
    async function fetchData() {
      await axios.get(url+'1/'+`${loginfo.accountID}`).then((res) => {
        setData(res.data);
      });
      await axios.get(url+'2/'+`${loginfo.accountID}`).then((res) => {
        setData2(res.data);
      });
      await axios.get(url+'3/'+`${loginfo.accountID}`).then((res) => {
        setData3(res.data);
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;
    var taskList = [];
    for (let i = 0; i < data.length; i++) {
      taskList.push(
        new SubmittedTask(
          data[i].taskID,
          data[i].taskName,
          data[i].taskDesc,
          data[i].taskDate,
          data[i].taskNum
        )
      );
    }
    setTaskList(taskList);
    //console.log(data);

    if (!data2) return;
    var taskList2 = [];
    for (let i = 0; i < data2.length; i++) {
      taskList2.push(
        new otherTask(
          data2[i].taskID,
          data2[i].taskName,
          data2[i].taskDesc,

        )
      );
    }
    setTaskList2(taskList2);
    //console.log(data2);

    if (!data3) return;
    var taskList3 = [];
    for (let i = 0; i < data3.length; i++) {
      taskList3.push(
        new otherTask(
          data3[i].taskID,
          data3[i].taskName,
          data3[i].taskDesc,
  
        )
      );
    }
    setTaskList3(taskList3);
   // console.log(data3);


  }, [data,data2,data3]);

  

//

  return (
    <div className={styles.center_all}>
      <h2 className={styles.list_title}>태스크 현황</h2>
      <div className={styles.main_container}>
        <div className={styles.sub_container_2}>
          <SubmitterTopRow1 />
          <div className={styles.scrollable_div}>
          {taskList.map((task) => (
            
              <SubmitterJoined task={task}

              />
            ))}


            
          </div>
        </div>
        <div className={styles.sub_container_2} style={{ marginTop: 0 }}>
          <SubmitterTopRow2/>
          <div className={styles.scrollable_div}>
          {taskList2.map((task) => (
            <SubmitterNew task={task}
            />
            
           ))}

          </div>
        </div>
        <div className={styles.sub_container_2} style={{ marginTop: 0 }}>
          <SubmitterTopRow2/>
          <div className={styles.scrollable_div}>
          {taskList3.map((task) => (
            <SubmitterWaiting task={task}
            />
            
           ))}
          </div>
        </div>
      

      </div>
    </div>
  );
};

            
            