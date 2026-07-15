import axios from "axios";
import SummaryApi from "../common/SummaryApi";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let refreshing = false;
let pendingQueue = [];

const flushQueue = (error) => {
  pendingQueue.forEach((callback) => {
    callback(error);
  });
  pendingQueue = [];
};

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized = error.response?.status === 401;
    const canRetry = !originalRequest?._retry && !originalRequest?._isRefresh;

    if (!isUnauthorized || !canRetry) {
      return Promise.reject(error);
    }

    if (refreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((refreshError) => {
          if (refreshError) {
            reject(refreshError);
            return;
          }
          originalRequest._retry = true;
          resolve(Axios(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    refreshing = true;

    try {
      await Axios({ ...SummaryApi.refreshToken, _isRefresh: true });
      flushQueue(null);
      return Axios(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      refreshing = false;
    }
  },
);

export default Axios;
