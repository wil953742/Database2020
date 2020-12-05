import React, { useState, Component } from "react";
import styles from "../CSS/component.module.css";
import CloseIcon from "@material-ui/icons/Close";
import { colors, IconButton } from "@material-ui/core";
import { parse } from 'papaparse';

import Select from 'react-select';

export const SubmitterSubmit = ({
  taskName,
  taskDesc,
  setTogglePopUp,
}) => {
  const RDTtypes = [
    { value : "type1", label : "type1"},
    { value : "type2", label : "type2"},
    { value : "type3", label : "type3"},
  ];

  const [highlighted, setHighlighted] = React.useState(false);
  const [ RDT, setRDT] = useState();

  var lst = [];
  const axios = require('axios').default;
  // const parse = require('csv-parse');

  const [file, setFile] = useState([]);
  
  const Upload = async () => {
    // process uploading
    console.log(RDTtypes);
    await axios.post('/api/file', {
      file : file
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error)  {
      console.log(error);
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
      <div className={`${styles.file_input} ${
        highlighted ? `${styles.border_blue}` : `${styles.border_black}`}`}
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

          Array.from(e.dataTransfer.files)
            .filter((file) => file.type === 'text/csv') 
            .forEach(async (file) => {
              const text = await file.text();
              const result = parse(text, { header : true});            
              console.log(result);
              setFile((existing) => [...existing, ...result.data]);
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
          className = {styles.select_rdt}
          isSearchable

          onChange = {e => console.log(e)}>
          
          </Select>
        
      </div>
        
      <button className={styles.complete_btn} onClick={() => Upload()}>
        제출
      </button>
    </div>
  );
};
