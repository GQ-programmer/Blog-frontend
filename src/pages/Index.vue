<template>
  <div style="min-width: 1540px">
    <Carousel />
  </div>
  <div style="margin-top: 20px">
    <div class="user-info-container">
<!--      <a-row>-->
        <!-- 文章列表-->
        <div class="a-col-left" >
          <div>
            <a-typography-title :level="5">最近文章</a-typography-title>
          </div>
          <hr style="border:none; height:1px;background-color: #dedbdb">
          <a-list item-layout="vertical" size="large"  :data-source="listData">
            <template #renderItem="{ item }">
              <a-list-item key="item.title">
                <template #actions>
                  发布时间：{{
                    dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
                  }}
                </template>
                <template #extra>
                  <img
                      @click="doDetail(item)"
                      width="210"
                      alt="logo"
                      :src="`${item.coverUrl}`"
                  />
                </template>
                <a-list-item-meta :description="`作者：${item.createUser.username}`">
                  <template #title>
                    <a @click="doDetail(item)" :href="item.href">{{ item.title }}</a>
                  </template>
                  <template #avatar>
                    <a-avatar @click="doUserInfo(item.createUser.id)" :src="item.createUser.avatarUrl"/>
                  </template>
                </a-list-item-meta>
                {{ item.description }}
              </a-list-item>
            </template>
            <template #footer>
              <div>
                <a-pagination
                    style="float: right"
                    show-size-changer
                    size="small"
                    :page-size-options="pageSizeOptions"
                    :show-total="total => `总数 ${totalNum} 条`"
                    @change="doListData()"
                    v-model:pageSize="pageSize"
                    v-model:current="currentPageNum"
                    :total="totalNum" show-less-items>
                  <template #buildOptionText="props">
                    <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
                    <span v-else>全部</span>
                  </template>
                </a-pagination>
              </div>
            </template>
          </a-list>
          <div style="height: 40px;margin-top: 68px;text-align: center">
            <a-space>
              <b>GQ Blog</b>
              <a-divider type="vertical" />
              <span>Copyright&nbsp;<copyright-circle-outlined />&nbsp;2022&nbsp;zgq.cool</span>
              <a-divider type="vertical" />
              <a href="https://beian.miit.gov.cn/">豫ICP备2021035305号-1</a>
            </a-space>
          </div>
        </div>

        <div class="a-col-right">
          <a-popover placement="rightTop">
            <template #content>
              <a-typography-text type="secondary">点击头像进入个人主页</a-typography-text>
            </template>
            <a-col :span="24" style="text-align: center;margin-top: 10px">
              <a-avatar @click="doUserCenter()" :size="54" v-if="!user || !user.avatarUrl">
                <template #icon>
                  <UserOutlined/>
                </template>
              </a-avatar>
              <a-avatar @click="doUserCenter()" :size="54" v-if="user && user.avatarUrl" :src="user.avatarUrl"/>
            </a-col>
            <a-col :span="24" style="text-align: center;margin-top: 10px">
              <a-typography-title :level="4">
                {{ user && user.username ? `${user.username}` : '未登录' }}
              </a-typography-title>
            </a-col>
          </a-popover>
          <a-col :span="24" style="text-align: center;margin-top: 15px">
            <a-typography-text>欢迎访问,GQBlog~</a-typography-text>
          </a-col>
          <a-col :span="24" style="text-align: center;margin-top: 20px">
            <a-button style="margin-right: 30px" type="primary" v-if="user === null" @click="showModal">点击登录</a-button>
            <a-popconfirm
                placement="leftBottom"
                title="你确定要退出吗?&nbsp&nbsp&nbsp&nbsp"
                ok-text="Yes"
                cancel-text="No"
                @confirm="confirm"
                @cancel="cancel"
            >
              <a-button style="margin-right: 30px" v-if="user">退出登录</a-button>
            </a-popconfirm>
            <a-button type="default" @click="warning">进入后台</a-button>
          </a-col>
        </div>
<!--      </a-row>-->
<!--      <div style="height: 50px"></div>-->
<!--      回到顶部-->
      <div id="components-back-top-demo-custom">
        <a-back-top visibilityHeight="300">
          <div class="ant-back-top-inner">UP</div>
        </a-back-top>
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
        <a-form-item>
          <a-form-item name="remember" no-style>
            <a-checkbox v-model:checked="formState.isRemember">记住我</a-checkbox>
          </a-form-item>
          <a class="login-form-forgot" href="#" style="float: right" @click="()=>{message.info('请联系管理员修改哦')}">忘记密码?</a>
        </a-form-item>
        <a-form-item>
          <a-button block type="primary" html-type="submit" @click="login()" class="login-form-button">
            <span v-show="!spinning">登录</span>
            <a-spin :indicator="indicator" :spinning="spinning" />
          </a-button>
        </a-form-item>
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

<script lang="ts" setup>
import dayjs from "dayjs";
import logo from '../assets/logo.png'
import {LockOutlined,CopyrightCircleOutlined, UserOutlined} from '@ant-design/icons-vue';
import Carousel from "../components/Carousel.vue";
import {message} from 'ant-design-vue';
import {ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref, toRaw, UnwrapRef} from "vue";
import myAxios from "../plugins/myAxios";
import getCurrentUser from "../plugins/user";
import {useRouter} from "vue-router";
import { LoadingOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

const router = useRouter()
const top = ref<number>(10);
const bottom = ref<number>(10);
const visible = ref<boolean>(false);
const labelCol = {style: {width: '150px'}}
const wrapperCol = {span: 14}
const logAndReg = ref('login')
const listData = ref([]);
const currentPageNum = ref(1);
const user = ref()
const totalNum = ref(0)
const pageSize = ref(5)
const pageSizeOptions = ref<string[]>(['5', '10', '15', '20']);
const { appContext } = getCurrentInstance() as ComponentInternalInstance;
const activeKey = ref(1);
const {proxy} = getCurrentInstance()
const spinning = ref(false);


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

/**
 * 进入用户详情页
 * @param userId
 */
const doUserInfo = (userId:number) => {
  router.push({
    name:'UserInfo',
    params:{
      userId:userId
    }
  })
}
/**
 * 进入个人主页
 */
const doUserCenter = () => {
  if (!user.value) {
    message.warn("请先登录哦")
  }else {
    router.push('/user/center')
  }

}

/**
 * 进入文章详情页
 * @param id
 */
const doDetail = async (item) => {
  router.push({
    name:'PostDetail',
    params:{
      id:item.id
    }
  })
}

onMounted(async () => {
  const currentUser = await getCurrentUser()
  if (currentUser !== null) {
    user.value = currentUser
    // message.success("获取用户信息成功");
  } else {
    user.value = null
  }
  await doListData();

})

/**
 * 获取文章列表
 */
const doListData = async () => {
  const articleRes = await myAxios.get('/article/listPage',{
    params:{
      currentPageNum:currentPageNum.value,
      pageSize:pageSize.value
    }
  });
  if (articleRes.code === 0 && articleRes.data !== null){
    listData.value = articleRes.data.records;
    totalNum.value = articleRes.data.total;
  } else {
    message.error("获取文章信息出错")
  }
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

/**
 * 退出登录
 * @param e
 */
const confirm = async (e: MouseEvent) => {
  console.log(e);
  const res = await myAxios.post('/user/logOut');
  if (res.code === 0 && res.data !== null) {
    user.value = null
    message.success("退出成功");
  } else {
    message.error(`${res.description}`);
  }
};

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

</script>

<style scoped>

#components-popover-demo-triggerType .ant-btn {
  margin-right: 8px;
}

.user-info-container {
  margin: 0 auto;
  width: 800px;
  min-width:1080px
}


.a-col-right {
  background-color: white;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  margin-left: 20px;
  border: rgb(246, 245, 245) solid 1px;
  height: 230px;
  width: 300px;
  padding: 10px;
  float: left;
  border-radius: 4px;

}

.a-col-left {
  width: 680px;
  float: left;
  background-color: white;
  margin-left: 39px;
  padding: 20px;
  /*border: rgb(246, 245, 245) solid 1px;*/
  border-radius: 4px;

  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.login-form {
  padding-left: 85px;
  padding-top: 30px;
  padding-bottom: 10px;
}

#components-back-top-demo-custom .ant-back-top {
  bottom: 100px;
}

#components-back-top-demo-custom .ant-back-top-inner {
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 4px;
  background-color: #1088e9;
  color: #fff;
  text-align: center;
  font-size: 20px;
}

:deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab, .ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab) {
  margin: 0;
  padding: 8px 16px;
  background: white;
  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
:deep(.ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab-active, .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab-active){
  border: 1px solid #f0f0f0;
  border-bottom-color: #fff;
}

:deep(.ant-divider-horizontal.ant-divider-with-text) {
  display: flex;
  margin-bottom: 15px;
  margin-top: 0px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
  text-align: center;
  border-top: 0;
  border-top-color: rgba(0, 0, 0, 0.06);
}

</style>