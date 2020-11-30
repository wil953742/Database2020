import React from "react";
import styles from "../CSS/mainstyle.module.css";
import { useHistory } from "react-router-dom";

import { AdminParticipantRowNav } from "../Components/AdminParticipantRowNav";
import { AdminParticipantRow } from "../Components/AdminParticipantRow";
import { AdminNav } from "../Components/AdminNav";

const AdminTaskView = (props) => {
  const task = props.location.task;

  var admiteedUser = {
    name: "홍길동",
    sex: "M",
    birth: "970622",
    score: 8,
    admit: true,
  };
  var nonAdmitUser = {
    name: "홍길동",
    sex: "M",
    birth: "970622",
    score: 8,
    admit: false,
  };

  var logInfo;
  var history = useHistory();
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  } else {
    history.push("/");
  }
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
                <p>{task.taskName}</p>
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
            <AdminParticipantRowNav />
            <div className={styles.scrollable_div}>
              <AdminParticipantRow user={admiteedUser} />
              <AdminParticipantRow user={nonAdmitUser} />
              <AdminParticipantRow user={nonAdmitUser} />
              <AdminParticipantRow user={nonAdmitUser} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTaskView;
