import React from "react";
import TextField from "@material-ui/core/TextField";

export const Schema = ({ pair }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <TextField
        id="name"
        label="속성 이름"
        placeholder="속성 이름을 입력하시오."
        value={pair.name}
        onChange={(e) => (pair.name = e.target.value)}
      />
      <TextField
        id="type"
        label="속성 타입"
        placeholder="속성 타입을 입력하시오."
        value={pair.type}
        onChange={(e) => (pair.type = e.target.value)}
      />
    </div>
  );
};
