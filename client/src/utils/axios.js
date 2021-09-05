import axios from 'axios';
const apiHost = process.env.REACT_APP_APIURL;
const axiosInstance = axios.create({ baseURL: apiHost });


export default axiosInstance;
