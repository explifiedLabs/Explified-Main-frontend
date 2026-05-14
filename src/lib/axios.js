import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://authapi-pf6diz22ka-uc.a.run.app/api",
  withCredentials: true,
});

export default axiosInstance;
