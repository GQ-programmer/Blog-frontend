import PostList from "../pages/PostList.vue";
import PostEdit from "../pages/PostEdit.vue";
import PostDetail from "../pages/PostDetail.vue";
import UserEdit from "../pages/UserEdit.vue";
import UserInfo from "../pages/UserInfo.vue";
import UserLogin from "../pages/UserLogin.vue";
import Index from "../pages/Index.vue";
import getCurrentUser from "../plugins/user";
import {message} from "ant-design-vue";

const routes = [
    { path: '/', component: Index },
    { path: '/postEdit',
        component: PostEdit,
        //独享守卫
        beforeEnter:async (to: any, from: any, next: any) => {
            console.log("postEdit:路由独享守卫beforeEnter");
            let currentUser = await getCurrentUser();
            if (currentUser === null) {
                message.error("请先登录哦!");
                next('/')
            }else {
                next()
            }
        }
    },
    { path: '/postList', component: PostList },
    { path: '/postDetail', component: PostDetail },
    { path: '/user/edit', component: UserEdit },
    { path: '/user/info', component: UserInfo },
    { path: '/user/login', component: UserLogin },

]
export default routes;