<!--      <div style="float: right;margin-left: 50px;width: 480px">-->
<template>
  <div class="container">
    <div class="header">
      <div >
        <img :src="logo" style="width: 120px;" @click="()=>{router.push('/')}">
      </div>
      <a-menu v-model:selectedKeys="current"  mode="horizontal" class="head-menu">
          <a-menu-item  key="index"  >
            <template #icon>
              <home-outlined />
            </template>
            <router-link to="/">首页&nbsp;</router-link>
          </a-menu-item>
          <a-menu-item  key="chatGPT" @click="doChatGPT()"   >
            <template #icon>
              <user-switch-outlined />
            </template>
            AI助手&nbsp;
          </a-menu-item>
          <a-menu-item  key="docs" @click="doDoc()"   >
            <template #icon>
              <read-outlined />
            </template>
            面试文档&nbsp;
          </a-menu-item>
          <a-menu-item key="postEdit"   @click="doPostEdit()">
            <template #icon>
              <file-markdown-outlined />
            </template>
            发布文章
          </a-menu-item>
      </a-menu>

      <a-input-search
          v-model:value="searchText"
          :style="{ opacity: searchOpacity}"
          placeholder="搜索文章"
          enter-button
          @search="onSearch"
          v-if="isShowSearch"
          class="header-search"
      />
      <div class="header-search" v-if="!isShowSearch"/>
<!--      <transition name="fade">-->
        <a-button type="primary" v-show="isShowSearch" @click="showModal" style="height: 34px">登录
          <a-divider type="vertical" style="border-color: white" />
          注册
        </a-button>
        <div style="width: 122px;user-select: none  " v-show="!isShowSearch">
          <a-avatar size="large" src="https://zgq-icu-2002-1313043931.cos.ap-shanghai.myqcloud.com/mynotes/avatar-boy.png">
          </a-avatar>
        </div>
<!--      </transition>-->
    </div>

    <div class="content">
      <router-view/>
    </div>
    <div class="footer">
      <div class="footer-item">
        <a-space>
          <span>S D K P</span>
          <a-divider type="vertical" />
          <span>Copyright&nbsp;<copyright-circle-outlined />&nbsp;2022&nbsp;zgq.cool</span>
          <a-divider type="vertical" />
          <span>
            <a href="https://beian.miit.gov.cn/">豫ICP备2021035305号-1</a>
          </span>
        </a-space>
      </div>

      <div class="footer-item">
        专业软件开发者知识平台
      </div>
      <div class="footer-item">
        Software Developer Knowledge Platform
      </div>
    </div>
  </div>

  <!--  登录模态框-->
  <a-modal v-model:visible="visible" width="500px" :maskClosable="false" :after-close="onAfterClose" :footer="null">

    <div style="text-align: center;margin-top: 24px">
      <div style="margin-bottom: 20px;">
        <img :src="logo" draggable="false" style="width: 150px;margin-bottom: 5px">
      </div>
      <a-radio-group v-model:value="logAndReg">
        <a-radio-button value="login">登录</a-radio-button>
        <a-radio-button value="register">注册</a-radio-button>
      </a-radio-group>
    </div>
    <div v-show="logAndReg === 'login'" class="login-form">
      <a-form
          :style="{width:'280px'}"
          :model="formState"
          name="normal_login"
          layout="horizontal"
          ref="login_formRef"
      >

        <a-divider style="color:#1890ff;">账号密码登录</a-divider>
        <a-form-item
            name="username"
            :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input v-model:value="formState.username" placeholder="用户名:">
            <template #prefix>
              <UserOutlined class="site-form-item-icon"/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
            name="password"
            :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password v-model:value="formState.password" placeholder="密码:">
            <template #prefix>
              <LockOutlined class="site-form-item-icon"/>
            </template>
          </a-input-password>
        </a-form-item>
        <div class="form-item-end">
          <a-form-item name="remember" no-style>
            <a-checkbox v-model:checked="formState.isRemember">记住我</a-checkbox>
          </a-form-item>
          <a class="login-form-forgot" href="#" style="float: right" @click="()=>{message.info('请联系管理员修改哦')}">忘记密码?</a>
        </div>
        <div class="form-item-end">
          <a-button block type="primary" html-type="submit" @click="login()" class="login-form-button">
            <span v-show="!spinning">登录</span>
            <a-spin :indicator="indicator" :spinning="spinning" />
          </a-button>
        </div>
        <div class="form-item-end">
          其它登录:
          <span @click="loginForQQ()">
            <img style="height: 25px;" src="src/assets/index_icon/qq_icon.png">
            QQ
          </span>
        </div>
      </a-form>
    </div>
    <div v-show="logAndReg === 'register'" class="login-form">
      <a-form
          :style="{width:'280px'}"
          :model="reg_formState"
          name="normal_reg"
          layout="horizontal"
          autocomplete="off"
          ref="reg_formRef"
      >
        <!--        <a-form-item>-->
        <!--          -->
        <!--        </a-form-item>-->
        <a-divider style="color:#1890ff;">昵称注册</a-divider>
        <a-form-item
            name="username"
            :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input v-model:value="reg_formState.username" placeholder="昵称:" autocomplete="off">
            <template #prefix>
              <UserOutlined class="site-form-item-icon"/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
            name="password"
            :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password v-model:value="reg_formState.password" placeholder="密码:" autocomplete="off">
            <template #prefix>
              <LockOutlined class="site-form-item-icon"/>
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
            name="checkPassword"
            :rules="[{ required: true, message: '请确认密码' }]"
        >
          <a-input-password v-model:value="reg_formState.checkPassword" placeholder="确认密码:" autocomplete="off">
            <template #prefix>
              <LockOutlined class="site-form-item-icon"/>
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button block type="primary" html-type="submit" @click="register()" class="login-form-button">
            <span v-show="!spinning">注册</span>
            <a-spin :indicator="indicator" :spinning="spinning" />
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>

</template>
<script lang="ts"  setup>
import logo from '../assets/sdkp-logo.png'
import {defineComponent, getCurrentInstance, h, onMounted, reactive, ref, toRaw, UnwrapRef, watchEffect} from 'vue';
import {
  HomeOutlined,
  FileMarkdownOutlined,
  ReadOutlined,
  UserSwitchOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue';
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {message} from "ant-design-vue";
import getCurrentUser from "../plugins/user";
import SearchPage from "../pages/SearchPage.vue";
const router = useRouter()
const route = useRoute();
const isShowSearch = ref(false);
const chat_visible = ref(false);
const searchText = ref('')
const searchOpacity = ref(1);
const visible = ref<boolean>(false);
const spinning = ref(false);
const user = ref()
const logAndReg = ref('login')
const {proxy} = getCurrentInstance()



interface FormState {
  username: string;
  password: string;
  isRemember: boolean;
}
/**
 * 登录表单初始值
 */
const formState: UnwrapRef<FormState> = reactive({
  username: '',
  isRemember: false,
  password: '',
  checkPassword:''
});

interface Reg_FormState {
  username: string;
  password: string;
  checkPassword:string
}
/**
 * 注册表单初始值
 */
const reg_formState: UnwrapRef<Reg_FormState> = reactive({
  username: '',
  password: '',
  checkPassword:''
});
const doAIRouter = () => {
  router.push('/chatGPT')
}

const current = ref<string[]>(['index']);

const showSearch = (data:Boolean) => {
  if (data === true) {

        isShowSearch.value = true;


  }else {

        isShowSearch.value = false;

  }
}
/**
 * 根据路由 展示导航item active状态
 *
 * 搜索框只在首页和搜索页显示
 */
watchEffect(() =>{
  const path = route.path;
  var patt= /^\/postEdit/g;
  var pattSearch= /^\/search/g;
  console.log(path)
  if (path === '/'){ //首页
    showSearch(true);
    current.value = ['index'];
  }else if (path === '/docs'){
    // isShowSearch.value = false
    current.value = ['docs'];
  }else if (path === '/chatGPT'){
    showSearch(false);
    current.value = ['chatGPT'];
  }
  else if (patt.test(path)){ //文章编辑页
    current.value = ['postEdit'];
    // isShowSearch.value = false
  }
  else { // 其他页
    // none都未选中
    current.value = ['none'];
    // isShowSearch.value = false
  }
})


const doChatGPT = async () => {
  current.value = ['chatGPT']
  router.push('/chatGPT');
}

const doDoc = async () => {
  console.log( "@@@"+route.fullPath)
  const currentUser = await getCurrentUser();
  if (currentUser === null) {
    message.warn("请先登录");
    // 解决导航栏active问题
    if (route.path === '/'){
      current.value = ['index'];
    }else {
      current.value = ['none'];
    }

    return;
  }else {
    current.value = ['docs'];
    router.push('/docs');
  }
}
/**
 * 点击发布文章事件
 */
const doPostEdit = async () => {
  console.log( "@@@"+route.fullPath)
  const currentUser = await getCurrentUser();
  if (currentUser === null) {
    message.warn("你还未登录");
    // 解决导航栏active问题
    if (route.path === '/'){
      current.value = ['index'];
    }else {
      current.value = ['none'];
    }

    return;
  }else {
    current.value = ['postEdit'];
    router.push({
      name:'PostEdit',
      params:{articleId: 0}
    })
  }
}
const onSearch = () => {
  let searchValue = searchText.value
  searchValue = searchValue.replace(/\s*/g,"");
  console.log(searchValue); //66
  console.log(searchValue.length)

  if (searchValue.length < 1 || searchText.value === ''){return}
  // alert(toRaw(router).currentRoute.value.path)
  router.push({
    name:'SearchPage',
    params:{searchText: searchValue}
  })
  searchText.value = ''
  // message.warn("暂未实现，等待后续版本!")
}

/**
 * 登录
 */
const login = async () => {
  if (formState.username.length < 3 || formState.username.length > 8){
    message.warn("昵称3~8位")
    return;
  }
  if (formState.password.length < 4 || formState.password.length > 12){
    message.warn("昵称4~12位")
    return;
  }
  spinning.value = true
  const res = await myAxios.post('/user/login', formState);
  if (res.code === 0 && res.data !== null) {
    user.value = res.data
    message.success("登录成功");
    // 解决卡顿
    setTimeout(() => {
      //关闭模态框
      visible.value = false;
      spinning.value = false
    }, 500);
  } else {
    message.error(`${res.description}`);
    setTimeout(() => {
      spinning.value = false
    }, 500)
  }
}

const register = async () => {
  message.info('注册功能已关闭，请联系管理员!')
  return;
  if (reg_formState.username.length < 3 || reg_formState.username.length > 8){
    message.warn("昵称3~8位")
    return;
  }
  if (reg_formState.password.length < 4 || reg_formState.password.length > 12){
    message.warn("昵称4~12位")
    return;
  }
  if (reg_formState.password !== reg_formState.checkPassword){
    message.warn("两次密码不一致")
    return;
  }
  spinning.value = true
  const res = await myAxios.post('/user/register',{
    username:reg_formState.username,
    password:reg_formState.password,
    checkPassword:reg_formState.checkPassword
  })
  if (res.code === 0 && res.data !== null){
    message.success('注册成功，请登录')
    // 清除注册表单数据
    clearRegister()
    setTimeout(() => {
      spinning.value = false
      logAndReg.value = 'login'
    }, 500)
  }else {
    message.error(`${res.description}`)
    setTimeout(() => {
      spinning.value = false
    }, 500)
  }
}

const clearLogin = () => {
  // 清空登录表单值
  formState.isRemember = false;
  formState.username = '';
  formState.password = '';
}
const clearRegister = () => {
  // 清空注册表单值
  reg_formState.username = ''
  reg_formState.password = ''
  reg_formState.checkPassword = ''
}

const onAfterClose = () => {
  // 清除表单校验
  proxy.$refs['login_formRef'].resetFields();
  proxy.$refs['reg_formRef'].resetFields();
  clearLogin();
  clearRegister();
  // 激活登录按钮
  logAndReg.value = 'login'
}


/**
 * 点击登录后取消登录的时间
 * @param e
 */
const cancel = (e: MouseEvent) => {
  console.log(e);
  // message.error('取消退出');
};
/**
 * 展示登录模态框
 */
const showModal = () => {
  visible.value = true;
};
const showShang = () => {
  shang_visible.value = true;
};

const warning = () => {
  message.warning('暂无后台，等待后续版本');
};

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '24px',
    color: 'white'
  },
  spin: true,
});

const loginForQQ = () => {

}

</script>

<style lang="less" >
//.container{
//  height: 100%;
//}

.header{
  display: flex;
  justify-content: center; /* 在主轴上水平居中 */
  align-items: center; /* 在交叉轴上垂直居中 */
  gap: 80px;
  background-color: white;
}
.login-form {
  display: flex;
  justify-content: center;
}
.header-search{
  width: 300px !important;
  //margin-left: 100px;
  transition: opacity 0.3s ease;
}
.ant-menu-item {
  line-height: 65px;
}
.ant-menu-title-content {
  transition: color 0.3s;
  font-size: 15px;
  font-family:  微软雅黑  ;
}
.header-title{
  color:black;
  font-size: 16px;
  font-weight: 500;
  margin-left: 10px;
  margin-top: 5px;
}
.content{
  width: 100%;
  display: flex;
  justify-content: center;
}
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  margin-top: 20px;
}
.form-item-end{
  margin-bottom: 15px;
}

</style>
