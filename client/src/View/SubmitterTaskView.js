import React, { useState,useEffect} from "react";
import styles from "../CSS/mainstyle.module.css";
import { useHistory } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import { fileTask, PNP } from "../Components/classes";


import { SubmitterTaskRowNav } from "../Components/SubmitterTaskRowNav";
import { SubmitterTaskRow } from "../Components/SubmitterTaskRow";
import { SubmitterSubmit } from "../Components/SubmitterSubmit";
import { Nav } from "../Components/Nav";

export const SubmitterTaskView = ({task , loginfo}) => {
  
  var logInfo;
  var history = useHistory();
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  } else {
    history.push("/");
  }

  let location = useLocation();
  let tid = location.pathname.split('/')[2];

  const axios = require("axios").default;
  const [data, setData] = useState();
  const [taskList, setTaskList] = useState([]);

  const [togglePopUp, setTogglePopUp] = useState(false);
  const Submit = () => {
    // Get Information About Chosen Task
    setTogglePopUp(true);
  };
  
  const url = "/api/submittedTasklist/";
  const url2 = url+'4/'+`${logInfo.accountID}/${tid}`;
  //console.log(url2);
  useEffect(() => {
    async function fetchData() {
      await axios.get(url+'4/'+`${logInfo.accountID}/${tid}`).then((res) => {
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
        new fileTask(
          data[i].fileName,
          data[i].fileScore,
          data[i].fileType,
          data[i].fileDate,
          data[i].filePNP
            
          )
      );
    }
    setTaskList(list);
    console.log(data);  

  }, [data]);



  

  return (
    <div className={styles.center_all}>
      <Nav
        userType={"제출자"}
        name={logInfo.name}
        userID={logInfo.userID}
      />
      <h2 className={styles.list_title}>파일 목록</h2>
      <div className={styles.main_container}>
        <div className={styles.sub_container_1}>
          <SubmitterTaskRowNav />
          <div className={styles.scrollable_div}>
          {taskList.map((task) => (
            <SubmitterTaskRow task={task} loginfo={loginfo}

            />
          ))}
          </div>
        </div>
      </div>
      <button className={styles.add_btn} onClick={() => Submit()}>
            제출하기
      </button>
      {togglePopUp && (
      <SubmitterSubmit
        setTogglePopUp={setTogglePopUp}
        //taskID={taskID}
        //taskDesc={taskDesc}
      />)
      }
    </div>
  );
};
