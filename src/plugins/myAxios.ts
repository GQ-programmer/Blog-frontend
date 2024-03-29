import axios from 'axios'
import * as process from "process";
import {baseURL} from "../config/constant";

//使用axios下面的create([config])方法创建axios实例，
// 其中config参数为axios最基本的配置信息。
const myAxios = axios.create({
    baseURL: baseURL, //请求后端数据的基本地址，自定义
    withCredentials:true  //请求携带Cookie
})


// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log('我要发请求了',config)
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
myAxios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    console.log('我收到响应了',response)
    return response.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

//导出我们建立的axios实例模块，ES6 export用法
export default myAxios
