import PostList from "../pages/PostList.vue";
import PostEdit from "../pages/PostEdit.vue";
import PostDetail from "../pages/PostDetail.vue";
import UserInfo from "../pages/UserInfo.vue";
import UserCenter from "../pages/UserCenter.vue";
import UserLogin from "../pages/UserLogin.vue";
import Index from "../pages/Index.vue";
import SearchPage from "../pages/SearchPage.vue";
import Docs from "../pages/Docs.vue";
import Error404 from "../pages/error/Error404.vue";
import getCurrentUser from "../plugins/user";
import {message} from "ant-design-vue";

const routes = [
    { path: '/', component: Index },
    { path: '/postEdit/:articleId',name:'PostEdit', component: PostEdit,
        // 独享守卫
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
    { path: '/postDetail/:id', name:'PostDetail',component: PostDetail,},
    { path: '/user/info/:userId',name:'UserInfo', component: UserInfo },
    { path: '/user/center', component: UserCenter },
    { path: '/user/login', component: UserLogin },
    { path: '/search/:searchText',name:'SearchPage', component: SearchPage },
    { path: '/docs', component: Docs },
    { path: '/:catchAll(.*)', component:  Error404},

]
export default routes;