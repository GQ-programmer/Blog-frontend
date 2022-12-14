<template>
  <div class="user-info-container" v-if="user">
    <div class="info-pageheader">
      <div style="float: left;margin-left: 15px" @click="back()">
        <a style="color: black">
          <left-outlined style="font-size: 23px;color:grey ;margin-top: 18px"/>
        </a>
      </div>
      <div style="float: left;font-size:16px;margin-top: 15px;margin-left: 5px">
        <div style="display: inline;color:grey ;">返回</div>
      </div>
      <div style="float: left;font-size:16px;margin-top: 18px;margin-left: 344px">
        <div style="display: inline;">用户信息</div>
      </div>
    </div>

    <div>
      <div class="a-col-left" >

        <a-col  :span="24" style="text-align: center">
          <a-avatar :size="64" v-if="!user.avatarUrl">
            <template #icon>
              <UserOutlined/>
            </template>
          </a-avatar>
          <a-avatar  :size="64" :src="user.avatarUrl" v-if="user.avatarUrl"/>
        </a-col>
        <a-col  :span="24" style="text-align: center;margin-top: 10px">
          <a-typography-title :level="4">{{user.username}}</a-typography-title>
        </a-col>
        <a-col   :span="24" style="text-align: center">
          <a-typography-text type="secondary" v-show="user.description === ''">这个人很懒，没有个性签名~</a-typography-text>
          <a-typography-text type="secondary" v-show="user.description !== ''">{{user.description}}</a-typography-text>
        </a-col>
        <a-col  class="a-col" :span="24" style="margin-top: 20px;">
          <mail-outlined />
          <a-typography-text v-show="user.email === ''">&nbsp;邮箱：未设置</a-typography-text>
          <a-typography-text v-show="user.email !== ''">&nbsp;邮箱：{{user.email}}</a-typography-text>
        </a-col>
        <a-col  class="a-col" :span="24" style="">
          <home-outlined />
          <a-typography-text v-show="user.area === ''">&nbsp;地区：未设置</a-typography-text>
          <a-typography-text v-show="user.area !== ''">&nbsp;地区：{{user.area}}</a-typography-text>
        </a-col>
        <a-col  class="a-col" :span="24" style="">
          <profile-outlined />
          <a-typography-text v-show="user.birthday === ''">&nbsp;出生日期：未设置</a-typography-text>
          <a-typography-text v-show="user.birthday !== ''">&nbsp;出生日期：{{user.birthday}}</a-typography-text>
        </a-col>
        <a-col  class="a-col" :span="24" style="">
          <user-outlined />
          <a-typography-text v-show="user.gender === ''">&nbsp;性别：未设置</a-typography-text>
          <a-typography-text v-show="user.gender !== ''">&nbsp;性别：{{user.gender}}</a-typography-text>
        </a-col>
        <a-divider />
        <a-col   :span="24" style="margin-left: 10px">
          标签
        </a-col>
        <a-col   :span="24" style="margin-left: 10px;margin-top: 10px">
          <a-tag>Tag 1</a-tag>
          <a-tag>Tag 1</a-tag>
          <a-tag>Tag 1</a-tag>
          <a-tag>Tag 1</a-tag>
        </a-col>
      </div>

      <div class="a-col-right" >

          <div>
            <a-typography-title :level="5">用户所有文章</a-typography-title>
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

                <a-list-item-meta >
                  <template #title>
                    <a @click="doDetail(item)" :href="item.href">{{`${item.title}` }}</a>
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
                    @change="doListData(user.id)"
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
    </div>

  </div>

</template>

<script lang="ts" setup>
import {MailOutlined,HomeOutlined,LeftOutlined,ProfileOutlined,UserOutlined} from '@ant-design/icons-vue';
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {message} from "ant-design-vue";
import dayjs from "dayjs";

const route = useRoute()

const user = ref()
const router = useRouter()
const listData = ref([]);
const currentPageNum = ref(1);
const totalNum = ref(0)
const pageSize = ref(5)
const pageSizeOptions = ref<string[]>(['5', '10', '15', '20']);

onMounted(async () => {
  let userId = route.params.userId;
  const res = await myAxios('/user/get',{
    params:{
      userId
    }
  })
  if (res.code === 0 && res.data !== null){
    user.value = res.data
  }else {
     console.log("请求数据为空!")
  }
  doListData(userId);
})

/**
 * 获取文章列表
 */
const doListData = async (userId:number) => {
  const articleRes = await myAxios.get('/article/listPageByUserId',{
    params:{
      currentPageNum:currentPageNum.value,
      pageSize:pageSize.value,
      userId
    }
  });
  if (articleRes.code === 0 && articleRes.data !== null){
    listData.value = articleRes.data.records;
    totalNum.value = articleRes.data.total;
  } else {
    message.error("获取文章信息出错!")
  }
}
const back = () => {
  router.back();
}
/**
 * 进入文章详情
 * @param item
 */
const doDetail = async (item) => {
  router.push({
    name:'PostDetail',
    params:{
      id:item.id
    }
  })
}


</script>

<style scoped>
.user-info-container{
  margin:13px  auto 0;
  width: 900px;
}
.info-pageheader{
  width: 900px;
  height: 55px;
  background-color: white;
  margin-bottom: 10px;

}
.a-col-left{
  background-color: white;
  box-shadow: 15px 15px 20px -30PX black;
  margin-left: 0px;
  height: 500px;
  width: 300px;
  float: left;
  padding: 37px 10px 10px;
}
.a-col-right{
  background-color: white;
  margin-left: 28px;
  padding-top: 20px;
  width: 572px;
  float: left;
  box-shadow: 15px 15px 20px -30PX black;
  padding: 20px;
}
.a-col{
  margin-top: 10px;
  margin-left: 40px;

}
:deep(.ant-list-vertical .ant-list-item-meta) {
  margin-bottom: 10px;
}
</style>