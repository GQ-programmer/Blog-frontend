<template>
  <div class="header">
    <div style="display: inline">
      <img :src="logo"  style="width: 150px;margin-top: 7px">
    </div>

    <div style="display: inline;float: right;margin-left: 50px">
        <a-menu v-model:selectedKeys="current" style=" " mode="horizontal">

        <a-menu-item  key="mail" style="padding-bottom: 8px">
          <template #icon>
            <home-outlined />
          </template>
          <router-link to="/">首页</router-link>
        </a-menu-item>
        <a-menu-item key="app" @click="doPostEdit()">
          <template #icon>
            <file-markdown-outlined />
          </template>
          发布文章
        </a-menu-item>
<!--        <a-sub-menu>-->
<!--          <template #icon>-->

<!--          </template>-->
<!--          <template #title>-->
<!--            <a-avatar src="https://joeschmoe.io/api/v1/random" />-->
<!--            个人中心-->
<!--          </template>-->
<!--          <a-menu-item key="setting:1">-->
<!--            <router-link to="/user/info">个人信息</router-link>-->
<!--          </a-menu-item>-->
<!--          <a-menu-item>-->
<!--            <router-link to="/user/edit">个人设置</router-link></a-menu-item>-->
<!--          <a-menu-item key="setting:2">-->
<!--            <router-link to="/user/login">退出登录</router-link>-->
<!--          </a-menu-item>-->
<!--        </a-sub-menu>-->

      </a-menu>
    </div>
    <div style="display: inline;float: right">
      <a-input-search
          style="width: 250px;margin-top:10px"
          v-model:value="value"
          v-if="toRaw(router).currentRoute.value.path === '/'"
          placeholder="搜索关键词"
          enter-button
          @search="onSearch"
      />
    </div>
  </div>

<!--  <div style="width: 100%;height: 50px"></div>-->
  <div class="content">
      <router-view/>
  </div>


</template>
<script lang="ts" setup>
import logo from '../assets/logo.png'
import {defineComponent, ref, toRaw} from 'vue';
import { HomeOutlined, FileMarkdownOutlined,UserOutlined } from '@ant-design/icons-vue';
import {useRouter} from "vue-router";
const router = useRouter()
const user = ref({})

const current = ref<string[]>(['mail']);
const doPostEdit = () => {
  router.push('/postEdit')
}
const onSearch = () => {
  alert(toRaw(router).currentRoute.value.path)
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
