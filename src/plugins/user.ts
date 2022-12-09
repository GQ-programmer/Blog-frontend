import myAxios from "./myAxios";

/**
 * 获取当前登录用户
 */
const getCurrentUser = async  () => {
    const res = await myAxios.get('/user/current');
    return res.data
}
export default getCurrentUser;