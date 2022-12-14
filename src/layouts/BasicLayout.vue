<template>
  <div class="container">

    <div class="header">
      <div style="float: left">
        <img :src="logo"  style="width: 150px;margin-top: 7px">
      </div>

      <div style="float: left; margin-left: 177px;">
        <a-input-search
            style="width: 250px;margin-top:10px"
            v-model:value="value"
            v-if="toRaw(router).currentRoute.value.path === '/'"
            placeholder="搜索文章"
            enter-button
            @search="onSearch"
        />
      </div>

      <div style="float: right;margin-left: 50px">
          <a-menu v-model:selectedKeys="current" style=" " mode="horizontal">

          <a-menu-item  key="index"    style="padding-bottom: 8px">
            <template #icon>
              <home-outlined />
            </template>
            <router-link to="/">首页</router-link>
          </a-menu-item>
          <a-menu-item key="postEdit" @click="doPostEdit()">
            <template #icon>
              <file-markdown-outlined />
            </template>
            发布文章
          </a-menu-item>
        </a-menu>
      </div>

    </div>

  <!--  <div style="width: 100%;height: 50px"></div>-->
    <div class="content">
        <router-view/>

    </div>
  </div>
</template>
<script lang="ts" setup>
import logo from '../assets/logo.png'
import {defineComponent, getCurrentInstance, onMounted, ref, toRaw, watchEffect} from 'vue';
import { HomeOutlined, FileMarkdownOutlined,UserOutlined } from '@ant-design/icons-vue';
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {message} from "ant-design-vue";
import getCurrentUser from "../plugins/user";
const router = useRouter()
const route = useRoute();


const current = ref<string[]>(['index']);

/**
 * 根据路由 展示导航item active状态
 */
watchEffect(() =>{
  const path = route.path;
  var patt= /^\/postEdit/g;
  console.log(path)
  if (path === '/'){
    current.value = ['index'];
  }else if (patt.test(path)){
    current.value = ['postEdit'];
  }else {
    // none都未选中
    current.value = ['none'];
  }
})

/**
 * 点击发布文章事件
 */
const doPostEdit = async () => {
  console.log( "@@@"+route.fullPath)
  const currentUser = await getCurrentUser();
  if (currentUser === null) {
    message.error("你还未登录！");
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
  // alert(toRaw(router).currentRoute.value.path)
  message.warn("暂未实现，等待后续版本!")
}
</script>

<style>
.header{
  z-index: 999;
  /*position: fixed;*/
  width: 100%;
  height: 65px;
  background-color: white;
  padding: 10px 9% 0px;
  box-shadow: 0px 13px 10px -15px #1890ff;
  min-width: 1047px;
}
.header-title{
  color:black;
  font-family: Consolas;font-size: 16px;
  font-weight: 500;
  margin-left: 10px;
  margin-top: 5px;
}
.content{
  background-color: #f6f5f5;
  width: 100%;
  margin: 0px auto 0;
  /*padding: 10px;*/
  /*box-shadow: 0px 15px 20px -15PX black;*/
}
</style>
