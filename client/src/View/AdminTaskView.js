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
  const [submissionData, setSubmissionData] = useState();
  const [submission, setSubmission] = useState();
  const [tupleData, setTupleData] = useState();
  const [tuple, setTuple] = useState();
  const [total1, setTotal1] = useState(0);
  const [total2, setTotal2] = useState(0);
  const [loading2, setLoading2] = useState(true);

  var logInfo;
  var history = useHistory();
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  } else {
    history.push("/");
  }

  function convertToCSV(objArray) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";

    for (var i = 0; i < array.length; i++) {
      var line = "";
      for (var index in array[i]) {
        if (line != "") line += ",";

        line += array[i][index];
      }

      str += line + "\r\n";
    }

    return str;
  }

  function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
      items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + ".csv" || "export.csv";

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  const downloadAll = async () => {
    await axios.get(`/api/DownloadTask/${task.taskID}`).then((res) => {
      if (res.data.length === 0) return;
      var header = new Object();
      var obj_list = [];
      var file_title = task.name;
      for (const [key, value] of Object.entries(res.data[0])) {
        header[key] = key;
      }
      for (var i = 0; i < res.data.length; i++) {
        obj_list.push(res.data[i]);
      }
      console.log(header);
      console.log(obj_list);
      exportCSVFile(header, obj_list, file_title);
    });
  };

  async function fetchUserData() {
    await axios
      .get(url)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => console.log(err));
  }

  async function fetchSubmissionData() {
    await axios
      .get(`/api/taskQueue/${task.taskID}`)
      .then((res) => {
        setSubmissionData(res.data);
      })
      .catch((err) => console.log(err));
  }

  async function fetchTupleData() {
    await axios.get(`/api/GetTuple/${task.taskID}`).then((res) => {
      setTupleData(res.data);
    });
  }

  useEffect(() => {
    fetchSubmissionData();
    fetchTupleData();
  }, []);

  useEffect(() => {
    if (!submissionData) return;
    if (submissionData.length === 0) return;
    console.log(submissionData);
    var list = [];
    var total = 0;
    for (let i = 0; i < submissionData.length; i++) {
      list.push(submissionData[i]);
      total += submissionData[i].totalSub;
    }
    setTotal1(total);
    setSubmission(list);

    if (!tupleData) return;
    if (tupleData.length === 0) return;
    var list2 = [];
    var total2 = 0;
    for (let i = 0; i < tupleData.length; i++) {
      list2.push(tupleData[i]);
      total2 += tupleData[i].totalSub;
    }
    setTotal2(total2);
    setTuple(list2);

    setLoading2(false);
  }, [submissionData, tupleData]);

  useEffect(() => {
    fetchUserData();
    fetchSubmissionData();
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
  }, [userData, submissionData]);

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
                  {!loading2 && (
                    <table>
                      <tr>
                        <th>원본타입이름</th>
                        <th>제출 수</th>
                      </tr>
                      {submission.map((item) => {
                        return (
                          <tr>
                            <td>{item.RDTName}</td>
                            <td>{item.totalSub}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td>총</td>
                        <td>{total1}</td>
                      </tr>
                    </table>
                  )}
                </div>
              </div>
              <div>
                <h2>저장된 튜플 수</h2>
                <div className={styles.scrollable_div}>
                  {!loading2 && (
                    <table>
                      <tr>
                        <th>원본타입이름</th>
                        <th>저장 수</th>
                      </tr>
                      {tuple.map((item) => {
                        return (
                          <tr>
                            <td>{item.RDTName}</td>
                            <td>{item.totalSub}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td>총</td>
                        <td>{total2}</td>
                      </tr>
                    </table>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.button_container}>
              <button
                className={`${styles.add_btn} ${styles.button_row}`}
                onClick={() => downloadAll()}
              >
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
