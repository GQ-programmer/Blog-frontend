<template>
  <Carousel/>
  <div style="margin-top: 20px">
    <div class="user-info-container">
      <a-row>
        <!-- 文章列表-->
        <a-col class="a-col-left" xs="24" :lg="15" style="">
          <div>
            <a-typography-title :level="5">最近文章</a-typography-title>
          </div>
          <hr style="border:none; height:1px;background-color: #dedbdb">
          <a-list item-layout="vertical" size="large"  :data-source="listData">
            <template #renderItem="{ item }">
              <a-list-item key="item.title">
                <template #actions>
                  发布时间：{{
                    dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
                  }}
                </template>
                <template #extra>
                  <img
                      width="210"
                      alt="logo"
                      :src="`${item.coverUrl}`"
                  />
                </template>
                <a-list-item-meta :description="`作者：${item.createUser.username}`">
                  <template #title>
                    <a :href="item.href">{{ item.title }}</a>
                  </template>
                  <template #avatar>
                    <a-avatar :src="item.createUser.avatarUrl"/>
                  </template>
                </a-list-item-meta>
                {{ item.description }}
              </a-list-item>
            </template>
            <template #footer>
              <div>
                <b>GQ Blog</b>
                <a href="#">豫 备案号</a>
                <a-pagination
                    style="float: right"
                    show-size-changer
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
        </a-col>

        <a-col class="a-col-right2" :xs="24" :lg="8" style="">
          <a-popover placement="rightTop">
            <template #content>
              <a-typography-text type="secondary">点击头像进入个人主页</a-typography-text>
            </template>
            <a-col :span="24" style="text-align: center;margin-top: 10px">
              <a-avatar :size="54" v-if="!user || !user.avatarUrl">
                <template #icon>
                  <UserOutlined/>
                </template>
              </a-avatar>
              <a-avatar :size="54" v-if="user && user.avatarUrl" :src="user.avatarUrl"/>
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
            <a-button type="primary" @click="warning">进入后台</a-button>
          </a-col>
        </a-col>
      </a-row>
      <div style="height: 50px"></div>
<!--      回到顶部-->
      <div id="components-back-top-demo-custom">
        <a-back-top visibilityHeight="300">
          <div class="ant-back-top-inner">UP</div>
        </a-back-top>
      </div>
    </div>
  </div>
<!--  登录模态框-->
  <a-modal v-model:visible="visible" width="500px" :maskClosable="false"
           :footer="null">
    <div class="login-form">
      <a-form
          :style="{width:'280px'}"
          :model="formState"
          name="normal_login"
          layout="horizontal"
      >
        <a-form-item>
          <div align="center">
            <img :src="logo" draggable="false" style="width: 150px;margin-bottom: 5px">
          </div>
        </a-form-item>
        <a-divider style="color:#1890ff;">账号密码登录</a-divider>
        <a-form-item
            name="username"
            :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input v-model:value="formState.username" placeholder="用户名:">
            <template #prefix>
              <UserOutlined class="site-form-item-icon"/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
            name="password"
            :rules="[{ required: true, message: '请输入密码!' }]"
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
          <a class="login-form-forgot" href="" style="float: right">忘记密码?</a>
        </a-form-item>
        <a-form-item>
          <a-button block type="primary" html-type="submit" @click="login()" class="login-form-button">
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import logo from '../assets/logo.png'
import {LockOutlined, UserOutlined} from '@ant-design/icons-vue';
import Carousel from "../components/Carousel.vue";
import {message} from 'ant-design-vue';
import {onMounted, reactive, ref, toRaw, UnwrapRef} from "vue";
import myAxios from "../plugins/myAxios";

const top = ref<number>(10);
const bottom = ref<number>(10);
const visible = ref<boolean>(false);
const labelCol = {style: {width: '150px'}}
const wrapperCol = {span: 14}

const listData = ref([]);
const currentPageNum = ref(1);
const user = ref({})
const totalNum = ref(0)
const pageSize = ref(5)
const pageSizeOptions = ref<string[]>(['5', '10', '15', '20']);

interface FormState {
  username: string;
  password: string;
  isRemember: boolean;
}
const formState: UnwrapRef<FormState> = reactive({
  username: '',
  isRemember: false,
  password: '',
});


onMounted(async () => {
  const res = await myAxios.get('/user/current');
  if (res.code === 0 && res.data !== null) {
    user.value = res.data
    message.success("获取用户信息成功");
  } else {
    user.value = null
    message.error("获取用户信息失败");
  }
  await doListData();

})

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
    message.error("获取文章信息出错!")
  }
}

const login = async () => {
  const res = await myAxios.post('/user/login', formState);
  if (res.code === 0 && res.data !== null) {
    user.value = res.data
    message.success("登录成功!");
    //关闭模态框
    visible.value = false;
  } else {
    message.error(`${res.description}`);
  }
}

const confirm = async (e: MouseEvent) => {
  console.log(e);
  const res = await myAxios.post('/user/logOut');
  if (res.code === 0 && res.data !== null) {
    user.value = null
    message.success("退出成功!");
  } else {
    message.error(`${res.description}`);
  }
};

const cancel = (e: MouseEvent) => {
  console.log(e);
  message.error('取消退出');
};
const showModal = () => {
  visible.value = true;
};


const warning = () => {
  message.warning('暂无后台,等待后续版本');
};

</script>

<style scoped>

#components-popover-demo-triggerType .ant-btn {
  margin-right: 8px;
}

.user-info-container {
  margin: 0 auto;
  width: 65%;
}

.a-col-right {
  background-color: white;
  box-shadow: 15px 15px 20px -30PX black;
  margin-left: 20px;
  height: 500px;
  padding: 10px;
}

.a-col-right2 {
  border: #eeecec solid 1px;
  background-color: white;
  box-shadow: 15px 15px 20px -30PX black;
  margin-left: 20px;
  height: 240px;
  padding: 10px;
}

.a-col-left {
  border: #eeecec solid 1px;
  background-color: white;
  margin-left: 0px;
  padding: 20px;
  box-shadow: 15px 15px 20px -30PX black;
}

.login-form {
  padding-left: 85px;
  padding-top: 30px;
  padding-bottom: 30px;
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
</style>