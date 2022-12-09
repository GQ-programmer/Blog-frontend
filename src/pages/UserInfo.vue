<template>
  <div class="user-info-container">

    <a-row>
      <a-col class="a-col-left" :xs="24" :lg="8" style="">

        <a-col  :span="24" style="text-align: center">
          <a-avatar  :size="64" src="https://joeschmoe.io/api/v1/random" />
        </a-col>
        <a-col  :span="24" style="text-align: center;margin-top: 10px">
          <a-typography-title :level="4">GQ学编程</a-typography-title>
        </a-col>
        <a-col   :span="24" style="text-align: center">
          <a-typography-text type="secondary">CV专家、Vue学习中~</a-typography-text>
        </a-col>
        <a-col  class="a-col" :span="24" style="margin-top: 20px;">
          <mail-outlined />
          <a-typography-text >&nbsp;邮箱：3213821843@qq.com</a-typography-text>
        </a-col>
        <a-col  class="a-col" :span="24" style="">
          <home-outlined />
          <a-typography-text >&nbsp;地区：浙江杭州市</a-typography-text>
        </a-col>
        <a-col  class="a-col" :span="24" style="">
          <profile-outlined />
          <a-typography-text >&nbsp;出生日期：2002-04-14</a-typography-text>
        </a-col>
        <a-col  class="a-col" :span="24" style="">
          <user-outlined />
          <a-typography-text >&nbsp;性别：男</a-typography-text>
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



      </a-col>

      <a-col class="a-col-right" xs="24" :lg="15" style="">
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
          <template #footer>
            <div>
              <b>ant design vue</b>
              footer part
            </div>
          </template>
          <template #renderItem="{ item }">
            <a-list-item key="item.title">
              <template #actions>
          <span v-for="{ type, text } in actions" :key="type">
            <component :is="type" style="margin-right: 8px" />
            {{ text }}
          </span>
              </template>
              <template #extra>
                <img
                    width="272"
                    alt="logo"
                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                />
              </template>
              <a-list-item-meta :description="item.description">
                <template #title>
                  <a :href="item.href">{{ item.title }}</a>
                </template>
                <template #avatar><a-avatar :src="item.avatar" /></template>
              </a-list-item-meta>
              {{ item.content }}
            </a-list-item>
          </template>
        </a-list>
      </a-col>
    </a-row>

  </div>
</template>

<script lang="ts" setup>
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';
import {MailOutlined,HomeOutlined,ProfileOutlined,UserOutlined} from '@ant-design/icons-vue';
const listData: Record<string, string>[] = [];

for (let i = 0; i < 23; i++) {
  listData.push({
    href: 'https://www.antdv.com/',
    title: `ant design vue part ${i}`,
    avatar: 'https://joeschmoe.io/api/v1/random',
    description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}
const pagination = {
  onChange: (page: number) => {
    console.log(page);
  },
  pageSize: 3,
};
const actions: Record<string, string>[] = [
  { type: 'StarOutlined', text: '156' },
  { type: 'LikeOutlined', text: '156' },
  { type: 'MessageOutlined', text: '2' },
];
</script>

<style scoped>
.user-info-container{
  margin: 0 auto;
  width: 65%;
}
.a-col-left{
  background-color: white;
  box-shadow: 15px 15px 20px -30PX black;
  margin-left: 0px;
  height: 500px;
  padding: 10px;
}
.a-col-right{
  background-color: white;
  margin-left: 28px;
  box-shadow: 15px 15px 20px -30PX black;
}
.a-col{
  margin-top: 10px;
  margin-left: 40px;

}

</style>