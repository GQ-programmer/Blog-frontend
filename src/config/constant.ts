import * as process from "process";

const isDev = process.env.NODE_ENV === 'development';

export const baseURL = isDev  ? 'http://localhost:8080/api/' : 'http://zgq.cool:8082/api/'; //请求后端数据的基本地址，自定义