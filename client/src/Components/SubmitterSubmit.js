import React, { useState, Component, useEffect } from "react";
import styles from "../CSS/component.module.css";
import CloseIcon from "@material-ui/icons/Close";
import { colors, IconButton } from "@material-ui/core";
import { parse } from "papaparse";
import { useHistory } from "react-router-dom";

import Select from "react-select";
import { Pair } from "./classes";

export const SubmitterSubmit = ({ taskName, taskDesc, setTogglePopUp }) => {
    const [RDTtypes, setRDTtypes] = useState();
    const [RDTID, setRDT] = useState();
    const [highlighted, setHighlighted] = React.useState(false);

    const axios = require("axios").default;
    // const parse = require('csv-parse');

    const [file, setFile] = useState([]);

    //
    const [trmap, setTRMap] = useState();
    const [trmaplist, setTRMaplist] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await axios.get(`/api/RDTtypes/${taskName}`).then((res) => {
                setRDTtypes(res.data);
            });
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (!trmap) return;
        var trmaplist = [];
        for (let i = 0; i < trmaplist.length; i++) {
            trmaplist.push(
                new RPair(
                    trmaplist[i].name,
                    trmaplist[i].type,
                    trmaplist[i].map
                )
            );
        }
        setTRMaplist(trmaplist);
    }, [trmap]);
    //console.log(RDTtypes);
    const Upload = async () => {
        console.log(RDTID);
        // process uploading
        //

        // console.log(trmaplist);
        //console.log(RDTID);
        //      //
        console.log(file);

        //
        // console.log(obj[8]);

        //console.log(trmaplist.length);
        /**/

        await axios
            .post("/api/file", {
                file: file,
            })
            .then(function (response) {
                //console.log(response);
            })
            .catch(function (error) {
                //console.log(error);
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

        setTogglePopUp(false);
        //console.log(file);
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
                    highlighted
                        ? `${styles.border_blue}`
                        : `${styles.border_black}`
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
                    // console.log(file);
                    Array.from(e.dataTransfer.files)
                        // .filter((file) => file.type === 'text/csv')
                        .forEach(async (file) => {
                            const text = await file.text();
                            const result = parse(text, { header: true });
                            // console.log(text);
                            // console.log(result);
                            //console.log(result.data);
                            setFile((existing) => [
                                ...existing,
                                ...result.data,
                            ]);
                        });
                }}
            >
                제출할 파일을 끌어다 놓으시오.
            </div>

            <div className={styles.info}>
                <h3>Row Data Type</h3>

                <Select
                    options={RDTtypes}
                    placeholder="Raw Data Type을 선택하시오."
                    className={styles.select_rdt}
                    isSearchable
                    // onChange={(e) => console.log(e)}
                    onChange={(e) => setRDT(e.value)}
                />
            </div>

            <button className={styles.complete_btn} onClick={() => Upload()}>
                제출
            </button>
        </div>
    );
};
