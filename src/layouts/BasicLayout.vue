<template>
  <div class="container">

    <div class="header">
      <div style="float: left; height: 65px;padding-top: 11px">
        <img :src="logo"  style="width: 150px;margin-top: 7px" @click="()=>{router.push('/')}">
      </div>

      <div style="height:65px;padding-top: 8px;float: left; margin-left: 20%;">
        <a-input-search
            style="width: 345px;margin-top:10px"
            v-model:value="searchText"
            v-if="isShowSearch"
            placeholder="搜索文章"
            enter-button
            @search="onSearch"
        />
<!--        toRaw(router).currentRoute.value.path === '/'-->
      </div>

      <div style="float: right;margin-left: 50px">
          <a-menu v-model:selectedKeys="current" style="height: 64px " mode="horizontal">

          <a-menu-item  key="index" style="padding-top: 8px;  border-bottom: none;" >
            <template #icon>
              <home-outlined />
            </template>
            <router-link to="/">首页&nbsp;</router-link>
          </a-menu-item>
          <a-menu-item key="postEdit"  style="padding-top: 8px;" @click="doPostEdit()">
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
import SearchPage from "../pages/SearchPage.vue";
const router = useRouter()
const route = useRoute();
const isShowSearch = ref(false);
const searchText = ref('')

const current = ref<string[]>(['index']);

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
    isShowSearch.value = true
    current.value = ['index'];
  }
  else if (patt.test(path)){ //文章编辑页
    current.value = ['postEdit'];
    isShowSearch.value = false
  }
  // else if (pattSearch.test(path)){// 搜索页
  //   isShowSearch.value = true
  //   // none都未选中
  //   current.value = ['none'];
  // }
  else { // 其他页
    // none都未选中
    current.value = ['none'];
    isShowSearch.value = false
  }
})

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
</script>

<style>
.header{
  z-index: 999;
  /*position: fixed;*/
  width: 100%;
  height: 65px;
  background-color: white;
  padding: 0px 9% 0px;
  box-shadow: 0px 13px 10px -15px #1890ff;
  min-width: 1194px;
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
