<template>

  <div>

    <div class="user-info-container" >


      <div class="base-content">
      </div>

<!--      回到顶部-->
      <div id="components-back-top-demo-custom">
        <a-back-top visibilityHeight="300">
          <div class="ant-back-top-inner">UP</div>
        </a-back-top>
      </div>
    </div>

  </div>
    <a-modal
      v-model:visible="shang_visible" width="500px"
      :maskClosable="true"
      :after-close="onAfterClose"
      :footer="null"
      :cancel="closeShang()"
    >
    <div style="text-align: center;font-family: 华文新魏;font-size: 20px;margin-bottom: 10px">
      赞助站长，帮助网站走的更远~
    </div>
    <div style="border: 1px red ;">
      <div v-if="mode_pay === 'wechat'" style="width: 200px;height: 260px;margin: 0 auto ">
        <img  style="width:200px"  src="../assets/wechat-pay.jpg">
      </div>
      <div v-if="mode_pay === 'zhifubao'" style="width: 200px;height: 260px;margin: 0 auto ">
        <img style="width:200px"  src="../assets/zhifubao-pay.jpg">
      </div>
    </div>
    <div >
      <div style="margin: 0 auto;width: 165px;">
        <a-radio-group v-model:value="mode_pay" :style="{ marginBottom: '8px' }">
        <a-radio-button value="wechat">微信支付</a-radio-button>
        <a-radio-button value="zhifubao">支付宝</a-radio-button>
        </a-radio-group>
      </div>
    </div>

  </a-modal>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import logo from '../assets/sdkp-logo.svg'
import logoAI from '../assets/logo-ai.png'
import {QrcodeOutlined,CopyrightCircleOutlined, LockOutlined,UserOutlined} from '@ant-design/icons-vue';
import Carousel from "../components/Carousel.vue";
import {Button, message, notification, NotificationPlacement, TabsProps} from 'ant-design-vue';
import {ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref, toRaw, UnwrapRef} from "vue";
import myAxios from "../plugins/myAxios";
import getCurrentUser from "../plugins/user";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import { LoadingOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';
import Docs from "./Docs.vue";

const mode_pay = ref('wechat');
const router = useRouter()
const route = useRoute()
const top = ref<number>(10);
const bottom = ref<number>(10);
const shang_visible = ref<boolean>(false);
const labelCol = {style: {width: '150px'}}
const wrapperCol = {span: 14}
const listData = ref([]);
const currentPageNum = ref(1);
const totalNum = ref(0)
const pageSize = ref(5)
const pageSizeOptions = ref<string[]>(['5', '10', '15', '20']);
const { appContext } = getCurrentInstance() as ComponentInternalInstance;
const activeKey = ref(1);
const user = ref()
const categoryList = ref([
    '后端','微服务','前端','Vue.js','Linux','Docker',
    '框架源码','MySQL','Redis','消息队列',
    '多线程'
])//'工具类','设计模式','Python','flutter'



const openNotification = (placement: NotificationPlacement) => {
  const key = `open${Date.now()}`;
  notification.open({
    message: ()=>h('div',
        {style: 'font-weight: bold; font-size: 17px'},
        '登录即可发布文章和面试文档查看'),
    description: ()=>h('div',
        {style: 'color:black;'},
        '超 5 千万创作者的学习心得、深度文章和面试文档尽在GQBlog。'),
    placement,
    duration: 0,
    btn: () =>
        h(
            Button,
            {
              type: 'primary',
              size: 'block',
              style: 'width: 100%',
              onClick: () => {
                notification.close(key)
                // showModal()
              }
            },
            { default: () => '立即登录/注册' },
        ),
        style: {
          width: '350px',
        },
        key,
        onClose: close,
  });
};



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

const closeShang = () => {
  mode_pay.value = 'wechat'
}

onMounted(async () => {
  const previousRoute =  localStorage.getItem('previousRoute')
  const currentUser = await getCurrentUser()
  if (currentUser !== null) {
    user.value = currentUser
    // message.success("获取用户信息成功");
  } else {
    user.value = null
    if (previousRoute === '/') {
      // 刷新时调用
      openNotification('')
    }
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


</script>

<style lang="less" scoped>

</style>
