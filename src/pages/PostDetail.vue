
<template>
  <div class="post-detail-container" v-if="articleVo">

    <div>
      <div class="v-md-preview">
        <!--  页头 -->
        <div class="detail-pageheader">
          <div style="width:610px;height: 50px;">
            <div style="float: left;margin-left: 15px" @click="back()">
              <a style="color: black">
                <left-outlined style="font-size: 23px;color:grey ;margin-top: 18px"/>
              </a>
            </div>
            <div style="float: left;font-size:16px;margin-top: 15px;margin-left: 5px">
              <div style="display: inline;color:grey ;">返回</div>
            </div>
            <div v-if="currentUser !== null && currentUser.id === articleVo.createUser.id" style="float: right;font-size:16px;margin-top: 15px;margin-left: 5px">
              <a-button danger type="link" @click="doArticleEdit(articleVo.id)">编辑</a-button>
            </div>
          </div>
          <div style="
                  margin-left: 25px;
                  margin-top: 6px;
                  font-size: 15px;
                  border-top: 1px solid #dcd9d9;
                  padding-top: 10px;
                  margin-right: -19px;
            ">
            文章标题：<span style="color:#1890ff;">{{articleVo.title}}</span>
          </div>
        </div>
        <!-- 文章主体 -->
        <div style="margin-top: 108px">
          <!-- todo 踩坑：该组件text不支持元素响应式，必须在setup阶段就进行初始化 -->
          <v-md-preview :text="articleVo.content" ref="preview"></v-md-preview>
          <div style="height: 50px; background-color: white"></div>
        </div>
      </div>

    </div>

    <!-- 右侧div-->
    <div class="detail-right">
      <!-- 用户信息 -->
      <div class="one">
        <div style="width: 100%;height: 80px ;">
          <div style="padding-top: 3px;padding-left: 9px;float: left">
            <a-avatar :size="60" :src="articleVo.createUser.avatarUrl"/>
          </div>
          <!--  不能超过8个字-->
          <div style="float: left;font-size: 17px;margin-left: 22px;margin-top: 18px;">
            {{articleVo.createUser.username}}
          </div>
        </div>
        <!--  todo 限制后端个性签名的字数 < 25 -->
        <div style="margin-left: 22px;color: grey">
          {{articleVo.createUser.description}}
        </div>
        <div style="text-align: center;margin-top: 18px;">
          <a-space :size="20">
            <a-button shape="round"  @click="doUserInfo(articleVo.createUser.id)">主页</a-button>
            <a-button shape="round">私信</a-button>
          </a-space>
        </div>
      </div>
      <!-- 目录  弃用
      <div class="two">
        <div style="font-size: 18px;
            margin-bottom: 0em;
            padding: 9px;
            color:  #379cfa;
            border-bottom: 1px solid #379cfa;
            "
        >
          目录
        </div>
        <div v-if="state.titleData.length < 1" style="color: grey;margin-left: 10px">{{state.titleData.length}}No directory</div>
        <div class="anchor-tag" v-for="anchor in state.titleData" :key="anchor" @click="handleAnchorClick(anchor)">
          <a v-if="anchor.indent === 0">{{ `${anchor.title}` }}</a>
          <a v-else-if="anchor.indent === 1">{{ `&nbsp&nbsp;${anchor.title}` }}</a>
          <a v-else-if="anchor.indent === 2">{{ `&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;${anchor.title}` }}</a>
          <a v-else-if="anchor.indent === 3">{{ `&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;${anchor.title}` }}</a>
          <a v-else-if="anchor.indent === 4">{{
              `&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;${anchor.title}`
            }}</a>
          <a v-else-if="anchor.indent === 5">{{
              `&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;&nbsp&nbsp;${anchor.title}`
            }}</a>
        </div>

        <div style="height: 10px"></div>
      </div>
  -->
    </div>
  </div>
  <!--      回到顶部-->
  <div id="components-back-top-demo-custom">
    <a-back-top visibilityHeight="300">
      <div class="ant-back-top-inner">UP</div>
    </a-back-top>
  </div>
  <div class="post-detail-container" style="margin-top: 200px;" v-if="isShow">
    <a-empty>
      <template #description>
        <span>
          该链接不存在!
        </span>
      </template>
    </a-empty>
  </div>
</template>


<script lang="ts" setup>
import {LeftOutlined} from "@ant-design/icons-vue";
import {
  ComponentInternalInstance,
  getCurrentInstance,
  onMounted,
  reactive,
  ref
} from 'vue'
import {onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {message} from "ant-design-vue";
import getCurrentUser from "../plugins/user";

const route = useRoute()
const router = useRouter()
const articleVo = ref()
const currentUser = ref()
const isShow = ref(false)

const {proxy}: any = getCurrentInstance() as ComponentInternalInstance;
const preview: any = ref()
const state: any = reactive({
  titleData: []
})
const doArticleEdit = (id) => {
  router.push({
    name:"PostEdit",
    params:{articleId:id}
  })
}

const doUserInfo = (id) => {
  router.push({
    name:'UserInfo',
    params:{
      userId:id
    }
  })
}

onMounted( async () => {
  //  获得当前登录用户
  const user = await getCurrentUser();
  if (user !== null) {
    currentUser.value = user;
  }
  const id = route.params.id;
  const res = await myAxios.get('/article/get',{
    params:{
      articleId:id
    }
  })
  if (res.code === 0 && res.data !== null){
      articleVo.value = res.data;
      console.log(articleVo.value)
  }else {
    console.log("请求数据出错!")
    isShow.value = true
  }

  const anchors = proxy.$refs.preview.$el.querySelectorAll('h1,h2,h3,h4,h5,h6')
  console.log('%c [ anchors ]-35', 'font-size:13px; background:pink; color:#bf2c9f;', anchors)
  const title = Array.from(anchors).filter((title: any) => {
    return !!title.innerText.trim()
  })
  if (!title.length) {
    state.titleData = []
    return
  }
  const hTags = Array.from(
      new Set(
          title.map((title: any) => {
            return title.tagName
          })
      )
  ).sort()
  state.titleData = title.map((el: any) => {
    return {
      title: el.innerText,
      lineIndex: el.getAttribute('data-v-md-line'),
      indent: hTags.indexOf(el.tagName)
    }
  })
})

const back = ()=> {
  router.back();
}

function handleAnchorClick(anchor: any) {
  const {lineIndex} = anchor
  const heading = preview.value.$el.querySelector(`[data-v-md-line="${lineIndex}"]`)
  if (heading) {
    preview.value.scrollToTarget({
      target: heading,
      scrollContainer: window,
      top: 60
    })
  }
}


</script>

<style scoped>
.post-detail-container {
  margin: 15px auto 0;
  width: 965px;
  padding-bottom: 30px;
}

.detail-pageheader {
  height: 80px;
  width: 600px;
  float: left;
  margin-bottom: 10px;
}

.v-md-preview {
  float: left;
  width: 650px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.detail-right {
  float: right;
  width: 280px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.detail-right .one {
  background-color: white;
  height: 202px;
  padding: 15px;
}

.detail-right .two {
  background-color: white;

  margin-bottom: 16px;
}

.anchor-tag {
  margin: 5px;
}

.anchor-tag a {
  color: #9b9999;
  margin: 17px;
  font-size: 15px;
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