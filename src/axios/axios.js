import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("Authorization") || ""; // Retrieve your access token from wherever it's stored
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return error && error.response && error.response.data
      ? error.response
      : Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.data.statusCode === 401) {
      localStorage.removeItem("Authorization");
      localStorage.removeItem("user");
    }
    return error && error.response && error.response.data
      ? error.response
      : Promise.reject(error);
  }
);

export default instance;
