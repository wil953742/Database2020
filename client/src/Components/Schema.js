import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

export const Schema = ({ pair, raw, tdt }) => {
  console.log(pair);
  console.log(raw);
  console.log(tdt);
  const dataType = [
    "bit",
    "tinyint",
    "smallint",
    "int",
    "bigint",
    "decimal",
    "numeric",
    "float",
    "real",
    "date",
    "time",
    "datetime",
    "timestamp",
    "year",
    "char",
    "varchar",
    "text",
    "nchar",
    "nvarchar",
    "ntext",
    "binary",
    "varbinary",
    "image",
    "clob",
    "bclob",
    "xml",
    "json",
  ];
  const maxList = ["varbinary", "nvarchar", "varchar"];
  const [toggleMax, setToggleMax] = useState(false);
  const [type, setType] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [map, setMap] = useState("");
  const [name, setName] = useState("");

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <TextField
          style={{ minWidth: "200px", marginRight: "10px" }}
          id="name"
          label="속성 이름"
          placeholder="속성 이름을 입력하시오."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            pair.name = e.target.value;
          }}
        />
      </div>
      <div>
        <FormControl style={{ minWidth: "200px", marginRight: "10px" }}>
          <InputLabel>속성타입</InputLabel>
          <Select
            id="type"
            value={type}
            onChange={(e) => {
              if (maxList.includes(e.target.value)) {
                setToggleMax(true);
              } else {
                setToggleMax(false);
              }
              setType(e.target.value);
              pair.type = e.target.value;
            }}
          >
            {dataType.map((type) => {
              return <MenuItem value={type}>{type}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </div>
      {toggleMax && (
        <div>
          <TextField
            style={{ minWidth: "200px", marginRight: "10px" }}
            id="name"
            type="number"
            label="Max Length"
            placeholder="기본값=20"
            value={maxLength}
            onChange={(e) => {
              if (e.target.value > 65535 || e.target.value < 1) {
                setMaxLength(20);
                pair.maxLength = 20;
              } else {
                setMaxLength(e.target.value);
                pair.maxLength = e.target.value;
              }
            }}
          />
        </div>
      )}
      {raw && (
        <FormControl style={{ minWidth: "200px" }}>
          <InputLabel>매핑속성</InputLabel>
          <Select
            id="type"
            value={map}
            onChange={(e) => {
              setMap(e.target.value);
              if (e.target.value) {
                if (e.target.value.maxLength) {
                  setToggleMax(true);
                } else {
                  setToggleMax(false);
                }
                setMaxLength(e.target.value.maxLength);
                setType(e.target.value.type);
                pair.map = e.target.value.name;
                pair.maxLength = e.target.value.maxLength;
                pair.type = e.target.value.type;
              } else {
                pair.map = null;
              }
            }}
          >
            <MenuItem value={null}>null</MenuItem>
            {tdt.map((pair) => {
              return <MenuItem value={pair}>{pair.name}</MenuItem>;
            })}
          </Select>
        </FormControl>
      )}
    </div>
  );
};
