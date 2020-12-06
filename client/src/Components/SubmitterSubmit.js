import React, { useState, Component, useEffect } from "react";
import styles from "../CSS/component.module.css";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import { colors, IconButton } from "@material-ui/core";
import { parse } from "papaparse";
import { RPair } from "../Components/classes";
import Select from "react-select";

export const SubmitterSubmit = ({ taskName, taskDesc, setTogglePopUp }) => {
  var logInfo;
  var history = useHistory();
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
    logInfo = JSON.parse(loggedIn);
  } else {
    history.push("/");
  }

  const [RDTtypes, setRDTtypes] = useState();
  const [RDTID, setRDT] = useState();
  const [highlighted, setHighlighted] = React.useState(false);
  const [file, setFile] = useState([]);
  const [LastRDSFID, setLastRDSFID] = useState([]);
  const [RDSFID, setRDSFID] = useState();
  const axios = require("axios").default;
  const [uploadState, setUploadState] = useState(
    "제출할 파일을 끌어다 놓으시오."
  );
  var lst = [];
  //
  const [trmap, setTRMap] = useState();
  const [trmaplist, setTRMaplist] = useState([]);

  const [pdsfID, setPDSFID] = useState();
  const [qtestID, setQTESTID] = useState([]);

  var aID = logInfo.accountID;
  var pID;
  var qID;
  //console.log(aID);

  useEffect(() => {
    async function fetchData() {
      await axios.get(`/api/RDTtypes/${taskName}`).then((res) => {
        setRDTtypes(res.data);
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      await axios.get(`/api/getLastRDSFID/${logInfo.accountID}`).then((res) => {
        setLastRDSFID(res.data);
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    for (let i = 0; i < LastRDSFID.length; i++) {
      if (LastRDSFID[i].LastRDSFID == null) {
        setRDSFID(1);
      } else {
        setRDSFID(LastRDSFID[i].LastRDSFID + 1);
      }
    }
  }, [LastRDSFID]);

  useEffect(() => {
    if (!trmap) return;
    var trmaplist = [];
    for (let i = 0; i < trmaplist.length; i++) {
      trmaplist.push(
        new RPair(trmaplist[i].name, trmaplist[i].type, trmaplist[i].map)
      );
    }
    setTRMaplist(trmaplist);
  }, [trmap]);

  const Upload = async () => {
    // process uploading

    console.log(RDTID);
    console.log(RDSFID);

    await axios
      .post(
        `/api/file/SubmitterID_${logInfo.accountID}/${taskName}/RDTID_${RDTID}`,
        {
          SubmitterID: logInfo.accountID,
          TaskName: taskName,
          RDTID: RDTID,
          RDSFID: RDSFID,
          file: file,
        }
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    await axios.get(`/api/TRMap/${RDTID}`).then((res) => {
      setTRMap(res.data);
      var obj = JSON.parse(JSON.stringify(res.data));
      console.log(obj[0].Pair);
      var obj1 = JSON.parse(obj[0].Pair);
      var obj2 = JSON.parse(obj[0].RPair);
      console.log(obj1);
      console.log(obj2);
      for (let i = 0; i < obj1.length; i++) {
        if (obj2[i].constructor != Object) {
          var n = obj1[1].name;
          console.log(obj1[i].name);
          for (let j = 0; j < file.length; j++) {
            delete file[i].n;
          }
        }
      }
      console.log(file);
    });
    /*
     */

    //        var obj = JSON.parse(trmap);

    /*
  var logInfo;
  var history = useHistory();
  const loggedIn = localStorage.getItem("user");
  if (loggedIn) {
      logInfo = JSON.parse(loggedIn);
  } else {
      history.push("/");
  }
  await axios
      .post("/api/file/rdsf", {
          SubmitterID: logInfo.accountID,
          RawDataType: rdt,
      })
      .then(function (response) {
          //console.log(response);
      })
      .catch(function (error) {
          //console.log(error);
      });
      */
    //rdsf.query->parsing->pdsf.query->    upload->assigning->assign.query->qt.query
    //submitterid_taskid_rawdatatypeid

    await axios
      .post("/api/parse/" + `${RDSFID}`)
      .then(function (response) {
        //console.log(response);
      })
      .catch(function (error) {
        //console.log(error);
      });

    ///////////////12.06.0700

    await axios.get(`/api/getPDSFID/` + `${RDSFID}`).then((res) => {
      console.log(RDSFID);
      console.log(res.data[0].PDSFID);

      setPDSFID(res.data[0].PDSFID);
      pID = res.data[0].PDSFID;
    });
    console.log(pID);
    await axios
      .post("/api/addQT/" + `${pID}`)
      .then(function (response) {
        //console.log(response);
      })
      .catch(function (error) {
        //console.log(error);
      });

    await axios.get(`/api/getQTESTID/` + `${pID}`).then((res) => {
      console.log(res.data);
      setQTESTID(res.data.TestID);
      qID = res.data[0].TestID;
    });

    await axios
      .post("/api/assign/" + `${pID}/${qID}`, {})
      .then(function (response) {
        //console.log(response);
      })
      .catch(function (error) {
        //console.log(error);
      });

    setTogglePopUp(false);
  };

  return (
    <div className={styles.popup_sub}>
      <IconButton
        className={styles.close_btn}
        style={{ position: "absolute" }}
        onClick={() => setTogglePopUp(false)}
      >
        <CloseIcon fontSize="large" />
      </IconButton>
      <div className={styles.info}>
        <h3>태스크 이름</h3>
        <p>{taskName}</p>
      </div>
      <div className={styles.info}>
        <h3>태스크 정보</h3>
        <p>{taskDesc}</p>
      </div>

      <h3>파일 업로드</h3>
      <div
        className={`${styles.file_input} ${
          highlighted ? `${styles.border_blue}` : `${styles.border_black}`
        }`}
        onDragEnter={() => {
          setHighlighted(true);
        }}
        onDragLeave={() => {
          setHighlighted(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          setHighlighted(false);
          setUploadState("제출되었습니다.");
          Array.from(e.dataTransfer.files)
            .filter((file) => file.type === "text/csv")
            .forEach(async (file) => {
              const text = await file.text();
              const result = parse(text, { header: true });
              console.log(result);
              setFile((existing) => [...existing, ...result.data]);
            });
        }}
      >
        {uploadState}
      </div>

      <div className={styles.info}>
        <h3>Raw Data Type</h3>

        <Select
          options={RDTtypes}
          placeholder="Raw Data Type을 선택하시오."
          className={styles.select_rdt}
          isSearchable
          // onChange = {e => console.log(e)}
          onChange={(e) => setRDT(e.value)}
        ></Select>
      </div>

      <button className={styles.complete_btn} onClick={() => Upload()}>
        제출
      </button>
    </div>
  );
};
