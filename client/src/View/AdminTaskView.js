import React, { useEffect, useState } from "react";
import styles from "../CSS/mainstyle.module.css";
import { useHistory, Link } from "react-router-dom";
import { TaskUser } from "../Components/classes";

import { AdminParticipantRowNav } from "../Components/AdminParticipantRowNav";
import { AdminParticipantRow } from "../Components/AdminParticipantRow";
import { AdminNav } from "../Components/AdminNav";
import { Loading } from "../Components/Loading";

const AdminTaskView = (props) => {
  const task = props.location.task;
  const axios = require("axios").default;
  const url = `/api/userQueue/${task.taskID}`;
  const [userList, setUserList] = useState([]);
  const [userData, setUserData] = useState();
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState(true);

  var logInfo;
  var history = useHistory();
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  } else {
    history.push("/");
  }

  useEffect(() => {
    async function fetchUserData() {
      await axios
        .get(url)
        .then((res) => {
          setUserData(res.data);
        })
        .catch((err) => console.log(err));
    }
    fetchUserData();
  }, [reload, props]);

  useEffect(() => {
    if (!userData) return;
    setLoading(false);
    if (userData.length === 0) return;
    var list = [];
    for (let i = 0; i < userData.length; i++) {
      var app;
      if (!userData[i].Approval) {
        app = null;
      } else {
        app = userData[i].Approval.data;
      }
      list.push(
        new TaskUser(
          userData[i].AccountID,
          userData[i].Name,
          userData[i].Role === "Submitter" ? "제출자" : "평가자",
          userData[i].Gender.data == 0 ? "남자" : "여자",
          userData[i].BirthDate.slice(0, 10),
          userData[i].Score,
          app
        )
      );
    }
    setUserList(list);
    setLoading(false);
  }, [userData]);

  return (
    <div>
      <AdminNav
        userType={"관리자"}
        name={logInfo.name}
        userID={logInfo.userID}
      />
      <div className={styles.center_all}>
        <div className={styles.main_container}>
          <div className={styles.sub_container_a}>
            <div className={styles.row_container}>
              <div>
                <h2>태스크 이름</h2>
                <p>{task.name}</p>
              </div>
              <div>
                <h2>설명</h2>
                <p>{task.desc}</p>
              </div>
            </div>
            <div className={styles.row_container}>
              <div>
                <h2>제출 주기</h2>
                <p>{task.period}</p>
              </div>
              <div>
                <h2>패스 기준</h2>
                <p>7</p>
              </div>
            </div>
            <div className={styles.row_container}>
              <div>
                <h2>총 제출 수</h2>
                <div className={styles.scrollable_div}>
                  <table>
                    <tr>
                      <th>원본타입이름</th>
                      <th>제출 수</th>
                    </tr>
                    <tr>
                      <td>원본타입1</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>원본타입2</td>
                      <td>90</td>
                    </tr>
                    <tr>
                      <td>총</td>
                      <td>100</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div>
                <h2>저장된 튜플 수</h2>
                <div className={styles.scrollable_div}>
                  <table>
                    <tr>
                      <th>원본타입이름</th>
                      <th>저장 수</th>
                    </tr>
                    <tr>
                      <td>원본타입1</td>
                      <td>10</td>
                    </tr>
                    <tr>
                      <td>원본타입2</td>
                      <td>90</td>
                    </tr>
                    <tr>
                      <td>총</td>
                      <td>100</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div className={styles.button_container}>
              <button className={`${styles.add_btn} ${styles.button_row}`}>
                다운로드
              </button>
              <button
                className={`${styles.add_btn} ${styles.button_row}`}
                onClick={() => history.push("/")}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
        <div className={styles.main_container}>
          <div className={styles.sub_container_b}>
          {loading && <Loading />}
            {!loading && (
              <div>
                <AdminParticipantRowNav />
                <div
                  className={styles.scrollable_div}
                  style={{ height: "100px" }}
                >
                {userList.map((user) => (
                    <Link
                      to={{
                        pathname: `/UserDetail/${user.AccountID}`,
                        user: user,
                        taskID: task.taskID,
                        newProps: props,
                      }}
                    >
                      <AdminParticipantRow
                        key={user.AccountID}
                        user={user}
                        taskID={task.taskID}
                        setReload={setReload}
                        reload={reload}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}  
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTaskView;
