<template>

  <div style="margin-top: 15px">

    <div class="user-info-container">
      <div class="category_div">
        <div class="category_div2">
          <a class="category_item"
             v-for="(item, index) in articleCategoryList"
             :key="index"
             :class="{'category_item_active': articleCategoryId === item.id}"
             style="caret-color: rgba(0, 0, 0, 0);"
             @click="listByCategoryId(item.id)">
            {{item.name}}
          </a>
        </div>
      </div>

<!--      region-->
<!--        二维码-->
<!--      <a-popover placement="right" style="width: 120px;">-->
<!--        <template #content style="width: 120px">-->
<!--          <img style="width: 110px;margin-left: 15px;" src="../assets/wechat.png">-->
<!--        </template>-->
<!--        <template #title>-->
<!--          <span>联系管理员</span>-->
<!--        </template>-->
<!--        <a-button shape="circle" style="-->
<!--            position: fixed;-->
<!--            top: 620px;-->
<!--            width: 45px;-->
<!--            height: 45px;-->
<!--            border:0px;-->
<!--            margin-right: 10px;"-->
<!--        >-->
<!--          <template #icon><qrcode-outlined style="font-size: 21px"/></template>-->
<!--        </a-button>-->
<!--      </a-popover>-->
<!--      赏-->

<!--        <a-button shape="circle" style="-->
<!--            position: fixed;-->
<!--            top: 570px;-->
<!--            width: 45px;-->
<!--            height: 45px;-->
<!--            border:0px;-->
<!--            margin-right: 10px;"-->
<!--            @click="showShang()"-->
<!--        >-->
<!--          <template #icon>-->
<!--            <img src="../assets/shang.png"/>-->
<!--          </template>-->
<!--        </a-button>-->

<!-- endregion-->

      <div class="base-content">
        <!-- 文章列表-->
        <section>
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
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分类名称：{{item.articleCategoryName}}
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

          </div>
        </section>
        <section>
          <div class="a-col-right">
            <div>
              <a-typography-title :level="5">资讯</a-typography-title>
            </div>
            <div class="a-col-right-item">
              <div class="a-col-right-item-title">
                <img src="../assets/index_icon/acticle_list.png" style="height: 20px">
                <a-typography-text strong style="font-size: 15px;line-height: 20px">
                  文章榜
                </a-typography-text>
                <a-divider style="margin-top: 10px"/>
              </div>
            </div>
            <div class="a-col-right-item">
              <div class="a-col-right-item-title">
                <img src="../assets/index_icon/autor_list.png" style="height: 20px">
                <a-typography-text strong style="font-size: 15px;line-height: 20px">
                  作者榜
                </a-typography-text>
                <a-divider style="margin-top: 10px"/>
              </div>
            </div>
            <div class="a-col-right-two">
              <div>
                <a-typography-text strong >网站更新日志</a-typography-text>
                <a-typography-text type="secondary">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;V2.2023.5.31</a-typography-text>
                <a-divider style="margin-top: 10px"/>
              </div>
              <div style="margin-left: 25px">
                <a-typography-paragraph>
                  <ul>
                    <li>
                      <a-typography-text >导航栏新增AI助手</a-typography-text>
                    </li>
                    <li style="margin-top: 5px">
                      <a-typography-text >导航栏新增搜索功能</a-typography-text>
                    </li>
                    <li style="margin-top: 5px">
                      <a-typography-text >导航栏新增面试文档模块</a-typography-text>
                    </li>
                    <li style="margin-top: 5px">
                      <a-typography-text >主页新增联系管理员、打赏功能</a-typography-text>
                    </li>

                  </ul>
                </a-typography-paragraph>
              </div>
            </div>
          </div>
        </section>
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
const articleCategoryId = ref(0);
const articleCategoryList = ref([
    '后端','微服务','前端','Vue.js','Linux','Docker',
    '框架源码','MySQL','Redis','消息队列',
    '多线程'
])//'工具类','设计模式','Python','flutter'

/**
 * 获取文章分类
 */
const getArticleCategoryList = async () => {
  // 重新编辑文章
  const res = await myAxios.get('/articleCategory/list')
  if (res.code === 0 && res.data !== null) {
    articleCategoryList.value = res.data
  }
}

/**
 * 按分类搜索
 * @param id
 */
const listByCategoryId = (id:number)=> {
  articleCategoryId.value = id
  doListData();
}
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
  const currentUser = await getCurrentUser()
  if (currentUser !== null) {
    user.value = currentUser
    // message.success("获取用户信息成功");
  } else {
    user.value = null

  }
  await doListData();
  await getArticleCategoryList();
})

/**
 * 获取文章列表
 */
const doListData = async () => {
  const articleRes = await myAxios.get('/article/listPage',{
    params:{
      articleCategoryId:articleCategoryId.value,
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

#components-popover-demo-triggerType .ant-btn {
  margin-right: 8px;
}

.user-info-container {
  width: 1110px;
  min-width:1080px;

}


.a-col-right-item {
  margin-bottom: 15px;
  background-color: white;
  //background-color: rgba(255, 255, 255, 0.8);
  /*border: rgb(246, 245, 245) solid 1px;*/
  height: 240px;
  padding: 10px;
  border-radius: 7px;

}
.a-col-right-two {
  margin-top: 15px;
  /*border: rgb(246, 245, 245) solid 1px;*/
  padding: 10px;
  border-radius: 7px;
  //background-color: rgba(255, 255, 255, 0.8);
  background-color: white;
}

.a-col-left {
  margin-top: 15px;
  width: 830px;
  padding: 0px;
  border-radius: 7px;
}
.a-col-right{
  width: 265px;
  margin-top: 15px;
  margin-left: 15px;
}

.base-content {
  display: flex;
}
.my-notification{
  color: red;
  font-weight: bold;
}

.a-col-right-item-title{
  display: flex;
  flex-wrap: wrap;
}
.a-col-right-item-title > img{
  margin-right: 7px;
}
:deep(.ant-carousel .slick-list) {
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border-radius: 5px;
}
:deep(.ant-carousel[data-v-f2893689] .slick-slide) {
  text-align: center;
  height: 170px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}
.ant-list-vertical .ant-list-item {
  align-items: initial;
  background-color: white;
  //background-color: rgba(255, 255, 255, 0.8);
  padding: 25px;
}
hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
  display: none;
}

.ant-list-item:first-child {
  /* 样式规则适用于第一个列表项 */
  border-radius: 7px 7px 0 0;
}

.ant-list-item:last-child {
  /* 样式规则适用于最后一个列表项 */
  border-radius: 0 0 7px 7px;
}
.category_div {
  min-width: 700px;
  background-color: white;
  border-radius: 4px;
  height:60px;
  display: flex;
  justify-content: center;
  padding: 0px 48px;
  //background-color: rgba(255, 255, 255, 0.8);
  a.category_item {
    height: 60px;
    font-size: 16px;
    color:black;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: transform 0.3s ease; /* 添加 transform 属性的过渡效果 */
  }
  a.category_item:hover {
    color: #2996fa; /* 改变文本颜色 */
    //font-size: 22px;
    transform: scale(1.3); /* 当鼠标悬停时，放大文本 */
  }
  a.category_item_active {
    color: #2996fa; /* 改变文本颜色 */
    transform: scale(1.3); /* 当鼠标悬停时，放大文本 */
  }
}

.category_div2 {
  width: 100%;
  display: flex;
  gap: 45px;
  //grid-template-columns: repeat(12, 0.5fr); /* 创建6列，每列平均分配剩余空间 */
}
</style>
