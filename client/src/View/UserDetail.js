import React, { useState, useEffect } from "react";
import styles from "../CSS/mainstyle.module.css";

import { UDE } from "../Components/classes";
import { UDS } from "../Components/classes";
import { AdminNav } from "../Components/AdminNav";
import { UserDetailEstimatorNav } from "../Components/UserDetailEstimatorNav";
import { UserDetailEstimator } from "../Components/UserDetailEstimator";
import { useHistory, Link } from "react-router-dom";
import { UserDetailSubmitterNav } from "../Components/UserDetailSubmitterNav";
import { UserDetailSubmitter } from "../Components/UserDetailSubmitter";
import { Loading } from "../Components/Loading";

const UserDetail = (props) => {
  const user = props.location.user;
  const taskID = props.location.taskID;
  const newProps = props.location.newProps;
  const axios = require("axios").default;
  const [udeList, setUdeList] = useState([]);
  const [udsList, setUdsList] = useState([]);
  const [mainData, setMainData] = useState();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);

  var logInfo;
  var history = useHistory();
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  } else {
    history.push("/");
  }

  useEffect(() => {
    const fetchMain = async () => {
      await axios
        .get(`/api/UserDetail/main/${user.type}/${user.accountID}`)
        .then((res) => {
          setMainData(res.data[0]);
          console.log(mainData);
        });
    };
    const fetchContent = async () => {
      await axios
        .get(`/api/UserDetail/content/${user.type}/${user.accountID}`)
        .then((res) => {
          console.log(res);
          setContent(res.data);
        });
    };
    fetchMain();
    fetchContent();
  }, []);

  useEffect(() => {
    if (!mainData) return;
    if (!content) return;
    if (user.type === "평가자") {
      var list = [];
      for (var i = 0; i < content.length; i++) {
        list.push(
          new UDE(
            content[i].ID,
            content[i].totalTup,
            content[i].dupTup,
            content[i].nullRatio,
            content[i].directory,
            content[i].score
          )
        );
      }
      setUdeList(list);
    }

    if (user.type === "제출자") {
      var list = [];
      for(var i=0; i< content.length; i++) {
        list.push(
          new UDS(
            content[i].name,
            content[i].totalSub,
            content[i].avgTup,
            content[i].avgDup,
            content[i].avgNullRatio,
            content[i].saveTup,
            10,
            true
          )
        );
      }
      setUdsList(list);
    }

    setLoading(false);
  }, [mainData, content]);

  return (
    <div>
      <div>
        <AdminNav
          userType={logInfo.userType}
          name={logInfo.name}
          userID={logInfo.userID}
        />
        {loading && <Loading />}
        <div className={styles.center_all}>
          {!loading && (
            <div className={styles.main_container}>
              {user.type === "제출자" && (
                <div className={styles.mc}>
                  <div className={styles.etr}>
                    <div>
                      <h2>이름</h2>
                      <p>{user.name}</p>
                    </div>
                    <div>
                      <h2>참여태스크수</h2>
                      <p>{mainData.Part_Num}</p>
                    </div>
                    <div>
                      <h2>총제출수</h2>
                      <p>{mainData.Total_Sub}</p>
                    </div>
                    <div>
                      <h2>점수</h2>
                      <p>{mainData.Score}</p>
                    </div>
                  </div>
                  <div className={styles.ec}>
                    <UserDetailSubmitterNav />
                    <div
                      className={styles.scrollable_div}
                      style={{ height: "300px" }}
                    >
                      {udsList.map((item) => {
                        return (
                          <UserDetailSubmitter top={item.task} uds={item} />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {user.type === "평가자" && (
                <div className={styles.mc}>
                  <div className={styles.etr}>
                    <div>
                      <h2>이름</h2>
                      <p>{mainData.Name}</p>
                    </div>
                    <div>
                      <h2>총 평가파일 수</h2>
                      <p>{mainData.Total_File}</p>
                    </div>
                    <div>
                      <h2>평가 대기파일 수</h2>
                      <p>{mainData.Total_Queue}</p>
                    </div>
                  </div>
                  <div className={styles.ec}>
                    <UserDetailEstimatorNav />
                    <div
                      className={styles.scrollable_div}
                      style={{ height: "300px" }}
                    >
                      {udeList.map((item) => {
                        return <UserDetailEstimator ude={item} />;
                      })}
                    </div>
                  </div>
                </div>
              )}
              {newProps && (
                <Link
                  to={{
                    pathname: `/TaskView/${taskID}`,
                    task: newProps.location.task,
                  }}
                >
                  <button className={styles.add_btn} style={{ margin: "10px" }}>
                    닫기
                  </button>
                </Link>
              )}
              {!newProps && (
                <Link
                  to={{
                    pathname: "/user",
                  }}
                >
                  <button className={styles.add_btn} style={{ margin: "10px" }}>
                    닫기
                  </button>
                </Link>
              )}
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
