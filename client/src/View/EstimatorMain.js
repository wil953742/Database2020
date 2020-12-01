import React, { useEffect, useState } from "react";
import styles from "../CSS/mainstyle.module.css";
import { Record } from "../Components/classes";
import { QT } from "../Components/classes";

import { EstimatorTopRow } from "../Components/EstimatorTopRow";
import { EstimateUnfinished } from "../Components/EstimateUnfinished";
import { EstimateFinished } from "../Components/EstimateFinished";
import Axios from "axios";

export const EstimatorMain = ({ loginfo }) => {
  // const testRecord = new Record(
  //   1,
  //   "임시이름",
  //   "임시 타입",
  //   "둘리",
  //   1,
  //   new QT(100, 10, 0.4),
  //   null,
  //   "/"
  // );
  

  // var unfinished = [];
  // var finished = [];
  // unfinished.push(testRecord);
  // unfinished.push(testRecord);
  // unfinished.push(testRecord);
  // finished.push(testRecord);
  // finished.push(testRecord);
  // finished.push(testRecord);

  const LoadTasks = (unfinished, finished) => {
    /*  function to initially load tasks to lists
        userID is in "loginfo.userID"
    */
    
  };

  var loginfo;
  var accountID = loginfo.accountID;
  const axios = require("axios").default;
  
  const [unfinishedRecord, setUnfinishedRecord] = useState();
  const [finishedRecord, setFinishedRecord] = useState();
  const [unfinished, setUnfinishedList] = useState([]);
  const [finished, setFinishedList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await axios.get(`/api/Estimator/${accountID}/notYet`).then((res) => {
        setUnfinishedRecord(res.data);
      });
      
      await axios.get(`/api/Estimator/${accountID}/finished`).then((res) => {
        setFinishedRecord(res.data);
      });
    }
    fetchData();
  }, []);
  
  console.log(unfinishedRecord);
  console.log(finishedRecord); 

  useEffect(() => {
    if (!unfinishedRecord) return;
    var unfinished = [];
    for (var i = 0; i < unfinishedRecord.length; i++){
      unfinished.push(
        new Record(
          unfinishedRecord[i].ParsingDataSequenceFileID ,
          unfinishedRecord[i].CollectedTaskID,
          unfinishedRecord[i].BelongsRawDataTypeID,
          unfinishedRecord[i].RDSFSubmitterID,
          unfinishedRecord[i].Turn,
          new QT(unfinishedRecord[i].TotalTupleNum, 
                 unfinishedRecord[i].DupTupleNum,
                 unfinishedRecord[i].NullRatio),
          unfinishedRecord[i].QualityScore,
          unfinishedRecord[i].Directory
        )
      );
    }
    setUnfinishedList(unfinished);

    if (!finishedRecord) return;
    var finished = [];
    for (var i = 0; i < finishedRecord.length; i++){
      finished.push(
        new Record(
          finishedRecord[i].ParsingDataSequenceFileID ,
          finishedRecord[i].CollectedTaskID,
          finishedRecord[i].BelongsRawDataTypeID,
          finishedRecord[i].RDSFSubmitterID,
          finishedRecord[i].Turn,
          new QT(finishedRecord[i].TotalTupleNum, 
                 finishedRecord[i].DupTupleNum,
                 finishedRecord[i].NullRatio),
          finishedRecord[i].QualityScore,
          finishedRecord[i].Directory
        )
      );
    }
    setFinishedList(finished);
  }, [unfinishedRecord, finishedRecord]);
  


  return (
    <div className={styles.center_all}>
      <h2 className={styles.list_title}>평가 현황</h2>
      <div className={styles.main_container}>
        <div className={styles.sub_container_2}>
          <EstimatorTopRow />
          <div className={styles.scrollable_div}>
            {unfinished.map((record) => (
              <EstimateUnfinished record={record} />
            ))}
          </div>
        </div>
        <div className={styles.sub_container_2} style={{ marginTop: 0 }}>
          <EstimatorTopRow />
          <div className={styles.scrollable_div}>
            {finished.map((record) => (
              <EstimateFinished record={record} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
