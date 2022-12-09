import PostList from "../pages/PostList.vue";
import PostEdit from "../pages/PostEdit.vue";
import PostDetail from "../pages/PostDetail.vue";
import UserEdit from "../pages/UserEdit.vue";
import UserInfo from "../pages/UserInfo.vue";
import UserLogin from "../pages/UserLogin.vue";
import Index from "../pages/Index.vue";

const routes = [
    { path: '/', component: Index },
    { path: '/postEdit', component: PostEdit },
    { path: '/postList', component: PostList },
    { path: '/postDetail', component: PostDetail },
    { path: '/user/edit', component: UserEdit },
    { path: '/user/info', component: UserInfo },
    { path: '/user/login', component: UserLogin },

]
export default routes;