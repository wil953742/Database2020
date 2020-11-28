import React from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";

export const Schema = () => {
  return (
    <div>
      <TextField
        id="name"
        label="속성 이름"
        placeholder="속성 이름을 입력하시오."
      />
      <TextField
        id="type"
        label="속성 타입"
        placeholder="속성 타입을 입력하시오."
      />
    </div>
  );
};
