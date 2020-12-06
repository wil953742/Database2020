import axios from "axios";

const instance = axios.create({
  baseURL: "http://165.132.105.46:3023",
  timeout: 3000,
});

export default instance;
