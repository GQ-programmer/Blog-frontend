<template>
  <div class="search_container">
    <div class="s_pageHeader">
        <div style="">
          <a-input-search
              style="width: 560px;"
              v-model:value="searchText"
              placeholder="搜索文章"
              enter-button
              @search="onSearch"
          />
       </div>
    </div>
    <div class="main">
      <div style="text-align: center"><a-spin :spinning="loading"/></div>
        <a-list
          style="background-color: white;border-radius: 4px;"
          item-layout="vertical"
          size="large"
          :locale="{emptyText:'未搜索出结果'}"
          :pagination="pagination"
          :data-source="list"
          :loading="initLoading"
      >
        <template #loadMore>
          <div
              v-if="!initLoading && !loading"
              :style="{ textAlign: 'center', marginTop: '12px', height: '45px', lineHeight: '32px' }"
          >
            <a-button v-show="false" style="margin-bottom: 10px" type="link" @click="onLoadMore">
              加载更多
              <caret-down-outlined />
            </a-button>
          </div>
        </template>

        <template #renderItem="{ item }">
          <a-list-item key="item.title">
            <a-list-item-meta style="font-weight: 10px" :description="`发布时间：${dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}`">
              <template #title>
                <a @click="doPostDetail(item.id)" :href="item.href">{{item.title}}</a>
              </template>
              <template #avatar>
                <a-avatar :src="`${item.userAvataUrl}`"/>
              </template>
            </a-list-item-meta>

          </a-list-item>
        </template>
      </a-list>
      </div>

  </div>

</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { onMounted, ref, nextTick} from 'vue';
import { CaretDownOutlined, SearchOutlined } from '@ant-design/icons-vue';
import {baseURL} from "../config/constant";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
const router = useRouter()
const route = useRoute()
const searchText = ref<string>('')
const getSearchText = () => {
  return searchText.value
}
// todo 后续优化为分页查询
const count = 50;
// const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
const fakeDataUrl = `${baseURL}article/search?searchNum=${count}&searchText=${getSearchText()}`;

const initLoading = ref(true);
const loading = ref(false);
const data = ref([]);
const list = ref([]);
onMounted(async () => {
  searchText.value = route.params.searchText as  string
  onSearch();

});

const doPostDetail = (id:number) => {
  router.push({
    name:'PostDetail',
    params:{
      id
    }
  })
}

const onSearch = async () => {
  let searchValue = searchText.value
  searchValue = searchValue.replace(/\s*/g,"");

  if (searchValue.length < 1 || searchText.value === ''){return}
  initLoading.value = true
  const res = await myAxios.get("/article/search", {
    params:{
      searchNum: count,
      searchText: searchValue
    }
  })
  if (res.code === 0 && res.data !== null) {
    setTimeout(()=> {
      initLoading.value = false;
    },400)
    if (res.data.length < 1) {
      list.value = [];
    }else {
      list.value = res.data;
    }
  }else {
    setTimeout(()=> {
      initLoading.value = false;
    },400)
    list.value = [];
  }

}

</script>

<style scoped>
.search_container {
  /*background-color: white;*/
  width: 600px;
  height: 400px;
  margin: 0 auto;
  margin-top: 10px;
}

.s_pageHeader {
  /* border: red solid 1px; */
  background-color: white;
  border-radius: 4px;
  width: 600px;
  height: 50px;
  padding-left: 21px;
  padding-right: 10px;
  padding-top: 8px;
}

.main {
  /*border: red solid 1px;*/
  margin-top: 10px;
  width: 600px;
  /*height: 40px;*/
}

:deep(.ant-list-vertical .ant-list-item-meta) {
  margin-bottom: 0px;
}
:deep(.ant-list-vertical .ant-list-item-meta-title) {
    margin-bottom: 5px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    line-height: 24px;
}
:deep(.ant-list-item-meta-title > a) {
  color: #5d5a5a;
  transition: all 0.3s;
  font-family: 等线;
}
:deep(ant-list-item-meta-description) {
    color: rgba(0, 0, 0, 0.45);
    font-size: 13px;
    line-height: 1.5715;
}
</style>